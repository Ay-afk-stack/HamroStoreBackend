import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";
import generateToken from "../services/generateToken";
import generateOTP from "../services/generateOTP";
import sendMail from "../services/sendMail";
import findData from "../services/findData";
import sendResponse from "../services/sendResponse";
import checkOTPExpiration from "../services/checkOTPExpiration";

class UserController {
  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      sendResponse(res, 400, false, "Please fill all thee details!");
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
      sendResponse(res, 201, true, "User registered successfully!");
    } catch (err) {
      console.error("Error:", err);
    }
  }

  static async login(req: Request, res: Response) {
    //Accept incoming data
    const { email, password } = req.body;
    if (!email || !password) {
      sendResponse(res, 400, false, "Please provide email and password");
      return;
    }

    //check email exist or not at first
    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });

    if (!user) {
      sendResponse(res, 404, false, "No user with that Email 🥹🥹");
    } else {
      //if yes-->email exist ->check password too
      const isEqual = bcrypt.compareSync(password, user.password);

      if (!isEqual) {
        sendResponse(res, 404, false, "Invalid password");
      } else {
        //if password milyo vane -->token generate(jwt)
        const token = generateToken(user.id);
        sendResponse(res, 200, true, "Login Successful!", token);
      }
    }
  }

  static async handleForgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      sendResponse(res, 400, false, "Enter your Email");
      return;
    }
    const [user] = await User.findAll({
      where: {
        email,
      },
    });
    if (!user) {
      sendResponse(res, 404, false, "Email not registered");
      return;
    }
    try {
      //otp generate,mail sent
      const otp = generateOTP();

      await sendMail({
        to: email,
        subject: "Password Reset",
        text: `Your OTP to change your password is ${otp}`,
      });

      user.otp = otp.toString();
      user.otpGeneratedTime = Date.now().toString();
      await user.save();

      sendResponse(res, 200, true, "OTP sent Successfully!", [otp]);
    } catch (err) {
      console.error("Couldnt send otp:", err);
    }
  }

  static async verifyOTP(req: Request, res: Response) {
    const { otp, email } = req.body;
    if (!otp || !email) {
      sendResponse(res, 400, false, "Please enter OTP and Email");
      return;
    }

    const [user] = await findData(User, email);
    if (!user) {
      sendResponse(res, 404, false, "No user Found with that email");
    }

    //otp verification
    const [data] = await User.findAll({
      where: {
        otp,
        email,
      },
    });
    if (!data) {
      sendResponse(res, 404, false, "Invalid OTP");
      return;
    }
    const otpGeneratedTime = data.otpGeneratedTime;
    checkOTPExpiration(res, 120000, otpGeneratedTime);
  }

  static async resetPassword(req: Request, res: Response) {
    const { newPassword, confirmPassword, otp, email } = req.body;
    if (!newPassword || !confirmPassword || !email) {
      sendResponse(res, 400, false, "Please fill all the fields!");
      return;
    }
    if (newPassword !== confirmPassword) {
      sendResponse(
        res,
        400,
        false,
        "New password and confirm password must be same!"
      );
    } else {
      const [user] = await findData(User, email);
      if (!user) {
        sendResponse(res, 404, false, "No email with that user");
        return;
      }
      user.password = bcrypt.hashSync(newPassword, 12);
      await user.save();
      sendResponse(res, 200, true, "Password reset successfully!!");
    }
  }
}

export default UserController;
