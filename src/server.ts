import App from "./app";
import PostsController from "./controllers/posts/posts.controller";
import "dotenv/config";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([new PostsController()]);

app.listen();
