import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { handleApiError } from '@/lib/api-handler';
import { Inquiry } from '@/types/firestore';

const getCollectionForInquiryType = (type: Inquiry['type']) => {
  switch (type) {
    case 'Hostel Booking':
      return 'hostel_bookings';
    case 'Contact Message':
      return 'contact_messages';
    case 'Issue Report':
      return 'reports';
    default:
      return null;
  }
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status, type } = await req.json();

    if (!id || !status || !type) {
      return NextResponse.json(
        { message: 'Missing inquiry ID, status, or type' },
        { status: 400 }
      );
    }

    const collectionName = getCollectionForInquiryType(type);
    if (!collectionName) {
      return NextResponse.json(
        { message: 'Invalid inquiry type' },
        { status: 400 }
      );
    }

    const inquiryRef = adminDb.collection(collectionName).doc(id);

    await inquiryRef.update({
      status: status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/admin/inquiries/[id]');
  }
}
