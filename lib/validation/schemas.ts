import { z } from "zod";
import { WasteStatus } from "@/types/waste-status";

/**
 * Zod schema for validating WasteStatus enum values.
 */
export const wasteStatusSchema = z.nativeEnum(WasteStatus);

/**
 * Schema for User Registration
 */
export const userRegistrationSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-zA-Z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    name: z.string().min(1, "Name is required"),
});

/**
 * Schema for Waste Update/Creation (status can be optional for partial updates)
 */
export const wasteSchema = z.object({
    status: wasteStatusSchema.optional(),
    description: z.string().max(500, "Description must be at most 500 characters").optional(),
    imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

/**
 * Schema for Waste Assignment
 */
export const wasteAssignmentSchema = z.object({
    wasteId: z.string().min(1, "wasteId is required"),
    collectorId: z.string().min(1, "collectorId is required"),
});

/**
 * Schema for Notifications
 */
export const notificationRequestSchema = z.object({
    role: z.enum(['ADMIN', 'COLLECTOR', 'USER']),
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    type: z.enum(['info', 'warning', 'alert', 'AI-suggestion']),
    userId: z.string().optional(),
});

/**
 * Schema for Collector Task Update
 */
export const collectorTaskUpdateSchema = z.object({
    status: wasteStatusSchema,
    assignedCollectorId: z.string().optional(),
});

// Type inferences
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type WasteInput = z.infer<typeof wasteSchema>;
export type CollectorTaskUpdateInput = z.infer<typeof collectorTaskUpdateSchema>;
export type WasteStatusInput = z.infer<typeof wasteStatusSchema>;
export type WasteAssignmentInput = z.infer<typeof wasteAssignmentSchema>;
export type NotificationRequestInput = z.infer<typeof notificationRequestSchema>;


