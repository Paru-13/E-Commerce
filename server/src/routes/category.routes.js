import express from 'express'
import { create, getAll, getByID, remove, update } from '../controllers/category.controller.js'
import { upoladFile } from '../middlewares/multer.middleware.js'
import { authenticate } from '../middlewares/authenticate.middleware.js'
import { USER_ROLE } from '../constants/enums.constant.js'

const router = express.Router()

const upload = upoladFile()

//create category
router.post('/', authenticate([USER_ROLE.ADMIN]),upload.single('image'),create)

//getALL
router.get('/', getAll)

//get by ID
router.get('/:id', getByID)

//update category
router.put('/:id',authenticate([USER_ROLE.ADMIN]), upload.single('image'), update)

//delete
router.delete('/:id', authenticate([USER_ROLE.ADMIN]),remove)

export default router


