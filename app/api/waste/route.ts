import { NextResponse } from 'next/server';
import { adminDb, admin } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { WasteStatus } from '@/lib/types/waste-status';
import { wasteSchema, wasteStatusSchema } from '@/lib/validation/schemas';
import { createErrorResponse, createValidationErrorResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/api-handler';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    await authorize(session, ['USER', 'COLLECTOR', 'ADMIN']);
    const { user } = session!;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let wasteRef: admin.firestore.Query = adminDb.collection('waste');

    if (status) {
      const statusValidation = wasteStatusSchema.safeParse(status);
      if (!statusValidation.success) {
        return createValidationErrorResponse(statusValidation.error, "Invalid status. Accepted values: pending, collected, completed");
      }
      wasteRef = wasteRef.where('status', '==', statusValidation.data);
    }

    switch (user.role) {
      case 'ADMIN':
        break;
      case 'USER':
        wasteRef = wasteRef.where('userId', '==', user.id);
        break;
      case 'COLLECTOR':
        wasteRef = wasteRef.where('assignedCollectorId', '==', user.id);
        break;
      default:
        return createErrorResponse('Forbidden', undefined, 403);
    }

    const snapshot = await wasteRef.orderBy('createdAt', 'desc').get();
    
    const wasteItems = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      
      // Fetch user and collector data manually as Firestore doesn't support joins
      const [userDoc, collectorDoc] = await Promise.all([
        adminDb.collection('users').doc(data.userId).get(),
        data.assignedCollectorId ? adminDb.collection('users').doc(data.assignedCollectorId).get() : Promise.resolve(null)
      ]);

      const userData = userDoc.exists ? userDoc.data() : null;
      const collectorData = (collectorDoc && collectorDoc.exists) ? collectorDoc.data() : null;

      return {
        id: doc.id,
        ...data,
        user: userData ? { name: userData.name, email: userData.email } : null,
        assignedCollector: collectorData ? { name: collectorData.name, email: collectorData.email } : null,
      };
    }));

    return NextResponse.json(wasteItems);
  } catch (error) {
    return handleApiError(error, 'GET /api/waste');
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    await authorize(session, ['USER', 'COLLECTOR', 'ADMIN']);

    const body = await req.json();
    const validation = wasteSchema.safeParse(body);

    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }

    const { imageUrl, description, status } = validation.data;

    if (!imageUrl && !description) {
      return createErrorResponse('Image URL or description is required', undefined, 400);
    }

    const newWaste = {
      userId: session!.user.id,
      imageUrl: imageUrl || '',
      description: description || null,
      status: status || WasteStatus.Pending,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('waste').add(newWaste);

    return NextResponse.json({ id: docRef.id, ...newWaste }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/waste');
  }
}
