import { Router } from "express";
import {
  getQuestions,
  isCorrectAnswer,
} from "../controllers/question.controllers.js";

const questionRouter = Router();

questionRouter.get("/questions", getQuestions);
questionRouter.post("/questions/verify", isCorrectAnswer);

export default questionRouter;
