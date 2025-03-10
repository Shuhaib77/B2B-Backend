import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db'
import productsRoutes from './routes/prductRoutes'
import authRoute from './routes/authRoutes'

const app=express()

app.use(cors())
app.use(express.json())
app.use("/api/wholesaler",productsRoutes)
app.use("/api",authRoute)

connectDB()

export default app