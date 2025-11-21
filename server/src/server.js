import 'dotenv/config'
import express from 'express'
import { connectDB } from './config/db.config.js'

//importing routes
import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/category.routes.js'

//importing error handler
import { errorHandler } from './middlewares/errorHandler.middleware.js'

const PORT = process.env.PORT || 8000

//create instance
const app = express()

//Connect to DB
connectDB()

//using middlewares
app.use(express.json({limit:'10mb'}))
app.use('/api/uploads',express.static('uploads'))

app.get('/', (req,res) =>{
    res.status(200).json({
        message:'Server is up & running'
    })
})

//!using routes
app.use('/api/auth',authRoutes)
app.use('/api/category',categoryRoutes)


//error handling middleware
app.use(errorHandler) //from errorHandlerMiddleware

app.listen(PORT,()=>{
console.log(`Server is running at http://localhost:${PORT}`)
})