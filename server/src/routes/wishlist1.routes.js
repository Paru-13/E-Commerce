import express from 'express'
import { authenticate } from '../middlewares/authenticate.middleware.js'
import { USER_ROLE } from './../constants/enums.constant.js';
import { clear, createWishlist, getAll } from '../controllers/wishlist1.controller.js';

const router = express.Router()

//create
router.post('/', authenticate([USER_ROLE.USER]), createWishlist)
//get all
router.get('/',authenticate([USER_ROLE.USER]),getAll)
//clear all
router.delete('/',authenticate([USER_ROLE.USER]),clear)

export default router
