import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import indexRouter from "./routes/index.routes.js";

const app = express();

app.use(json());
app.use(cors());
dotenv.config();

app.use(indexRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Online!! PORT: ${PORT}`));
