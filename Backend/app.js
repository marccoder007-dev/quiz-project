import express from "express";
import { PORT } from "./config/env.js";
import connectDB from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import questionRouter from "./routes/question.routes.js";

import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.status(200).json({ message: "Got You" }));

app.use("/api/v1", questionRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`The server is listening on http://localhost:${PORT}`);
  await connectDB();
});

export default app;
