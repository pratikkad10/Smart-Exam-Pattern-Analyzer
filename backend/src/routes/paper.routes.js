import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
    uploadPaperController,
    getMyPapersController,
    getPaperByIdController,
    deletePaperController,
} from "../controllers/paper/paper.controller.js";

const router = express.Router();

// All paper routes require authentication
router.use(requireAuth());

// POST   /api/v1/papers/upload  — Upload PDF & extract questions
router.post("/upload", upload.single("paper"), uploadPaperController);

// GET    /api/v1/papers         — List all my papers
router.get("/", getMyPapersController);

// GET    /api/v1/papers/:id     — Get a single paper with questions
router.get("/:id", getPaperByIdController);

// DELETE /api/v1/papers/:id     — Delete a paper
router.delete("/:id", deletePaperController);

export default router;
