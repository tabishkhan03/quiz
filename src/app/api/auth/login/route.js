import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export async function POST(req, res) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) return new Response("Unauthorized user", { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return new Response("Invalid username or password", { status: 401 });

    const token = jwt.sign(
      {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      },
      SECRET,
      { expiresIn: "1h" }
    );

     const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`;

    return new Response(JSON.stringify({ message: 'Logged in' }), {
    status: 200,
    headers: {
      'Set-Cookie': cookie,
      'Content-Type': 'application/json',
    },
  });
  
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong " }, { status: 500 });
  }
}
