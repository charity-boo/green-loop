import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { handleApiError } from '@/lib/api-handler';
import { sendEmail } from '@/lib/email';
import { generateBookingConfirmationEmail } from '@/lib/email-templates';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      propertyName,
      location,
      contactPerson,
      email,
      tier,
      placeId,
      latitude,
      longitude,
      county,
      region,
      source,
    } = body;

    if (!propertyName || !location || !contactPerson || !email || !tier) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await adminDb.collection('hostel_bookings').add({
      propertyName,
      location,
      contactPerson,
      email,
      tier,
      placeId: placeId ?? null,
      latitude: typeof latitude === 'number' ? latitude : null,
      longitude: typeof longitude === 'number' ? longitude : null,
      county: county ?? null,
      region: region ?? null,
      locationSource: source ?? null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Send confirmation email to the manager
    const emailData = generateBookingConfirmationEmail({
      propertyName,
      contactPerson,
      email,
      tier,
      location
    });

    try {
      await sendEmail({
        to: email,
        ...emailData
      });

      // Also notify the admin
      await sendEmail({
        to: process.env.SMTP_USER || 'admin@greenloop.co.ke',
        subject: `New Booking Request: ${propertyName} (${tier})`,
        text: `New booking request from ${contactPerson} (${email}) for ${propertyName}. Tier: ${tier}. Location: ${location}.`,
        html: `
          <h3>New Booking Request</h3>
          <p><strong>Property:</strong> ${propertyName}</p>
          <p><strong>Contact:</strong> ${contactPerson} (${email})</p>
          <p><strong>Plan:</strong> ${tier}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Booking ID:</strong> ${docRef.id}</p>
        `
      });
    } catch (emailErr) {
      console.error('Email notification failed but booking was saved:', emailErr);
      // We don't fail the request if email fails, as the booking is in the database
    }

    return NextResponse.json({ success: true, bookingId: docRef.id }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/hostels/book');
  }
}
