import { Schema, model } from "mongoose";

const productSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'products',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
}, { _id: false });

const cartSchema = new Schema({
  products: {
    type: [productSchema],
    default: [],
    required: true
  }
}, { versionKey: false });

cartSchema.pre('find', function() {
  this.populate({
    path: 'products.product'
  });
});
export const CartModel = model("cart", cartSchema);