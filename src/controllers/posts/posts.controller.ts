import * as express from "express";
import Post from "./post.interface";
import postModel from "./posts.model";
import Controller from "../../interfaces/controller.interface";
import PostNotFoundException from "../../exceptions/postExceptions/PostNotFoundException";
import validationMiddleware from '../../middleware/validation.middleware';
import CreatePostDto from './posts.dto';
class PostsController implements Controller {
  public path = "/posts";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.createAPost);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.patch(`${this.path}/:id`,  validationMiddleware(CreatePostDto, true), this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  getAllPosts = (request: express.Request, response: express.Response) => {
    postModel.find().then((posts) => {
      response.send({ status: true, data: posts });
    });
  };

  createAPost = (request: express.Request, response: express.Response) => {
    const postData: Post = request.body;
    const createdPost = new postModel(postData);
    createdPost.save().then((savedPost) => {
      response.send(savedPost);
    });
  };

  getPostById = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    postModel.findById(id).then((post) => {
      if (post) {
        response.send({
          status: true,
          data: post,
        });
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };

  modifyPost = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const postData: Post = request.body;
    postModel.findByIdAndUpdate(id, postData, { new: true }).then((post) => {
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };

  deletePost = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    postModel.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        response.send(200);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };
}

export default PostsController;
