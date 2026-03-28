import { NextRequest, NextResponse } from 'next/server';
import { adminDb, admin } from '@/lib/firebase/admin';
import { handleApiError } from '@/lib/api-handler';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, subject, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Save to contact_messages collection
    const contactRef = await adminDb.collection('contact_messages').add({
      name,
      email,
      subject: subject || 'No Subject',
      message,
      status: 'NEW',
      createdAt: new Date().toISOString()
    });

    const contactId = contactRef.id;

    // 2. Add notification for ADMINs
    try {
      await adminDb.collection('notifications').add({
        role: 'ADMIN',
        title: 'New Contact Message',
        message: `New message from ${name} (${email}): ${subject || 'No Subject'}`,
        type: 'info',
        status: 'unread',
        createdAt: new Date().toISOString()
      });
    } catch (notifError) {
      console.error('Error adding admin notification:', notifError);
    }

    // 3. Send confirmation email to user
    try {
      await sendEmail({
        to: email,
        subject: `Green Loop: We received your message`,
        text: `Hi ${name},\n\nThank you for reaching out to Green Loop. We have received your message regarding "${subject || 'No Subject'}" and our team will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\nThe Green Loop Team`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #059669; text-align: center;">Message Received</h2>
            <p>Hi ${name},</p>
            <p>Thank you for reaching out to Green Loop. We have received your message and our team will get back to you shortly.</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #f3f4f6;">
              <p style="margin: 0;"><strong>Subject:</strong> ${subject || 'No Subject'}</p>
              <p style="margin: 10px 0 0 0;"><strong>Message:</strong></p>
              <p style="background-color: #fff; border: 1px solid #eee; padding: 10px; border-radius: 4px; font-style: italic; margin-top: 5px;">${message}</p>
            </div>
            <p>Best regards,<br/>The Green Loop Team</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666; text-align: center;">This is an automated message from Green Loop.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email to user:', emailError);
    }

    // 4. Send notification email to admin
    try {
      const adminEmail = process.env.SMTP_USER;
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `ADMIN ALERT: New Contact Message from ${name}`,
          text: `A new message has been received through the contact form.\n\nFrom: ${name} (${email})\nSubject: ${subject || 'No Subject'}\nMessage: ${message}\n\nView in admin dashboard: https://greenloop.co/admin/dashboard/moderation`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ef4444; border-radius: 12px;">
              <h2 style="color: #ef4444; text-align: center;">New Admin Inquiry</h2>
              <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #fee2e2;">
                <p style="margin: 0;"><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                <p style="margin: 5px 0 0 0;"><strong>Subject:</strong> ${subject || 'No Subject'}</p>
              </div>
              <p><strong>Message Content:</strong></p>
              <p style="background-color: #fff; border: 1px solid #eee; padding: 10px; border-radius: 4px;">${message}</p>
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://greenloop.co/admin/dashboard/moderation" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review Inquiry</a>
              </div>
            </div>
          `,
        });
      }
    } catch (adminEmailError) {
      console.error('Error sending notification email to admin:', adminEmailError);
    }

    return NextResponse.json(
      { message: 'Message sent successfully!', contactId },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'POST /api/contact');
  }
}
