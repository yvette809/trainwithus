import connectDb from "@/utils/connectDB";
import { genSalt, hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/UserModel";
import generateToken from "@/utils/token";
import errorResponse from "@/utils/errorResponse";

export async function POST(req: NextRequest) {
  const res = NextResponse.next();
  try {
    connectDb();

    const {
      firstName,
      lastName,
      email,
      password,
      role,
      specialisation,
      experience,
      availability,
    } = await req.json();

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return errorResponse("User with that email already exists.", 401);
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    let user = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      specialisation: role === "trainer" ? specialisation : undefined,
      experience: role === "trainer" ? experience : undefined,
      availability: role === "trainer" ? availability : undefined,
    });

    if (user) {
      generateToken(res, user._id);

      const savedUser = await user.save();
      const updatedUser = {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        specialisation: savedUser.specialisation,
        experience: savedUser.experience,
        availability: savedUser.availability,
      };

      return NextResponse.json(updatedUser);
    }
  } catch (error) {
    console.error(error);

    return errorResponse(
      "An error occurred while processing the request.",
      500
    );
  }
}
