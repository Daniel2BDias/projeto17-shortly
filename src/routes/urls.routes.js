import { Router } from "express";
import validateToken from "../middlewares/validateToken.middleware.js";
import {
  deleteUrl,
  getUrlById,
  openUrl,
  postUrlController,
} from "../controllers/urls.controllers.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import postUrlSchema from "../schemas/postURL.schema.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateToken, validateSchema(postUrlSchema), postUrlController);
urlRouter.get("/urls/:id", getUrlById);
urlRouter.get("/urls/open/:shortUrl", openUrl);
urlRouter.delete("/urls/:id", validateToken, deleteUrl);

export default urlRouter;
