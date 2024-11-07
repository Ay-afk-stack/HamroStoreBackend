import { Response } from "express";
import sendResponse from "./sendResponse";

const checkOTPExpiration = (
  res: Response,
  thresholdTime: number,
  otpGeneratedTime: string
) => {
  const currentTime = Date.now();
  if (currentTime - parseInt(otpGeneratedTime) <= thresholdTime) {
    sendResponse(
      res,
      200,
      true,
      "Valid OTP now u can proceed to reset your password"
    );
  } else {
    sendResponse(res, 403, false, "OTP expired! Sorry try again later!");
  }
};

export default checkOTPExpiration;
