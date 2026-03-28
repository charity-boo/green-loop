import { setGlobalOptions } from "firebase-functions";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as nodemailer from "nodemailer";

// Import consolidated handlers
import { 
  handleClassificationRequest, 
  handleWasteReportCreation 
} from "./handlers/classification.ts";

setGlobalOptions({ maxInstances: 10 });

// Initialize Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// --- Email Configuration ---

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
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

// --- Schedule Notifications ---

async function sendScheduleNotification(scheduleId: string, data: any) {
  const status = data.status;
  const userId = data.userId;

  if (!userId || !status) {
    logger.error(`Missing userId or status for schedule: ${scheduleId}`);
    return;
  }

  const statusConfig: Record<string, { message: string; type: string }> = {
    pending: { message: "Pickup request received", type: "SCHEDULE_PENDING" },
    assigned: { message: "Collector assigned", type: "SCHEDULE_ASSIGNED" },
    completed: { message: "Pickup completed", type: "SCHEDULE_COMPLETED" },
  };

  const config = statusConfig[status];
  if (!config) return;

  try {
    const existingNotification = await db.collection("notifications")
      .where("scheduleId", "==", scheduleId)
      .where("type", "==", config.type)
      .limit(1)
      .get();

    if (!existingNotification.empty) {
      logger.info(`Notification already exists for schedule ${scheduleId} with type ${config.type}`);
      return;
    }

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    const fcmToken = userData?.fcmToken;

    let notificationStatus: "sent" | "failed" = "failed";
    let errorMessage: string | null = null;

    if (fcmToken) {
      try {
        await admin.messaging().send({
          token: fcmToken,
          notification: { title: "Green Loop Update", body: config.message },
          data: { scheduleId, status: status },
        });
        notificationStatus = "sent";
      } catch (error) {
        logger.error(`Error sending FCM notification to user ${userId}:`, error);
        errorMessage = error instanceof Error ? error.message : "Unknown FCM error";
      }
    }

    await db.collection("notifications").add({
      userId,
      scheduleId,
      type: config.type,
      channel: "push",
      status: notificationStatus,
      error: errorMessage,
      createdAt: FieldValue.serverTimestamp(),
      deliveredAt: notificationStatus === "sent" ? FieldValue.serverTimestamp() : null,
    });

    const userEmail = userData?.email;
    if (userEmail) {
      // Email sending logic (simplified for brevity here, but keep the core logic)
      try {
        const subject = `Green Loop Update: ${config.message}`;
        const html = `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #059669;">Green Loop Update</h2>
            <p>Hi ${userData?.name || 'there'},</p>
            <p>Your waste pickup status has been updated: <strong>${config.message}</strong>.</p>
            <p><strong>Pickup ID:</strong> ${scheduleId}</p>
            <p><strong>Current Status:</strong> ${status}</p>
          </div>
        `;
        await sendEmail(userEmail, subject, config.message, html);
      } catch (e) {
        logger.error(`Error sending email for user ${userId}:`, e);
      }
    }
  } catch (error) {
    logger.error(`Error sending notification for schedule ${scheduleId}:`, error);
  }
}

// --- Exported Cloud Functions ---

export const onScheduleCreated = onDocumentCreated(
  "schedules/{scheduleId}",
  async (event) => {
    const data = event.data?.data();
    if (data) await sendScheduleNotification(event.params.scheduleId, data);
  }
);

export const onScheduleStatusChange = onDocumentUpdated(
  "schedules/{scheduleId}",
  async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();
    if (beforeData && afterData && beforeData.status !== afterData.status) {
      await sendScheduleNotification(event.params.scheduleId, afterData);
    }
  }
);

export const onAdminBroadcast = onDocumentCreated(
  "broadcasts/{broadcastId}",
  async (event) => {
    const data = event.data?.data();
    if (!data) return;
    const { title = "Green Loop", body = "You have a new update from Green Loop." } = data;
    try {
      const usersSnap = await db.collection("users").where("fcmToken", "!=", null).get();
      const tokens = usersSnap.docs.map((d) => d.data().fcmToken).filter(Boolean);
      if (tokens.length === 0) return;
      
      const BATCH_SIZE = 500;
      for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
        await admin.messaging().sendEachForMulticast({
          tokens: tokens.slice(i, i + BATCH_SIZE),
          notification: { title, body },
        });
      }
      await db.collection("broadcasts").doc(event.params.broadcastId).update({
        sentAt: FieldValue.serverTimestamp(),
        recipientCount: tokens.length,
      });
    } catch (error) {
      logger.error(`Error sending broadcast:`, error);
    }
  }
);

export const onUserCreated = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    const userData = event.data?.data();
    if (userData?.email) {
      await sendEmail(
        userData.email,
        "Welcome to Green Loop!",
        "Welcome to Green Loop!",
        `<h2>Welcome to Green Loop!</h2><p>Hi ${userData.name || 'there'}, we're excited to have you join us!</p>`
      );
    }
  }
);

// --- AI Classification Triggers ---

export const onScheduleClassificationRequested = onDocumentUpdated(
  "schedules/{docId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (before && after) {
      await handleClassificationRequest("schedules", event.params.docId, before, after);
    }
  }
);

export const onWasteClassificationRequested = onDocumentUpdated(
  "waste/{docId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (before && after) {
      await handleClassificationRequest("waste", event.params.docId, before, after);
    }
  }
);

export const onWasteReportCreated = onDocumentCreated(
  "wasteReports/{reportId}",
  async (event) => {
    const data = event.data?.data();
    if (data) {
      await handleWasteReportCreation(event.params.reportId, data);
    }
  }
);
