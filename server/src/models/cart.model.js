/*
-user -> ref - user collection
-items -> array object [{
product: product id, quantity:total_price 
}]
*/

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
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
        price: { //the unit price of the product
          type: Number,
          required: [true, "Price is required"]
        },
        total: {
          type: Number, //total cost for that product in the cart ->price * quantity
          required: [true, "Total is required"]
        },
      },
    ],
    grandTotal:{
        type:Number,
        default: 0
    }
  },


  { timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);
export default Cart;
