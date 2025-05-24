import dbConnect from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import Quiz from '@/models/Quiz';

export async function GET(req, { params }) {
  await dbConnect();
  const user = verifyAuth(req);
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const quiz = await Quiz.findById(params.quizId);
    if (!quiz) return Response.json({ message: "Quiz not found" }, { status: 404 });

    // Send quiz without revealing correct answers
    const questions = quiz.questions.map(q => ({
      questionText: q.questionText,
      options: q.options,
    }));

    return Response.json({
      message: "Quiz loaded",
      data: {
        quizId: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        questions,
      }
    }, { status: 200 });

  } catch (err) {
    return Response.json({ message: err.message }, { status: 400 });
  }
}
