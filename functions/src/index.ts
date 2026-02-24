import { setGlobalOptions } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

setGlobalOptions({ maxInstances: 10 });

// Initialize Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

interface WasteReport {
  userId: string;
  userName: string;
  imageUrl: string;
  status: string;
  location?: admin.firestore.GeoPoint;
  createdAt?: admin.firestore.Timestamp;
}

interface ClassificationResult {
  wasteType: string;
  confidence: number;
  labels: string[];
}

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
        classifiedAt: admin.firestore.FieldValue.serverTimestamp(),
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
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info(`Notification created for ${recipientId}`, {
          reportId,
          wasteType: classificationResult.wasteType,
        });
      }

      logger.info(`Successfully processed waste report ${reportId}`);
    } catch (error) {
      logger.error(`Error processing waste report ${reportId}:`, error);

      // Update status to failed
      await db.collection("wasteReports").doc(reportId).update({
        status: "AI_FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
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
