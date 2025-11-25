import express from 'express'
import { addWishlist, clearWishlist, getWishlist, removeWishlistItem } from '../controllers/wishlist.controller.js'
import { authenticate } from './../middlewares/authenticate.middleware.js';
import { USER_ROLE } from '../constants/enums.constant.js';

const router = express.Router()

//getAll
router.get('/',authenticate([USER_ROLE.USER]), getWishlist)

//add Product
router.post('/',authenticate([USER_ROLE.USER]), addWishlist)

// Remove a single product from wishlist by product ID
router.delete('/:productID', authenticate([USER_ROLE.USER]),removeWishlistItem)

//clear all wihslist item
router.delete('/',authenticate([USER_ROLE.USER]),clearWishlist)

export default router