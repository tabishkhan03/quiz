import dbConnect from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import { verifyAuth } from '@/lib/auth';

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const quiz = await Quiz.findById(params.id);
    if (!quiz) return Response.json({ message: "Quiz not found" }, { status: 404 });
    return Response.json({ message: "Quiz fetched", data: quiz }, { status: 200 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const user = verifyAuth(req);
  if (!user || user.role !== 'admin') {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const updated = await Quiz.findByIdAndUpdate(params.id, data, { new: true });
    return Response.json({ message: "Quiz updated", data: updated }, { status: 200 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const user = verifyAuth(req);
  if (!user || user.role !== 'admin') {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await Quiz.findByIdAndDelete(params.id);
    return Response.json({ message: "Quiz deleted" }, { status: 200 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 400 });
  }
}
