import { Schema, model, models } from "mongoose";

/* interface IActivity{
    typeofActivity:string;
    location:string;
    description:string;
    date:Date;
    duration: string;
    capacity:Number;
    Price: Number
}
 */

const ActivitySchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    typeOfActivity: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    duration: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const activity = models.Activity || model("Activity", ActivitySchema);
export default activity;
