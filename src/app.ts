import express, { Application, Request, Response, NextFunction } from "express";
import chalk from "chalk";
import * as bodyParser from "body-parser";
import router from "./router";

const log = console.log;

class App {
  public app: Application;
  public port: number;

  constructor(controllers: any, port: number) {
    this.app = express();
    this.port = port;

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

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
