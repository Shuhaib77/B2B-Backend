import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db'

const app=express()

app.use(cors())
app.use(express.json())

connectDB()

export default app