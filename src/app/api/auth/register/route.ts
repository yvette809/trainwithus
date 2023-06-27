import connectToDB from "@/utils/connectDB";
import { genSalt, hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/UserModel";
import generateToken from "@/utils/token";

export async function POST(req: NextRequest) {
  const res = NextResponse.next();
  try {
    connectToDB();

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
      return new NextResponse("User with that email already exists.", {
        status: 401,
      });
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
      await user.save();
      generateToken(user._id);
      console.log("gentk", generateToken( user._id));

      const updatedUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        specialisation: user.specialisation,
        experience: user.experience,
        availability: user.availability,
      };

      return NextResponse.json(updatedUser);
    }
  } catch (error) {
    console.error(error);
    return new NextResponse("An error occurred while processing the request.", {
      status: 500,
    });
  }
}
