import mongoose, { Schema, Model } from "mongoose";

export interface IProject {
  userId: mongoose.Types.ObjectId;
  name: string;
  idea: string;
  currentStep: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      default: "Untitled Project",
    },

    idea: {
      type: String,
      required: true,
    },

    currentStep: {
      type: String,
      default: "discovery",
    },

    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;
