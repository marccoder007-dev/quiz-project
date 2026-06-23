// import { fetchQuestionsByLesson, verifyAnswer } from "./api.js";
// import { store } from "./store.js";

// // DOM ELEMENTS
// const coursesBtnEl = document.querySelectorAll(".js-course-btn");
// const homePageEl = document.querySelector(".js-home-page");
// const quizPageEl = document.querySelector(".js-quiz-page");
// const questionTextEl = document.querySelector(".js-question-text");
// const currentQuestionEl = document.getElementById("current-question");
// const scoreEl = document.getElementById("current-score");
// const maxQuestionsEl = document.querySelectorAll(".js-max-question");
// const answerContainerEl = document.querySelector(".js-answers-container");
// const progressBarEl = document.querySelector(".js-progress-bar");
// const resultPageEl = document.querySelector(".js-result-page");
// const finalScoreEl = document.getElementById("final-score");
// const motivationMessageEl = document.querySelector(".js-motivation-message");
// const restartBtnEl = document.getElementById("restart-btn");
// const pausePlayBtn = document.querySelector(".js-pause-play-btn");

// restartBtnEl.addEventListener("click", restartQuiz);

// coursesBtnEl.forEach((course) => {
//   course.addEventListener("click", () => {
//     startQuiz(course.dataset.lecon);
//   });
// });

// async function startQuiz(lecon) {
//   try {
//     const questions = await fetchQuestionsByLesson(lecon);

//     if (questions.length === 0) {
//       alert(
//         "Pas encore de questions disponible pour ce cours. SVP veuillez réessayer plus tard",
//       );
//       return;
//     }

//     store.reset();
//     homePageEl.classList.remove("active");
//     quizPageEl.classList.add("active");

//     renderQuiz(questions);
//   } catch (err) {
//     console.log(err);
//   }
// }

// function renderQuiz(questions) {
//   // On applique le slice pour limiter à 6 questions maximum pour le test
//   store.questions = questions.slice(0, 6);

//   if (
//     store.questions.length !== 0 &&
//     store.currentQuestionIndex >= store.questions.length
//   ) {
//     showResult();
//     return;
//   }

//   quizPageEl.classList.add("active");

//   maxQuestionsEl.forEach((el) => (el.textContent = store.questions.length));

//   store.answersDisabled = false;
//   pausePlayBtn.disabled = true;

//   const currentIndex = store.currentQuestionIndex;
//   scoreEl.textContent = store.score;
//   currentQuestionEl.textContent = currentIndex + 1;

//   const currentQuestion = store.questions[currentIndex];

//   questionTextEl.textContent = currentQuestion.questionText;

//   answerContainerEl.innerHTML = "";
//   currentQuestion.options.forEach((option, index) => {
//     const button = document.createElement("button");
//     button.textContent = option;
//     button.classList.add("answer-btn");
//     button.id = index;
//     button.dataset.questionId = currentQuestion._id;

//     button.addEventListener("click", selectAnswer);
//     answerContainerEl.appendChild(button);
//   });
// }

// async function selectAnswer(e) {
//   if (store.answersDisabled) return;

//   try {
//     pausePlayBtn.disabled = false;
//     const selectedOptionIndex = parseInt(this.id, 10);
//     const questionId = this.dataset.questionId;

//     const response = await verifyAnswer(questionId, selectedOptionIndex + 1);
//     console.log(response);
//     const isCorrect = response.correct;
//     if (isCorrect) {
//       this.classList.add("correct");
//       store.score++;
//       scoreEl.textContent = store.score;
//     } else {
//       this.classList.add("incorrect");
//       const correctAnswerIndex = response.correctAnswer - 1;

//       const correctAnswerEl = document.getElementById(`${correctAnswerIndex}`);

//       if (correctAnswerEl) {
//         correctAnswerEl.classList.add("correct");
//       }
//     }

//     // Progress bar management
//     const percent = store.getPercent();
//     progressBarEl.style.width = percent + "%";

//     store.currentQuestionIndex++;

//     store.answersDisabled = true;
//     startTimer();
//   } catch (error) {
//     console.log("Error in selectAnswer: ", error);
//   }
// }

// function showResult() {
//   quizPageEl.classList.remove("active");
//   resultPageEl.classList.add("active");
//   let message = "";
//   const finalPercent = store.getPercent();
//   if (parseInt(finalPercent, 10) >= 100) {
//     message = "Vous êtes le GOAT (Greatest of All Time) !";
//   } else if (finalPercent >= 85) {
//     message = "Ohh Magnifique Performance !";
//   } else if (finalPercent >= 45) {
//     message = "Bravo ! vous êtes déterminé !";
//   } else {
//     message = "Courage !! Encore un peu de travail et vous serez le meilleur!";
//   }

//   motivationMessageEl.textContent = message;
//   finalScoreEl.textContent = store.score;
// }

// // 💡 Fonction de redémarrage nettoyée et sécurisée
// function restartQuiz() {
//   resultPageEl.classList.remove("active");

//   const questionsToReuse = store.questions;

//   store.reset();

//   progressBarEl.style.width = "0%";

//   // 4. Relance de l'affichage
//   renderQuiz(questionsToReuse);
// }

// // Manage Pause / Play

// document
//   .querySelector(".js-pause-play")
//   .addEventListener("click", function (e) {
//     if (this.classList.contains("pause")) {
//       this.className = "fas fa-play js-pause-play play";
//       this.title = "Resume";
//       pauseTimer();
//     } else if (this.classList.contains("play")) {
//       this.className = "fas fa-pause js-pause-play pause";
//       resumeTimer();
//     }
//   });

// const QUESTION_DURATION = 2000;
// let timeId;
// let start;
// let remainingTime = QUESTION_DURATION;

// function startTimer() {
//   start = Date.now();
//   console.log();
//   timeId = setTimeout(() => {
//     renderQuiz(store.questions);
//     remainingTime = QUESTION_DURATION;
//   }, remainingTime);
// }

// function pauseTimer() {
//   clearTimeout(timeId);
//   remainingTime -= Date.now() - start;
//   console.log(remainingTime);
// }
// console.log(remainingTime);

// function resumeTimer() {
//   startTimer();
// }

import { fetchQuestionsByLesson, verifyAnswer } from "./api.js";
import { store } from "./store.js";

// DOM ELEMENTS
const coursesBtnEl = document.querySelectorAll(".js-course-btn");
const homePageEl = document.querySelector(".js-home-page");
const quizPageEl = document.querySelector(".js-quiz-page");
const questionTextEl = document.querySelector(".js-question-text");
const currentQuestionEl = document.getElementById("current-question");
const scoreEl = document.getElementById("current-score");
const maxQuestionsEl = document.querySelectorAll(".js-max-question");
const answerContainerEl = document.querySelector(".js-answers-container");
const progressBarEl = document.querySelector(".js-progress-bar");
const resultPageEl = document.querySelector(".js-result-page");
const finalScoreEl = document.getElementById("final-score");
const motivationMessageEl = document.querySelector(".js-motivation-message");
const restartBtnEl = document.getElementById("restart-btn");
const pausePlayBtn = document.querySelector(".js-pause-play-btn");

let currentLecon = "";

restartBtnEl.addEventListener("click", restartQuiz);

coursesBtnEl.forEach((course) => {
  course.addEventListener("click", () => {
    startQuiz(course.dataset.lecon);
  });
});

async function startQuiz(lecon) {
  try {
    currentLecon = lecon;
    const sessionKey = `quiz_progress_${currentLecon}`;
    const savedSession = sessionStorage.getItem(sessionKey);

    homePageEl.classList.remove("active");
    quizPageEl.classList.add("active");

    if (savedSession) {
      const data = JSON.parse(savedSession);

      if (
        !Array.isArray(data.questions) ||
        data.currentQuestionIndex >= data.questions.length
      ) {
        sessionStorage.removeItem(sessionKey);
      } else {
        store.currentQuestionIndex = data.currentQuestionIndex;
        store.score = data.score;
        store.questions = data.questions;
        store.answersDisabled = data.answersDisabled;

        const percent = store.getPercent();
        progressBarEl.style.width = percent + "%";

        renderQuiz(store.questions);
        return;
      }
    }

    const questions = await fetchQuestionsByLesson(lecon);

    if (questions.length === 0) {
      alert(
        "Pas encore de questions disponible pour ce cours. SVP veuillez réessayer plus tard",
      );
      return;
    }

    store.reset();

    renderQuiz(questions);
  } catch (err) {
    console.log(err);
  }
}

function renderQuiz(questions) {
  if (Array.isArray(questions) && questions !== store.questions) {
    store.questions = questions;
  }

  if (!store.questions.length) {
    return;
  }

  if (store.currentQuestionIndex >= store.questions.length) {
    showResult();
    return;
  }

  quizPageEl.classList.add("active");

  maxQuestionsEl.forEach((el) => (el.textContent = store.questions.length));

  store.answersDisabled = false;
  pausePlayBtn.disabled = true;

  const currentIndex = store.currentQuestionIndex;

  scoreEl.textContent = store.score;
  currentQuestionEl.textContent = currentIndex + 1;

  const currentQuestion = store.questions[currentIndex];

  if (!currentQuestion) {
    showResult();
    return;
  }

  questionTextEl.textContent = currentQuestion.questionText;

  answerContainerEl.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.textContent = option;
    button.classList.add("answer-btn");
    button.id = index;
    button.dataset.questionId = currentQuestion._id;

    button.addEventListener("click", selectAnswer);

    answerContainerEl.appendChild(button);
  });
}

async function selectAnswer(e) {
  if (store.answersDisabled) return;

  try {
    pausePlayBtn.disabled = false;
    const selectedOptionIndex = parseInt(this.id, 10);
    const questionId = this.dataset.questionId;

    const response = await verifyAnswer(questionId, selectedOptionIndex + 1);
    const isCorrect = response.correct;
    if (isCorrect) {
      this.classList.add("correct");
      store.score++;
      scoreEl.textContent = store.score;
    } else {
      this.classList.add("incorrect");
      const correctAnswerIndex = response.correctAnswer - 1;

      const correctAnswerEl = document.getElementById(`${correctAnswerIndex}`);

      if (correctAnswerEl) {
        correctAnswerEl.classList.add("correct");
      }
    }

    const percent = store.getPercent();
    progressBarEl.style.width = percent + "%";

    store.currentQuestionIndex++;
    store.answersDisabled = true;

    saveToSession();
    startTimer();
  } catch (error) {
    console.log("Error in selectAnswer: ", error);
  }
}

function showResult() {
  quizPageEl.classList.remove("active");
  resultPageEl.classList.add("active");
  let message = "";
  const finalPercent = (store.score / store.questions.length) * 100;
  if (parseInt(finalPercent, 10) === 100) {
    message = "Vous êtes le GOAT (Greatest of All Time) !";
  } else if (finalPercent >= 85) {
    message = "Ohh Magnifique Performance !";
  } else if (finalPercent >= 45) {
    message = "Bravo ! vous êtes déterminé !";
  } else {
    message = "Courage !! Encore un peu de travail et vous serez le meilleur!";
  }

  motivationMessageEl.textContent = message;
  finalScoreEl.textContent = store.score;

  sessionStorage.removeItem(`quiz_progress_${currentLecon}`);
}

function restartQuiz() {
  resultPageEl.classList.remove("active");

  const questionsToReuse = store.questions;

  store.reset();

  progressBarEl.style.width = "0%";

  saveToSession();
  renderQuiz(questionsToReuse);
}

function saveToSession() {
  if (!currentLecon) return;
  const sessionData = {
    currentQuestionIndex: store.currentQuestionIndex,
    score: store.score,
    questions: store.questions,
    answersDisabled: store.answersDisabled,
  };
  sessionStorage.setItem(
    `quiz_progress_${currentLecon}`,
    JSON.stringify(sessionData),
  );
}

// Manage Pause / Play

document
  .querySelector(".js-pause-play")
  .addEventListener("click", function (e) {
    if (this.classList.contains("pause")) {
      this.className = "fas fa-play js-pause-play play";
      this.title = "Resume";
      pauseTimer();
    } else if (this.classList.contains("play")) {
      this.className = "fas fa-pause js-pause-play pause";
      resumeTimer();
    }
  });

const QUESTION_DURATION = 2000;
let timeId;
let start;
let remainingTime = QUESTION_DURATION;

function startTimer() {
  start = Date.now();
  timeId = setTimeout(() => {
    renderQuiz(store.questions);
    remainingTime = QUESTION_DURATION;
  }, remainingTime);
}

function pauseTimer() {
  clearTimeout(timeId);
  remainingTime -= Date.now() - start;
  console.log(remainingTime);
}
console.log(remainingTime);

function resumeTimer() {
  startTimer();
}
