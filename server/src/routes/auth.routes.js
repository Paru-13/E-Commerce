import express from 'express'
import { login, logout, register } from '../controllers/auth.controller.js'
import { upoladFile } from '../middlewares/multer.middleware.js'


const router = express.Router()

const uploader = upoladFile('/profiles')
//register
router.post('/register',uploader.single('profile_image'),register)  //fieldname-pp, server ma file upload garxa, upload folder ma store garxa

//login
router.post('/login',login)

//logout
router.post('/logout', logout)

export default router