import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    return Response.json({ message: 'DB connected successfully!' });
  } catch (error) {
    return Response.json({ error: 'DB connection failed' }, { status: 500 });
  }
}
