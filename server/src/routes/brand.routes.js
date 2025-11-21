import express from 'express'
import { upoladFile } from '../middlewares/multer.middleware.js'
import { create, getAll, getByID, remove, update } from '../controllers/brand.controller.js'

const router = express.Router()

const upload = upoladFile()

//create
router.post('/',upload.single('image'),create)

//update
router.put('/:id',upload.single('image'),update)

//getALL
router.get('/', getAll)

//get by ID
router.get('/:id', getByID)

//delete
router.delete('/:id', remove)

export default router


