import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { handleApiError } from '@/lib/api-handler';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Basic validation
    const {
      fullName,
      email,
      phone,
      issueType,
      location,
      dateTime,
      description,
      preferredContact,
      imageFile // This will be a string (filename or URL) if handled via separate upload or base64
    } = data;

    if (!fullName || !email || !issueType || !description) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Save report to Firestore
    const reportRef = await adminDb.collection('reports').add({
      fullName,
      email,
      phone,
      issueType,
      location,
      dateTime,
      description,
      preferredContact,
      imageFile,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });

    const reportId = reportRef.id;

    // Simulate sending SMS confirmation
    if (preferredContact === 'sms' && phone) {
      console.log(`Simulating SMS to ${phone} for report ID ${reportId}`);
      // Integrate with an SMS service provider here
    }

    // Simulate sending email confirmation
    console.log(`Simulating email to ${email} for report ID ${reportId}`);
    // Integrate with an email service provider here

    return NextResponse.json(
      {
        message: 'Report submitted successfully!',
        reportId,
        confirmation: {
          emailSent: true,
          smsSent: preferredContact === 'sms' && phone ? true : false,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'POST /api/report-issue');
  }
}
