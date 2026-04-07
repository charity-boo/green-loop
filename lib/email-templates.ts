/**
 * Email Templates for Green Loop
 */

interface PasswordResetEmailData {
  email: string;
  resetLink: string;
  expiresIn: string;
}

interface BookingConfirmationData {
  propertyName: string;
  contactPerson: string;
  email: string;
  tier: string;
  location: string;
}

export function generateBookingConfirmationEmail(data: BookingConfirmationData): { subject: string; text: string; html: string } {
  const { propertyName, contactPerson, tier, location } = data;

  const subject = `Booking Confirmation: ${tier} Waste Management Plan - ${propertyName}`;

  const text = `
Hello ${contactPerson},

Thank you for choosing Green Loop for your property's waste management. We have received your booking for the ${tier} plan.

Booking Details:
- Property: ${propertyName}
- Location: ${location}
- Plan: ${tier}

Our team will contact you within the next 24 hours to finalize the setup and coordinate the installation of your bin sets.

If you have any questions, please reply to this email or contact us through our website.

Best regards,
The Green Loop Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #16a34a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmation</h1>
  </div>
  
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${contactPerson}</strong>,</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Thank you for choosing Green Loop. We've received your booking for the <strong>${tier}</strong> waste management plan for <strong>${propertyName}</strong>.
    </p>
    
    <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin: 25px 0; border-radius: 4px;">
      <h2 style="font-size: 18px; color: #16a34a; margin-top: 0; margin-bottom: 15px;">Booking Summary</h2>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Property:</strong> ${propertyName}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Location:</strong> ${location}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Service Plan:</strong> ${tier}</p>
      <p style="margin: 5px 0; font-size: 14px;"><strong>Status:</strong> Pending Confirmation</p>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Our team will contact you within the next <strong>24 hours</strong> to finalize the setup and coordinate the installation of your bin sets.
    </p>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      If you have any urgent questions, please feel free to reply to this email or reach out via our contact page.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p style="margin: 5px 0;">© ${new Date().getFullYear()} Green Loop. All rights reserved.</p>
    <p style="margin: 5px 0;">Ndagani, Chuka - Building a sustainable future together 🌱</p>
  </div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}

export function generatePasswordResetEmail(data: PasswordResetEmailData): { subject: string; text: string; html: string } {
  const { email, resetLink, expiresIn } = data;

  const subject = 'Reset Your Green Loop Password';

  const text = `
Hello,

You requested to reset your password for your Green Loop account (${email}).

Click the link below to reset your password:
${resetLink}

This link will expire in ${expiresIn}.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The Green Loop Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
  </div>
  
  <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      You requested to reset your password for your Green Loop account (<strong>${email}</strong>).
    </p>
    
    <p style="font-size: 16px; margin-bottom: 30px;">
      Click the button below to reset your password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" 
         style="background-color: #22c55e; 
                color: white; 
                padding: 14px 32px; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: bold;
                font-size: 16px;
                display: inline-block;
                box-shadow: 0 4px 6px rgba(34, 197, 94, 0.3);">
        Reset Password
      </a>
    </div>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      Or copy and paste this link into your browser:
    </p>
    <p style="font-size: 14px; color: #22c55e; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 4px;">
      ${resetLink}
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">
        ⏰ This link will expire in <strong>${expiresIn}</strong>.
      </p>
      <p style="font-size: 14px; color: #6b7280;">
        🔒 If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p style="margin: 5px 0;">© ${new Date().getFullYear()} Green Loop. All rights reserved.</p>
    <p style="margin: 5px 0;">Building a sustainable future together 🌱</p>
  </div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}
