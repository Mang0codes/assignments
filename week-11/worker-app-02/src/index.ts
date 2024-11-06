import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRouter } from "./router/userRouter";
import { postRouter } from "./router/postRouter";
import { tagRouter } from "./router/tagRouter";

const app = new Hono();
app.use(cors());

app.route('/api/v1/user', userRouter);
app.route('/api/v1/posts', postRouter);
app.route('/api/v1/tags', tagRouter);
app.get('/',(c) => {
    return c.text("hello Albia");
});

export default app;