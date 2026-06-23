import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, "Question text is required!"],
      unique: true,
    },
    options: {
      type: [String],
      required: [true, "Options for questions are required!"],
      // At least two (2) questions should be passed
      validate: [
        (array) => array.length >= 2,
        "At least two (2) questions must be given!",
      ],
    },
    correctAnswer: {
      type: Number,
      required: [
        true,
        "the correcter answer must be given as an 1-based index",
      ],
    },
    lecon: {
      type: String,
      required: [true, "The lecon is mandatory!"],
      enum: {
        values: [
          "front-end",
          "back-end",
          "graphes-combinatoires",
          "integrales",
          "data-science",
          "securite-informatique",
          "statistiques-analyse-donnees",
        ],
        // Throw an error message if the given lecon is not in the list
        message: "{VALUE} is not a valid lecon !",
      },
    },
  },
  { timestamps: true },
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
