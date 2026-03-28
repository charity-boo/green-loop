import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { handleApiError } from '@/lib/api-handler';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { hostelId, type, message } = data;

    if (!hostelId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: hostelId, type' },
        { status: 400 }
      );
    }

    // Prepare report data
    const reportData = {
      hostelId,
      type,
      message: message || '',
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Store in Firestore
    const reportRef = await adminDb.collection('hostel_reports').add(reportData);

    return NextResponse.json({
      success: true,
      id: reportRef.id,
      message: 'Report submitted successfully'
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/hostels/reports');
  }
}
