import express from 'express'
import { addToCart, clearCart, getCart, removeCartItem, updateCart } from '../controllers/cart.controller.js'
import { USER_ROLE } from '../constants/enums.constant.js'
import { authenticate } from '../middlewares/authenticate.middleware.js'

const router = express.Router()

//get
router.get('/',authenticate([USER_ROLE.USER]),getCart)

//addItems(post)
router.post("/", authenticate([USER_ROLE.USER]),addToCart)

//update(post)
router.patch('/:productId', authenticate([USER_ROLE.USER]),updateCart)

//delete
router.delete('/:productId',authenticate([USER_ROLE.USER]),removeCartItem)

//clear
router.delete('/', authenticate([USER_ROLE.USER]),clearCart)

export default router