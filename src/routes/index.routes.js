import { Router } from "express";
import urlRouter from "./urls.routes.js";
import userRouter from "./user.routes.js";


const indexRouter = Router();

indexRouter.use(userRouter);
indexRouter.use(urlRouter);

export default indexRouter;