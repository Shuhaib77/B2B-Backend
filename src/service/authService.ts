import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//user registration
const secret = process.env.SECRET_KEY;
if (!secret) {
  throw new Error("secret key is enptyy");
}

export const registerService = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  try {
    const hashPass = await bcrypt.hash(password, 10);
    console.log(name, hashPass, "swseses");
    if (!name || !email || !password || !role) {
      throw new Error("user alredy Existss");
    }
    const checkUser = await User.findOne({
      email: email,
    });
    if (checkUser) {
      throw new Error("user alredy Existss");
    }
    const newUser = await new User({
      name,
      email,
      password: hashPass,
      role: role,
    });
    newUser.save();
    console.log(newUser, "jjjjj");

    return newUser;
  } catch (error) {
    throw new Error("ded");
  }
};

//user Login
export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("user not finded");
  }
  const checkPass = await bcrypt.compare(password, user.password);
  if (!checkPass) {
    throw new Error("password auth failed");
  }

  const payload = {
    email: email,
    password: password,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  console.log(token);
  return { user, token };
};
