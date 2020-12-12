import {  NextFunction, Response } from "express";
import RequestWithUser from "../interfaces/requestWIthUser.interface";
import AuthenticationTokenMissingException from "../exceptions/authExceptions/AuthenticationTokenMissingException";
import * as jwt from "jsonwebtoken";
import DataStoredInToken from "../interfaces/dataStoredInToken.interface";
import userModel from "../controllers/users/users.model";

async function authMiddleWare(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verify = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const id = verify._id;
      const user = await userModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new AuthenticationTokenMissingException());
      }
    } catch (error) {
      next(new AuthenticationTokenMissingException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleWare;
