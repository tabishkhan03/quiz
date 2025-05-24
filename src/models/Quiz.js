import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: v => v.length >= 2,
  },
  correctIndex: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  tags: {
    type: [String],
    default: [],
  },
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timeLimit: {
    type: Number,
    default: null,
  },
  questions: {
    type: [QuestionSchema],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0,
  },
});

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
