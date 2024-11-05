import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";
import generateToken from "../services/generateToken";
import generateOTP from "../services/generateOTP";
import sendMail from "../services/sendMail";

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
      await sendMail({
        to: email,
        subject: "Registration Succesful for Hamro store",
        text: "Account registered Successfully!",
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
        const token = generateToken(user.id);

        res
          .status(200)
          .json({ success: true, message: "Login successful! 🥳🥳", token });
      }
    }
  }

  static async handleForgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      res
        .status(400)
        .json({ success: false, message: "Please provide email!" });
      return;
    }
    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Email not registered!",
      });
      return;
    }
    try {
      //otp generate,mail sent
      const otp = generateOTP();

      user.otp = otp.toString();
      user.otpGeneratedTime = Date.now().toString();
      await user.save();

      await sendMail({
        to: email,
        subject: "Password Reset",
        text: `Your OTP to change your password is ${otp}`,
      });
      res
        .status(200)
        .json({ success: true, message: "OTP sent successfully!" });
    } catch (err) {
      console.error("Couldnt send otp");
    }
  }
}

export default UserController;
