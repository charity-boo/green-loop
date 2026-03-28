import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { FieldValue } from "firebase-admin/firestore";
import { classifyWaste } from "../ai/gemini.ts";

const db = admin.firestore();

/**
 * Handles waste classification requests for both 'schedules' and 'waste' collections.
 */
export async function handleClassificationRequest(
  collection: string,
  docId: string,
  beforeData: admin.firestore.DocumentData,
  afterData: admin.firestore.DocumentData
): Promise<void> {
  // Only process transitions to 'pending'
  if (afterData.classificationStatus !== "pending" || beforeData.classificationStatus === "pending") {
    return;
  }

  const imageUrl: string | undefined = afterData.imageUrl;
  const userId: string | undefined = afterData.userId;
  const docRef = db.collection(collection).doc(docId);

  if (!imageUrl) {
    logger.warn(`No imageUrl on ${collection}/${docId}, marking as failed`);
    await docRef.update({ 
      classificationStatus: "failed", 
      updatedAt: FieldValue.serverTimestamp() 
    });
    return;
  }

  try {
    const { wasteType, disposalTips, confidence } = await classifyWaste(imageUrl);

    await docRef.update({
      aiWasteType: wasteType, // Stored as aiWasteType to avoid overwriting the category
      disposalTips,
      confidence,
      classificationStatus: "classified",
      classifiedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    logger.info(`Classified ${collection}/${docId}: ${wasteType}`);

    if (userId) {
      await db.collection("notifications").add({
        userId,
        role: "USER",
        title: "Waste Classification Complete",
        message: `Your waste has been classified as: ${wasteType}. ${disposalTips}`,
        type: "AI-suggestion",
        status: "unread",
        relatedDocId: docId,
        relatedCollection: collection,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    logger.error(`Classification failed for ${collection}/${docId}:`, error);
    await docRef.update({
      classificationStatus: "failed",
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
}

/**
 * Legacy handler for 'wasteReports' collection.
 * Maintains existing logic for confidence-based status (AI_REVIEW vs CLASSIFIED).
 */
export async function handleWasteReportCreation(
  reportId: string,
  report: any
): Promise<void> {
  if (!report || report.status === "CLASSIFIED" || report.status === "AI_FAILED" || report.classification) {
    logger.info(`Report ${reportId} already processed or invalid. Skipping.`);
    return;
  }

  const imageUrl = report.imageUrl;
  if (!imageUrl) {
    logger.error(`No imageUrl for waste report: ${reportId}`);
    return;
  }

  try {
    const classificationResult = await classifyWaste(imageUrl);
    logger.info(`Classification result for ${reportId}:`, classificationResult);

    let status: string;
    let recipients: string[] = [];

    // Determine status and recipients based on confidence
    if (classificationResult.confidence >= 0.8) {
      status = "CLASSIFIED";
      recipients.push(report.userId);
    } else {
      status = "AI_REVIEW";
      recipients = [report.userId, "ADMIN"];
    }

    // Update the waste report
    await db.collection("wasteReports").doc(reportId).update({
      status,
      classification: classificationResult,
      classifiedAt: FieldValue.serverTimestamp(),
    });

    // Create notification documents
    for (const recipientId of recipients) {
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
    }

    logger.info(`Successfully processed waste report ${reportId}`);
  } catch (error) {
    logger.error(`Error processing waste report ${reportId}:`, error);
    await db.collection("wasteReports").doc(reportId).update({
      status: "AI_FAILED",
      error: error instanceof Error ? error.message : "Unknown error",
      failedAt: FieldValue.serverTimestamp(),
    });
  }
}
