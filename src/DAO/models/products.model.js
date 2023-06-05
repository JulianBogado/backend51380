import { Schema, model } from "mongoose";

const schema = new Schema({
  title: {
    type: String,
    required: true,
    max: 100,
    index: true,
  },
  description: {
    type: String,
    required: true,
    max: 100,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
    max: 100,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    max: 100,
    index: true,
  },
  code: {
    type: String,
    required: true,
    max: 100,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

export const ProductModel = model("products", schema);
