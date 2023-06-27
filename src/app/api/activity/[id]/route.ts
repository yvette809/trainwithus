import { NextRequest, NextResponse } from "next/server";
import ActivityModel from "@/models/ActivityModel";
import UserModel from "@/models/UserModel";
import { getSession } from "@/utils/session";
import connectToDB from "@/utils/connectDB";

type paramsUrl = {
  params: {
    id: String;
  };
};

export const GET = async (req: NextRequest, { params }: paramsUrl) => {
  try {
    const activity = await ActivityModel.findById(params.id).populate(
      "creator",
      "firstName lastName"
    );
    console.log("activity", activity);
    if (!activity) {
      return new NextResponse(`Activity with id ${params.id} not found`, {
        status: 404,
      });
    }

    return NextResponse.json(activity, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Activity not found", { status: 404 });
  }
};

/* 
export const PATCH = async (req: NextRequest, { params }: paramsUrl) => {
  try {
    const {
      creator,
      typeOfActivity,
      location,
      description,
      date,
      duration,
      capacity,
      price,
    } = await req.json();

    const session = getSession();
    const userId = session?.payload.id;

    if (session) {
      const user = await UserModel.findById(userId);

      let activity = await ActivityModel.findById(params.id);
      console.log('activity', activity)
      if (activity.creator._id === user._id && user.role === "trainer") {
        
        // update the activity
        activity.creator = creator
        activity.typeOfActivity= typeOfActivity
        activity.location = location
        activity.description = description
        activity.date = date
        activity.duration= duration
        activity.capacity = capacity
        activity.price = price
        await activity.save()

        return NextResponse.json(activity, {status:200})
      }
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Activity not found", { status: 404 });
  }
};
 */

export const PATCH = async (req: NextRequest, { params }: paramsUrl) => {
  try {
    await connectToDB();
    const reqBody = await req.json();
    const session = getSession();
    const userId = session?.payload.id;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await UserModel.findById(userId);

    const activity = await ActivityModel.findById(params.id);
    if (!activity) {
      return new NextResponse("Activity not found", { status: 404 });
    }

    if (activity.creator._id !== user._id && user.role !== "trainer") {
      return new NextResponse("user is not authorised to update acticity", {
        status: 401,
      });
    }
    console.log("creatorId", activity.creator._id);
    console.log("userId", user._id);
    const updatedActivity = await ActivityModel.findByIdAndUpdate(
      params.id,
      reqBody,
      { new: true }
    );

    await updatedActivity.save();

    return NextResponse.json(updatedActivity, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Activity update failed", { status: 500 });
  }
};
