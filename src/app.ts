import express, { Application, Request, Response, NextFunction } from "express";
import chalk from "chalk";
import * as bodyParser from "body-parser";
import router from "./router";
import { connect } from "mongoose";


const log = console.log;

class App {
  public app: Application;

  constructor(controllers: any) {
    this.app = express();
    this.connectDatabase();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
  }

  private loggerMiddleWare(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    log(chalk.bgRedBright(`${request.method} ${request.path}`));
    next();
  }

  private initializeMiddleware() {
    this.app.use(this.loggerMiddleWare);
    this.app.use(bodyParser.raw({ limit: "50mb" }));
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  }

  private initializeControllers(controllers: any) {
    controllers.forEach((controller: any) => {
      this.app.use("/", controller.router); 
    });
  }

  private connectDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    log("connecting to DB.....")
    connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
      { useUnifiedTopology: true, useNewUrlParser: true },
      (err) => {
        if (!err) {
          log("DB connection created successfully");
        } else {
          log("error in creating DB connection", err);
        }
      }
    );
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }
}

export default App;
