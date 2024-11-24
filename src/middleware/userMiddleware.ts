import { NextFunction, Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import jwt from "jsonwebtoken";
import envConfig from "../config/config";
import User from "../database/models/userModel";

export enum Role {
  Admin = "admin",
  Customer = "customer",
}

interface IExtendedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    password: string;
  };
}

class UserMiddleware {
  async isUserLoggedIn(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) {
    //recieve token

    const token = req.headers.authorization;

    if (!token) {
      sendResponse(res, 403, false, "Token must be provided");
    }
    //validate token
    jwt.verify(
      token as string,
      envConfig.jwtSecretKey as string,
      async (err, result: any) => {
        if (err) {
          sendResponse(res, 403, false, "invalid token");
          console.error(err);
        } else {
          console.log(result);
          const userData = await User.findByPk(result.userId);
          if (!userData) {
            sendResponse(res, 404, false, "No user with that userId");
            return;
          }
          req.user = userData;
          next();
        }
      }
    );
  }

  accessTo(...roles: Role[]) {
    return (req: IExtendedRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as Role;
      if (!roles.includes(userRole)) {
        sendResponse(res, 403, false, "Permission not granted!");
        return;
      }
      next();
    };
  }
}

export default new UserMiddleware();
