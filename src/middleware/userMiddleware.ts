import { NextFunction, Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import jwt from "jsonwebtoken";
import envConfig from "../config/config";

class UserMiddleware {
  async isUserLoggedIn(req: Request, res: Response, next: NextFunction) {
    //recieve token

    const token = req.headers.authorization;

    if (!token) {
      sendResponse(res, 403, false, "Token must be provided");
    }
    //validate token
    jwt.verify(
      token as string,
      envConfig.jwtSecretKey as string,
      async (err, success) => {
        if (err) {
          sendResponse(res, 403, false, "invalid token");
          console.error(err);
        } else {
          console.log(success);

          next();
        }
      }
    );
    //
  }
}

export default new UserMiddleware();
