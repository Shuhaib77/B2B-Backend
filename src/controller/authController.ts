import { Request, Response } from "express";
import { loginService, registerService } from "../service/authService";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  console.log(name, email, password, role, "koko");

  if (!name || !email || !password || !role) {
    res.status(400).json({ message: "All fields are required" });
  }

  const data = await registerService(name, email, password, role);
  if (!data) {
    res.status(500).json({ message: "Registration failed" });
  }

  res.status(201).json({ message: "Registration successful", data: data });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
  }

  const data = await loginService(email, password);
  if (!data) {
    res.status(500).json({ message: "Login failed" });
  }

  res.status(201).json({ message: "Login successful", data: data });
};
