import dbConnect from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import Attempt from '@/models/Attempt';
import Quiz from '@/models/Quiz';

export async function POST(req) {
  await dbConnect();
  const user = verifyAuth(req);
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { quizId, answers } = await req.json();

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return Response.json({ message: "Quiz not found" }, { status: 404 });

    const correctAnswers = quiz.questions.map(q => q.correctIndex);
    let score = 0;
    correctAnswers.forEach((correct, i) => {
      if (answers[i] === correct) score++;
    });

    const attempt = await Attempt.create({
      userId: user.id,
      quizId,
      answers,
      score,
    });

    return Response.json({
      message: "Attempt submitted",
      data: { score, total: correctAnswers.length },
    }, { status: 201 });

  } catch (err) {
    return Response.json({ message: err.message }, { status: 400 });
  }
}
