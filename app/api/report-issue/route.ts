import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { handleApiError } from '@/lib/api-handler';
import { sendEmail } from '@/lib/email';
import { sendSMS } from '@/lib/sms';

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

    // Send SMS confirmation if requested
    if (preferredContact === 'sms' && phone) {
      try {
        const smsMessage = `Green Loop: Your issue report has been received. Report ID: ${reportId}. We will contact you within 24 hours. Thank you!`;
        const smsSent = await sendSMS({ to: phone, message: smsMessage });
        
        if (smsSent) {
          console.log(`SMS sent successfully to ${phone} for report ID ${reportId}`);
        } else {
          console.warn(`SMS sending failed for ${phone}, report ID ${reportId}`);
        }
      } catch (smsError) {
        console.error(`Error sending SMS for report ID ${reportId}:`, smsError);
        // Continue processing - SMS failure should not block the report
      }
    }

    // Send email confirmation via Gmail SMTP
    try {
      await sendEmail({
        to: email,
        subject: `Green Loop: Issue Report Received - #${reportId}`,
        text: `Hi ${fullName},\n\nThank you for reporting an issue to Green Loop. We have received your report and are investigating it.\n\nReport ID: ${reportId}\nIssue Type: ${issueType}\nDescription: ${description}\n\nWe will get back to you within 24 hours.\n\nThank you for helping us keep our community clean!`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h2 style="color: #059669; text-align: center;">Issue Report Received</h2>
              <p>Hi ${fullName},</p>
              <p>Thank you for bringing this to our attention. We have received your report and our team is currently reviewing it.</p>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #f3f4f6;">
                <p style="margin: 0;"><strong>Report ID:</strong> ${reportId}</p>
                <p style="margin: 5px 0 0 0;"><strong>Issue Type:</strong> ${issueType}</p>
                <p style="margin: 5px 0 0 0;"><strong>Status:</strong> PENDING</p>
              </div>
              <p><strong>Description:</strong></p>
              <p style="background-color: #fff; border: 1px solid #eee; padding: 10px; border-radius: 4px; font-style: italic;">${description}</p>
              <p>We will keep you updated on the progress of your report.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666; text-align: center;">This is an automated message from Green Loop.</p>
            </div>
          `,
      });
      console.log(`Email sent for report ID ${reportId}`);
    } catch (emailError) {
      console.error(`Error creating email document for report ID ${reportId}:`, emailError);
    }

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
