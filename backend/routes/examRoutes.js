import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { createExam, getExams } from "../controllers/examController.js";
import {
  createQuestion,
  getQuestionsByExamId,
} from "../controllers/quesController.js";
import {
  getCheatingLogsByExamId,
  saveCheatingLog,
} from "../controllers/cheatingLogController.js";
const examRoutes = express.Router();

// protecting Exam route using auth middleware protect /api/users/
examRoutes.route("/exam").get(protect, getExams).post(protect, createExam);
examRoutes.route("/exam/questions").post(protect, createQuestion);
examRoutes.route("/exam/questions/:examId").get(protect, getQuestionsByExamId);
examRoutes.route("/cheatingLogs/:examId").get(protect, getCheatingLogsByExamId);
examRoutes.route("/cheatingLogs/").post(protect, saveCheatingLog);

examRoutes.post("/logViolation", async (req, res) => {
  try {
    const { studentId, examId, violationType } = req.body;

    const violations = await CheatingLog.find({ studentId, examId });

    if (violations.length >= 3) {
      // End exam
      await Exam.findByIdAndUpdate(examId, { status: "terminated" });
      return res.json({ message: "Exam terminated due to multiple violations." });
    }

    const newViolation = new CheatingLog({ studentId, examId, violationType });
    await newViolation.save();

    res.json({ message: "Violation logged successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error logging violation" });
  }
});

export default examRoutes;
