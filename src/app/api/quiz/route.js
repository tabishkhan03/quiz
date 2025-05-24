import dbConnect from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  const quizzes = await Quiz.find().select("title description timeLimit");
  return Response.json({ message: "Quizzes fetched", data: quizzes }, { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const user = verifyAuth(req);
  if (!user || user.role !== 'admin') {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const quiz = await Quiz.create(data);
    return Response.json({ message: "Quiz created", data: quiz }, { status: 201 });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 });
  }
}
