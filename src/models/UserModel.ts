import { Schema, Document, model, models } from "mongoose";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "trainer";
  specialisation?: string;
  experience?: number;
  availability?: string[];
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "trainer"],
      required: true,
    },
    specialisation: {
      type: String,
    },
    experience: {
      type: Number,
    },
    availability: {
      type: [String],
    },
  },
  { timestamps: true }
);

const UserModel = models.User || model<IUser>("User", UserSchema);
export default UserModel;
