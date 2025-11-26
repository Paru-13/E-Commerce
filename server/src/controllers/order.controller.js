import CustomError from "../middlewares/errorHandler.middleware.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ORDER_STATUS, PAYMENT_STATUS } from "./../constants/enums.constant.js";

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw new CustomError("Cart not found", 404);
  }
  // Calculate grandTotal
  const grandTotal = cart.items.reduce((acc, item) => acc + item.total, 0);

  //Create new order
  const order = new Order({
    user: userId,
    items: cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
    grandTotal,
    shippingAddress,
    paymentMethod, // from request body
    paymentStatus: PAYMENT_STATUS.PENDING,
    orderStatus: ORDER_STATUS.PENDING,
  });
  await order.save();

  res.status(200).json({
    message: "Order created successfully",
    status: "success",
    data: order,
  });
});

//*get all Orders
export const getAll = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  //find all orders where user = userId,sort them by latest first
  const order = await Order.find({ user: userId })
    .populate("items.product")
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "Orders Fetched",
    status: "success",
    data: order, // always returns array (empty or filled)
  });
});

//*get Single Order-> GET /order/:orderId
export const getSingleOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate("items.product");
  if (!order) {
    throw new CustomError("Order not found", 404);
  }
  res.status(200).json({
    message: "Orders Fetched",
    status: "success",
    data: order,
  });
});

//*update Order status(admin only)-> PATCH /order/:orderId/status
//Admin use this API to change order from pending to shipped, shipped to delivered, pending to cancel

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;  body = { "orderStatus": "SHIPPED" }

  if (!Object.values(ORDER_STATUS).includes(orderStatus)) {
    throw new CustomError("Invalid order status", 400);
  }

  //Validate orderStatus
  const order = await Order.findById(orderId);
  if (!order) {
    throw new CustomError("Order not found", 404);
  }
  order.orderStatus = orderStatus;
  await order.save();
  res.status(200).json({
    message: "Order status updated",
    status: "success",
    data: order,
  });
});

//* cancel Order(USER)->PATCH /order/:orderId/cancel
export const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  const order = await Order.findOne({ user: userId, _id: orderId });
  if (!order) {
    throw new CustomError("Order not found", 404);
  }
  // Only allow cancel if not shipped/delivered
  if (
    ["ORDER_STATUS.SHIPPED", "ORDER_STATUS.DELIVERED"].includes(
      order.orderStatus
    )
  ) {
    throw new CustomError("Order cannot be cancelled", 400);
  }

  order.orderStatus = ORDER_STATUS.CANCELLED;
  await order.save();

  res.status(200).json({
    message: "Order Cancelled",
    status: "Success",
    data: order,
  });
});
