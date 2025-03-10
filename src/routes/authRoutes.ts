import express from "express";
import { login, register } from "../controller/authController";
import { trycatch } from "../middeleware/tryCatch";


const authRoute=express.Router()

authRoute.post("/register",register)
authRoute.post("/login", trycatch(login) )

export default  authRoute