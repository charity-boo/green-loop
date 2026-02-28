import { setGlobalOptions } from "firebase-functions";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { FieldValue, GeoPoint, Timestamp } from "firebase-admin/firestore";
import * as nodemailer from "nodemailer";

setGlobalOptions({ maxInstances: 10 });

// Initialize Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `Green Loop <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

interface WasteReport {
  userId: string;
  userName: string;
  imageUrl: string;
  status: string;
  location?: GeoPoint;
  createdAt?: Timestamp;
}

interface ClassificationResult {
  wasteType: string;
  confidence: number;
  labels: string[];
}

/**
 * Helper function to send notifications based on schedule status.
 */
async function sendScheduleNotification(scheduleId: string, data: any) {
  const status = data.status;
  const userId = data.userId;

  if (!userId || !status) {
    logger.error(`Missing userId or status for schedule: ${scheduleId}`);
    return;
  }

  // Map status to notification messages and types
  const statusConfig: Record<string, { message: string; type: string }> = {
    pending: {
      message: "Pickup request received",
      type: "SCHEDULE_PENDING",
    },
    assigned: {
      message: "Collector assigned",
      type: "SCHEDULE_ASSIGNED",
    },
    completed: {
      message: "Pickup completed",
      type: "SCHEDULE_COMPLETED",
    },
  };

  const config = statusConfig[status];

  // Exit if the status doesn't require a notification
  if (!config) {
    return;
  }

  try {
    // Idempotency guard: Check if notification already exists for this scheduleId + type
    const existingNotification = await db.collection("notifications")
      .where("scheduleId", "==", scheduleId)
      .where("type", "==", config.type)
      .limit(1)
      .get();

    if (!existingNotification.empty) {
      logger.info(`Notification already exists for schedule ${scheduleId} with type ${config.type}`);
      return;
    }

    // Fetch user document to get fcmToken
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    const fcmToken = userData?.fcmToken;

    let notificationStatus: "sent" | "failed" = "failed";
    let errorMessage: string | null = null;

    if (fcmToken) {
      try {
        await admin.messaging().send({
          token: fcmToken,
          notification: {
            title: "Green Loop Update",
            body: config.message,
          },
          data: {
            scheduleId,
            status: status,
          },
        });
        notificationStatus = "sent";
      } catch (error) {
        logger.error(`Error sending FCM notification to user ${userId}:`, error);
        errorMessage = error instanceof Error ? error.message : "Unknown FCM error";
      }
    } else {
      logger.info(`No fcmToken found for user ${userId}`);
      errorMessage = "FCM token missing";
    }

    // Log notification document
    const notificationLog: any = {
      userId,
      scheduleId,
      type: config.type,
      channel: "push",
      status: notificationStatus,
      createdAt: FieldValue.serverTimestamp(),
    };

    if (notificationStatus === "sent") {
      notificationLog.deliveredAt = FieldValue.serverTimestamp();
    } else if (errorMessage) {
      notificationLog.error = errorMessage;
    }

    await db.collection("notifications").add(notificationLog);

    // Send email notification via Gmail SMTP
    const userEmail = userData?.email;
    if (userEmail) {
      try {
        const orderID = scheduleId;
        const customerName = userData?.name || 'Valued Customer';
        const pickupLocation = data.address || 'Not specified';
        const dateTime = `${data.pickupDate || 'Not scheduled'} at ${data.timeSlot || 'any time'}`;
        const contactInfo = userData?.email || 'No contact email';
        const confirmationLink = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/dashboard/schedules/${scheduleId}`;
        const sender = process.env.SMTP_FROM ?? `Green Loop <${process.env.SMTP_USER}>`;

        // Define styles for UI/UX improvement
        const styles = {
          container: "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 12px; line-height: 1.6;",
          header: "text-align: center; margin-bottom: 24px;",
          card: "background-color: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #f3f4f6;",
          label: "font-weight: 600; color: #4b5563; display: inline-block; width: 140px;",
          button: "background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;",
          footer: "border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #9ca3af; text-align: center;",
          error: "color: #b91c1c; font-size: 14px; background: #fee2e2; padding: 10px; border-radius: 6px; margin: 10px 0;"
        };

        if (status === "pending") {
          // Customized "Pickup request received" template
          const subject = `Green Loop Update: Pickup request received #${orderID}`;
          
          // Error handling for missing data
          let missingDataNotice = "";
          if (!data.address || !data.pickupDate || !data.timeSlot) {
            logger.warn(`Schedule ${scheduleId} is missing critical data for email notification`);
            missingDataNotice = `<p style="${styles.error}"><strong>Note:</strong> Some details of your request are incomplete. Please visit your dashboard to ensure we have the correct information.</p>`;
          }

          await sendEmail(
            userEmail,
            subject,
            `Hi ${customerName},\n\nWe've received your pickup request #${orderID}.\n\nLocation: ${pickupLocation}\nTime: ${dateTime}\n\nView details: ${confirmationLink}\n\nThank you for choosing Green Loop!`,
            `
              <div style="${styles.container}">
                <div style="${styles.header}">
                  <h2 style="color: #059669; margin: 0;">Green Loop</h2>
                  <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">Sustainable Waste Management</p>
                </div>
                
                <p>Hi <strong>${customerName}</strong>,</p>
                <p>We have successfully received your waste pickup request. Our collection team has been notified and is preparing for your scheduled slot.</p>
                
                ${missingDataNotice}

                <div style="${styles.card}">
                  <h3 style="margin-top: 0; color: #111827; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Request Details</h3>
                  <p style="margin: 10px 0;"><span style="${styles.label}">Order ID:</span> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${orderID}</span></p>
                  <p style="margin: 10px 0;"><span style="${styles.label}">Waste Type:</span> <strong>${data.wasteType || 'General Waste'}</strong></p>
                  <p style="margin: 10px 0;"><span style="${styles.label}">Pickup Location:</span> ${pickupLocation}</p>
                  <p style="margin: 10px 0;"><span style="${styles.label}">Scheduled Date:</span> ${data.pickupDate || 'TBD'}</p>
                  <p style="margin: 10px 0;"><span style="${styles.label}">Time Slot:</span> ${data.timeSlot || 'TBD'}</p>
                  <p style="margin: 10px 0;"><span style="${styles.label}">Contact Info:</span> ${contactInfo}</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmationLink}" style="${styles.button}">Track Your Pickup</a>
                </div>

                <div style="font-size: 13px; color: #6b7280; background: #f3f4f6; padding: 12px; border-radius: 6px;">
                  <p style="margin: 0;"><strong>Sender:</strong> ${sender}</p>
                  <p style="margin: 4px 0 0 0;"><strong>Recipient:</strong> ${userEmail}</p>
                </div>

                <p style="margin-top: 24px;">Thank you for your contribution to a greener planet!</p>
                
                <div style="${styles.footer}">
                  <p>This is an automated message from Green Loop. Please do not reply directly to this email.</p>
                  <p>&copy; ${new Date().getFullYear()} Green Loop. All rights reserved.</p>
                </div>
              </div>
            `
          );
        } else {
          // Generic template for other status updates
          await sendEmail(
            userEmail,
            `Green Loop Update: ${config.message}`,
            `Hi ${userData?.name || 'there'},\n\nYour waste pickup status has been updated: ${config.message}.\n\nPickup ID: ${scheduleId}\nStatus: ${status}\n\nThank you for using Green Loop!`,
            `
                <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px;">
                  <h2 style="color: #059669;">Green Loop Update</h2>
                  <p>Hi ${userData?.name || 'there'},</p>
                  <p>Your waste pickup status has been updated: <strong>${config.message}</strong>.</p>
                  <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Pickup ID:</strong> ${scheduleId}</p>
                    <p style="margin: 5px 0 0 0;"><strong>Current Status:</strong> <span style="text-transform: uppercase; font-weight: bold;">${status}</span></p>
                  </div>
                  <p style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/dashboard" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Details</a>
                  </p>
                  <p>Thank you for contributing to a greener planet!</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                  <p style="font-size: 12px; color: #666; text-align: center;">This is an automated message from Green Loop.</p>
                </div>
              `
          );
        }
        logger.info(`Email sent for user ${userId} (Status: ${status})`);
      } catch (emailError) {
        logger.error(`Error sending email for user ${userId}:`, emailError);
      }
    } else {
      logger.info(`No email found for user ${userId}, skipping email notification`);
    }

    logger.info(`Notification processed for schedule ${scheduleId} type ${config.type}`);
  } catch (error) {
    logger.error(`Error sending notification for schedule ${scheduleId}:`, error);
  }
}

/**
 * Cloud Function triggered when a document is created in the schedules collection.
 */
export const onScheduleCreated = onDocumentCreated(
  "schedules/{scheduleId}",
  async (event) => {
    const scheduleId = event.params.scheduleId;
    const data = event.data?.data();

    if (!data) {
      logger.error(`No data found for created schedule: ${scheduleId}`);
      return;
    }

    await sendScheduleNotification(scheduleId, data);
  }
);

/**
 * Cloud Function triggered when a document is updated in the schedules collection.
 * Sends push notifications to users when their pickup status changes.
 */
export const onScheduleStatusChange = onDocumentUpdated(
  "schedules/{scheduleId}",
  async (event) => {
    const scheduleId = event.params.scheduleId;
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) {
      logger.error(`No data found for schedule: ${scheduleId}`);
      return;
    }

    // Exit if status unchanged
    if (beforeData.status === afterData.status) {
      return;
    }

    await sendScheduleNotification(scheduleId, afterData);
  }
);

/**
 * Cloud Function triggered when a document is created in the wasteReports collection.
 * Classifies the waste image and generates notifications based on the results.
 */
export const classifyWasteImage = onDocumentCreated(
  "wasteReports/{reportId}",
  async (event) => {
    const reportId = event.params.reportId;
    const report = event.data?.data() as WasteReport;

    if (!report) {
      logger.error(`No data found for waste report: ${reportId}`);
      return;
    }

    logger.info(`Processing waste report: ${reportId}`, {
      userId: report.userId,
      imageUrl: report.imageUrl,
    });

    try {
      // Simulate AI classification (in production, integrate with Vision API)
      const classificationResult = await classifyWaste(report.imageUrl);

      logger.info(`Classification result for ${reportId}:`, classificationResult);

      let status: string;
      let notifications: string[] = [];

      // Determine status and notifications based on confidence
      if (classificationResult.confidence >= 0.8) {
        status = "CLASSIFIED";
        notifications.push(report.userId);
        logger.info(`High confidence classification. Notifying user ${report.userId}`);
      } else if (classificationResult.confidence >= 0.5) {
        status = "AI_REVIEW";
        notifications = [report.userId, "ADMIN"];
        logger.info(`Medium confidence. Notifying user and admins`);
      } else {
        status = "AI_REVIEW";
        notifications = [report.userId, "ADMIN"];
        logger.info(`Low confidence. Notifying user and admins for review`);
      }

      // Update the waste report with classification results
      await db.collection("wasteReports").doc(reportId).update({
        status,
        classification: classificationResult,
        classifiedAt: FieldValue.serverTimestamp(),
      });

      // Create notification documents
      for (const recipientId of notifications) {
        await db.collection("notifications").add({
          recipientId,
          reportId,
          type: "WASTE_CLASSIFIED",
          title: "Waste Classification Complete",
          message: `Your waste report has been classified as: ${classificationResult.wasteType}`,
          data: {
            wasteType: classificationResult.wasteType,
            confidence: classificationResult.confidence,
            status,
          },
          read: false,
          createdAt: FieldValue.serverTimestamp(),
        });

        logger.info(`Notification created for ${recipientId}`, {
          reportId,
          wasteType: classificationResult.wasteType,
        });

        // Send email notification to the user if they are the recipient
        if (recipientId === report.userId) {
          const userDoc = await db.collection("users").doc(report.userId).get();
          const userData = userDoc.data();
          const userEmail = userData?.email;

          if (userEmail) {
            try {
              await sendEmail(
                userEmail,
                "Green Loop: Waste Classification Complete",
                `Hi ${userData?.name || 'there'},\n\nYour waste report has been classified as: ${classificationResult.wasteType}.\n\nConfidence: ${(classificationResult.confidence * 100).toFixed(1)}%\nReport ID: ${reportId}\n\nThank you for using Green Loop!`,
                `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                      <h2 style="color: #059669;">Waste Classification Complete</h2>
                      <p>Hi ${userData?.name || 'there'},</p>
                      <p>Your waste report has been successfully processed and classified.</p>
                      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Classification:</strong> ${classificationResult.wasteType}</p>
                        <p style="margin: 5px 0 0 0;"><strong>Confidence Score:</strong> ${(classificationResult.confidence * 100).toFixed(1)}%</p>
                        <p style="margin: 5px 0 0 0;"><strong>Report ID:</strong> ${reportId}</p>
                      </div>
                      <p>Thank you for contributing to a greener planet!</p>
                      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                      <p style="font-size: 12px; color: #666;">This is an automated message from Green Loop.</p>
                    </div>
                  `
              );
              logger.info(`Email sent for user ${report.userId}`);
            } catch (emailError) {
              logger.error(`Error creating email document for user ${report.userId}:`, emailError);
            }
          }
        }
      }

      logger.info(`Successfully processed waste report ${reportId}`);
    } catch (error) {
      logger.error(`Error processing waste report ${reportId}:`, error);

      // Update status to failed
      await db.collection("wasteReports").doc(reportId).update({
        status: "AI_FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
        failedAt: FieldValue.serverTimestamp(),
      });
    }
  }
);

/**
 * Simulates waste classification using AI.
 * In production, integrate with Google Vision API or Vertex AI.
 */
async function classifyWaste(imageUrl: string): Promise<ClassificationResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock classification based on URL patterns
  if (imageUrl.includes("kitchen")) {
    return {
      wasteType: "Organic Waste",
      confidence: 0.92,
      labels: ["food", "organic", "biodegradable"],
    };
  } else if (imageUrl.includes("dandelion")) {
    return {
      wasteType: "Mixed Waste",
      confidence: 0.45,
      labels: ["unclear", "requires_review"],
    };
  } else if (imageUrl.includes("invalid")) {
    throw new Error("Failed to process image: Invalid URL");
  }

      // Default classification
    return {
      wasteType: "General Waste",
      confidence: 0.78,
      labels: ["waste", "general"],
    };
  }
  
  /**
   * Cloud Function triggered when a new user document is created.
   * Sends a welcome email to the user.
   */
  export const onUserCreated = onDocumentCreated(
    "users/{userId}",
    async (event) => {
      const userId = event.params.userId;
      const userData = event.data?.data();
  
      if (!userData || !userData.email) {
        logger.error(`No user data or email found for user: ${userId}`);
        return;
      }
  
      try {
        await sendEmail(
          userData.email,
          "Welcome to Green Loop!",
          `Hi ${userData.name || 'there'},\n\nWelcome to Green Loop! We're excited to have you join our community in making the world a cleaner and greener place.\n\nWith Green Loop, you can easily schedule waste pickups, report environmental issues, and track your recycling impact.\n\nGet started by exploring your dashboard: ${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/dashboard\n\nThank you for joining us!`,
          `
              <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px;">
                <h2 style="color: #059669; text-align: center;">Welcome to Green Loop!</h2>
                <p>Hi ${userData.name || 'there'},</p>
                <p>We're thrilled to have you join our mission to create a sustainable future through smart waste management.</p>
                <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
                  <h3 style="margin-top: 0; color: #065f46;">What's Next?</h3>
                  <ul style="padding-left: 20px;">
                    <li><strong>Schedule Pickups:</strong> Request waste collection at your convenience.</li>
                    <li><strong>AI Sorting:</strong> Use our AI tool to identify and sort your waste correctly.</li>
                    <li><strong>Track Impact:</strong> See how much waste you've diverted from landfills.</li>
                  </ul>
                </div>
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/dashboard" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Your Dashboard</a>
                </p>
                <p>Thank you for contributing to a greener planet!</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666; text-align: center;">This is an automated message from Green Loop.</p>
              </div>
            `
        );
              logger.info(`Welcome email sent for user ${userId}`);
            } catch (error) {
              logger.error(`Error sending welcome email for user ${userId}:`, error);
            }
          }
        );
        
