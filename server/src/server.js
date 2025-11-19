import express from 'express'
import { connectDB } from './config/db.config.js'

//importing routes
import authRoutes from './routes/auth.routes.js'

const PORT = 8000

//create instance
const app = express()

//Connect to DB
connectDB()

//using middlewares
app.use(express.json({limit:'10mb'}))

app.get('/', (req,res) =>{
    res.status(200).json({
        message:'Server is up & running'
    })
})

//!using routes
app.use('/api/auth',authRoutes)


//error handling middleware
app.use((error,req,res,next)=>{
    const message = error?.message || 'something went wrong'
    res.status(500).json({
        message:message,
        status:'error',
        success:false,
        data:null,
    })
})

app.listen(PORT,()=>{
console.log(`Server is running at http://localhost:${PORT}`)
})