import express from 'express'
import { login, register } from '../controllers/auth.controller.js'
import { upoladFile } from '../middlewares/multer.middleware.js'


const router = express.Router()

const uploader = upoladFile('/profiles')
//register
router.post('/register',uploader.single('Profile_image'),register)  //fieldname-pp, server ma file upload garxa, upload folder ma store garxa

//login
router.post('/login',login)

//login

export default router