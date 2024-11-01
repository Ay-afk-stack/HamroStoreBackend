import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";

class UserController {
  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all the details!" });
      return;
    }
    try {
      await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 10),
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully!",
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
}

export default UserController;
