import App from "./app";
import PostsController from "./controllers/posts/posts.controller";
import AuthenticationController from "./controllers/authentication/authentication.controller";
import "dotenv/config";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([new PostsController(), new AuthenticationController()]);

app.listen();
