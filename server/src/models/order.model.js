import mongoose from "mongoose";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "../constants/enums.constant.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: 1,
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
        },
        total: {
          type: Number,
          required: [true, "Total is required"],
        },
      },
    ],
    grandTotal: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
    },
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);
export default Order;
