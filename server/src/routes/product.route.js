import { getAll, getByID } from "../controllers/product.controller.js"
import express from 'express'

const router = express.Router()

//getAll
router.get('/',getAll)

//get By ID
router.get('/:id',getByID)



export default router