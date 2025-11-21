import express from 'express'
import { create, getAll, getByID, remove, update } from '../controllers/category.controller.js'
import { upoladFile } from '../middlewares/multer.middleware.js'

const router = express.Router()

const upload = upoladFile()

//create category
router.post('/', upload.single('image'),create)

//getALL
router.get('/', getAll)

//get by ID
router.get('/:id', getByID)

//update category
router.put('/:id', upload.single('image'), update)

//delete
router.delete('/:id', remove)

export default router


