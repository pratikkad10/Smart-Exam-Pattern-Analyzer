import { z } from "zod";

/**
 * Schema for paper upload metadata validation
 * The PDF file itself is handled by multer; this validates the text fields.
 */
export const paperUploadSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subject: z.string().optional(),
    year: z
        .string()
        .optional()
        .transform((val) => {
            if (!val) return null;
            const parsed = parseInt(val, 10);
            return isNaN(parsed) ? null : parsed;
        }),
});
