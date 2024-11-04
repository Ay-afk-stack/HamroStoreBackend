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

  static async login(req: Request, res: Response) {
    //Accept incoming data
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password!",
      });
      return;
    }

    //check email exist or not at first
    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });

    if (!user) {
      res
        .status(404)
        .json({ success: false, meessage: "No user with that Email 🥹🥹" });
    } else {
      //if yes-->email exist ->check password too
      const isEqual = bcrypt.compareSync(password, user.password);

      if (!isEqual) {
        res
          .status(404)
          .json({ success: false, message: "Invalid password 🥹🥹" });
      } else {
        //if password milyo vane -->token generate(jwt)
        res
          .status(200)
          .json({ success: true, message: "Login successful! 🥳🥳" });
      }
    }
  }
}

export default UserController;
