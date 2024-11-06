import { Hono } from "hono"
import { createPost, deletePost, getPost, getUserPosts, updatePost } from "../controller/postController";
import { authmiddleware } from "../middleware/user";


export const postRouter = new Hono();
postRouter.get('/all-posts', getPost);
postRouter.get('/post',authmiddleware, getUserPosts);
postRouter.post('/newpost', authmiddleware, createPost);
postRouter.get('/post/:id', authmiddleware, getPost);
postRouter.put('/post/:id', authmiddleware, updatePost);
postRouter.delete('/post/:id', authmiddleware, deletePost);