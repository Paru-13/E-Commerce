import 'dotenv/config.js'
import express from 'express'
import { connectDB } from './config/db.config.js'

//importing routes
import authRoutes from './routes/auth.routes.js'

const PORT = process.env.PORT || 8000

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
    const statusCode = error.statusCode || 500  //everytime status code 500 jaxa so error msg aako jasari status code ni mageko, if xaina vani chai 500 status code pass send gardeko 
    res.status(statusCode).json({
        message:message,
        status:'error',
        success:false,
        data:null,
        originalError:process.env.NODE_ENV === 'development' ? error.stack:null
        //env ko value development xa vani tyo error janxa ntra null janxa
    })
})

app.listen(PORT,()=>{
console.log(`Server is running at http://localhost:${PORT}`)
})