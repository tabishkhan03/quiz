import dbConnect from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import Attempt from '@/models/Attempt';

export async function GET(req) {
  await dbConnect();
  const user = verifyAuth(req);
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const attempts = await Attempt.find({ userId: user.id }).populate('quizId');

    const history = attempts.map(attempt => ({
      quizTitle: attempt.quizId.title,
      score: attempt.score,
      total: attempt.quizId.questions.length,
      submittedAt: attempt.submittedAt,
    }));

    return Response.json({
      message: "History fetched",
      data: history,
    }, { status: 200 });

  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}
