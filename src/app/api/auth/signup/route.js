import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req, res) {
  try {
    await dbConnect();
    const { username, email, password } = await req.json();

    if ((!username || !email || !password)) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    return Response.json({ message: "User created", userId: newUser._id });
  } catch(error){
    console.error(error);
    return Response.json({error:'Something went wrong '},{status:500})
    
  }
}
