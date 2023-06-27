import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/utils/connectDB";
import UserModel from "@/models/UserModel";
import generateToken from "@/utils/token";
import { errorResponse } from "@/utils/middleware";

//login a user
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    connectToDB();
    const { email, password } = await req.json();
    let user = await UserModel.findOne({ email });
    if (!user) {
      return new NextResponse("User not found.", {
        status: 401,
      });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    generateToken(user._id);
    if (!isMatch) {
      return new NextResponse("Invalid User Credentials", {
        status: 401,
      });
    } else {
      return NextResponse.json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("An error occurred while processing the request.", {
      status: 500,
    });
  }
}
