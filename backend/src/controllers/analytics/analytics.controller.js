/**
 * Analytics Controller (Feature 4)
 * Generates the Question Bank (most repeated questions).
 */
import { prisma } from "../../config/db.js";

export const getQuestionBankController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Extract optional paperIds from the query string (e.g., ?paperIds=id1,id2,id3)
        const { paperIds } = req.query;
        let paperFilter = { userId: userId };

        if (paperIds) {
            const idsArray = paperIds.split(",").map(id => id.trim());
            if (idsArray.length > 0) {
                paperFilter.id = { in: idsArray };
            }
        }

        // Fetch questions and group them by text
        const repeatedQuestions = await prisma.question.groupBy({
            by: ['text', 'marks', 'unit'],
            where: { paper: paperFilter },
            _count: { text: true },
            orderBy: { _count: { text: 'desc' } },
            take: 25 // Get the top 25 most repeated questions
        });

        // Format the output specifically for the Question Bank UI
        const formatted = repeatedQuestions.map(q => ({
            question: q.text,
            marks: q.marks,
            unit: q.unit,
            frequency: q._count.text
        }));

        res.status(200).json({ questionBank: formatted });
    } catch (error) {
        console.error("Error generating question bank:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
