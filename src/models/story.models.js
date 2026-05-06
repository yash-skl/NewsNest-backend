import mongoose, { Schema } from "mongoose";

const storySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    points: {
      type: Number,
      default: 0,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    postedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Story = mongoose.model("Story", storySchema);