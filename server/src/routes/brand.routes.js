import express from 'express'
import { uploadFile } from '../middlewares/multer.middleware.js'
import { create, getAll, getByID, remove, update } from '../controllers/brand.controller.js'
import { authenticate } from '../middlewares/authenticate.middleware.js'
import { USER_ROLE } from '../constants/enums.constant.js'

const router = express.Router()

const upload = uploadFile()

//create
router.post('/',authenticate([USER_ROLE.ADMIN]),upload.single('image'),create)

//update
router.put('/:id',authenticate([USER_ROLE.ADMIN]),upload.single('image'),update)

//getALL
router.get('/', getAll)

//get by ID
router.get('/:id', getByID)

//delete
router.delete('/:id',authenticate([USER_ROLE.ADMIN]), remove)

export default router


