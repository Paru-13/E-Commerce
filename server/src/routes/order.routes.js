import express from "express";
import { authenticate } from './../middlewares/authenticate.middleware.js';
import { USER_ROLE } from "../constants/enums.constant.js";
import { cancelOrder, createOrder, getAll, getSingleOrder, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

//create order
router.post('/', authenticate([USER_ROLE.USER]), createOrder)

//getAll orders
router.get('/',authenticate([USER_ROLE.USER]),getAll)

//get single order By ID
router.get('/:orderId',authenticate([USER_ROLE.USER]),getSingleOrder)

//update Order Status
router.patch('/:orderId/status', authenticate([USER_ROLE.ADMIN]),updateOrderStatus)

//cancel order
router.patch('/:orderId/cancel', authenticate([USER_ROLE.USER]), cancelOrder)

export default router;
