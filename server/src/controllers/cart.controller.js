import CustomError from "../middlewares/errorHandler.middleware.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

//*getByID of the cart for the logged-in user
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  res.status(200).json({
    message: "cart fetched",
    status: "success",
    data: cart || { items: [], grabdtotal: 0 }, //return empty if cart doesn't exist
  });
});

//*addItems to cart(post)-create/update
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
   console.log("productId received:", productId); // Add this to confirm


  //check product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  //find user's cart
  let cart = await Cart.findOne({ user: userId });

  //if the product is already in the cart
  if (cart) {
    // Check if product already in cart
    const existingItem = cart.items.find((item) => {
      return item.product.toString() === productId;
    });

    if (existingItem) {
      // If product exists, update quantity & total
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      // If new product, push into items
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        total: product.price * quantity,
      });
    }

    //update grandtotal
    cart.grandTotal = cart.items.reduce((acc, item) => acc + item.total, 0);

    await cart.save();
  } else {
    //create new cart for user
     cart = new Cart({
      user: userId,
      items: [
        {
          product: productId,
          quantity,
          price: product.price,
          total: product.price * quantity,
        },
      ],
      grandTotal: product.price * quantity,
    });

    await cart.save();
  }
console.log("BODY RECEIVED:", req.body);
console.log("PRODUCT ID:", req.body.productId);

  res.status(200).json({
    message: "Cart updated",
    status: "success",
    data: cart,
  });
});

//*update cart item-Update quantity of a specific product

export const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId; // keep consistent
  const newQuantity = req.body.quantity;

  //Find user cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }

  //Find the item inside items array
  const item = cart.items.find((item) => {
    return item.product.toString() === productId;
  });

  if (!item) {
    throw new CustomError("Item not found", 404);
  }

  // If product exists, update quantity & total
  item.quantity = newQuantity;
  item.total = item.price * newQuantity;

  //Recalculate grandTotal
  cart.grandTotal = cart.items.reduce((acc, item) => acc + item.total, 0);

  await cart.save();

  console.log("BODY RECEIVED:", req.body);
console.log("PRODUCT ID:", req.body.productId);

  res.status(200).json({
    message: "Cart updated",
    status: "success",
    data: cart,
  });
});

//* REMOVE
export const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  // Find user's cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }
  //Save original item count
  const beforeCount = cart.items.length;

  // Remove item by filtering it out
  cart.items = cart.items.filter((item) => {
    return item.product.toString() !== productId;
  });

  //If count didn’t change → product didn’t exist
  if (cart.items.length === beforeCount) {
    throw new CustomError("Product not in cart", 404);
  }

  cart.grandTotal = cart.items.reduce((acc, item) => acc + item.total, 0);
  await cart.save();

  res.status(200).json({
    message: "Item removed from cart ",
    status: "success",
    data: cart,
  });
});

//*clear
export const clearCart = asyncHandler(async(req,res)=>{
    const userId = req.user._id

    const cart = await Cart.findOne({user:userId})
    if(!cart){
        throw new CustomError("Cart not found", 404)
    }

    //Clear items & totals
    cart.items = []
    cart.grandTotal = 0

    //Save updated cart
    await cart.save()

     res.status(200).json({
    message: "Cart cleared successfully ",
    status: "success",
    data: cart,
  });
})
