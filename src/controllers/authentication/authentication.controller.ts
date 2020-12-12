import * as bcrypt from "bcrypt";
import * as express from "express";

import UserWithThatEmailAlreadyExistsException from "../../exceptions/userExceptions/UserWithThatEmailAlreadyExistsException";
import WrongCredentialsException from "../../exceptions/userExceptions/WrongCredentialsException";
import Controller from "../../interfaces/controller.interface";
import validationMiddleware from "../../middleware/validation.middleware";
import LogInDto from "./login.dto";
import CreateUserDto from "../users/users.dto";
import UserModel from "../users/users.model";
import UserNotFoundException from "../../exceptions/userExceptions/UserNotFoundExcpetion";

class AuthenticationController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.loggingIn
    );
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      (user as any).password = undefined;
      response.send(user);
    }
  };

  private loggingIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInData.email }).exec();
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );
    //   delete user._doc.password;
      if (isPasswordMatching) {
        (user as any).password = undefined;
         response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
        next(new UserNotFoundException(logInData.email));
    }
};
}


export default AuthenticationController;
