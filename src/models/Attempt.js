import mongoose from "mongoose";

const AttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  answers: [Number], // index of selected options
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Attempt ||
  mongoose.model("Attempt", AttemptSchema);
