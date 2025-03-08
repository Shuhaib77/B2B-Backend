import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db'
import productsRoutes from './routes/prductRoutes'

const app=express()

app.use(cors())
app.use(express.json())
app.use("/api/wholesaler",productsRoutes)

connectDB()

export default app