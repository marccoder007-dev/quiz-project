import Question from "../models/question.model.js";

export const getQuestions = async (req, res, next) => {
  try {
    const lecon = req.query.lecon;

    const validLecons = [
      "front-end",
      "back-end",
      "graphes-combinatoires",
      "integrales",
      "data-science",
      "securite-informatique",
      "statistiques-analyse-donnees",
    ];

    if (!lecon || !validLecons.includes(lecon)) {
      const error = new Error(
        `Invalid lesson parameter. Allowed values are ${validLecons.join(
          ", ",
        )}`,
      );
      error.statusCode = 400;
      throw error;
    }

    const questions = await Question.find(
      { lecon: lecon },
      { correctAnswer: 0 },
    );

    res
      .status(200)
      .json({ status: "passed", count: questions.length, data: questions });
  } catch (error) {
    next(error);
  }
};

export const isCorrectAnswer = async (req, res, next) => {
  try {
    const { questionId, selectedOption } = req.body;

    if (!questionId || selectedOption === undefined) {
      const error = new Error(
        "Please provide 'questionId' and 'selectedOption' in the request body",
      );
      error.statusCode = 400;
      throw error;
    }

    // If everything ok, retrieve the underlined question from the DB
    const question = await Question.findById(questionId);
    if (!question) {
      const error = new Error("Question not found with the provided ID");
      error.statusCode = 404;
      throw error;
    }

    const isCorrect = question.correctAnswer === Number(selectedOption);
    res.status(200).json({
      status: "passed",
      correct: isCorrect,
      correctAnswer: question.correctAnswer,
    });
  } catch (error) {
    next(error);
  }
};
