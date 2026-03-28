import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export interface SendSMSOptions {
  to: string;
  message: string;
}

/**
 * Send SMS via Twilio
 * @param options SMS options (to, message)
 * @returns Promise<boolean> - true if sent successfully, false otherwise
 */
export async function sendSMS({ to, message }: SendSMSOptions): Promise<boolean> {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      console.warn('Twilio credentials not configured. SMS not sent.');
      return false;
    }

    await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to,
    });

    console.log(`SMS sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}
