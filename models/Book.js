import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: true
    },
    imglink: {
      type: String
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
