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
const prevBtnEl = document.getElementById("prev-btn");
const nextBtnEl = document.getElementById("next-btn");

// Navigation Management
prevBtnEl.addEventListener("click", () => navigateQuiz(-1));
nextBtnEl.addEventListener("click", () => navigateQuiz(1));

function navigateQuiz(direction) {
  const newIndex = store.currentQuestionIndex + direction;

  if (newIndex < 0) return;

  if (newIndex >= store.questions.length) {
    showResult();
    return;
  }

  store.currentQuestionIndex = newIndex;

  const percent = store.getPercent();
  progressBarEl.style.width = percent + "%";

  saveToSession();
  renderQuiz(store.questions);
}

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
        store.userAnswers =
          data.userAnswers || new Array(data.questions.length).fill(null);

        const percent = store.getPercent();
        progressBarEl.style.width = percent + "%";

        renderQuiz(store.questions);
        return;
      }
    }

    const questions = await fetchQuestionsByLesson(lecon);

    if (questions.length === 0) {
      alert(
        "Pas encore de questions disponible pour ce cours.\nSVP veuillez réessayer plus tard",
      );
      quizPageEl.classList.remove("active");
      homePageEl.classList.add("active");
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

  prevBtnEl.disabled = store.currentQuestionIndex === 0;
  nextBtnEl.textContent =
    store.currentQuestionIndex === store.questions.length - 1
      ? "Terminer 🏁"
      : "Suivant ➡️";

  store.answersDisabled = false;

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

  const savedAnswer = store.userAnswers[currentIndex];

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.textContent = option;
    button.classList.add("answer-btn");
    button.id = index;
    button.dataset.questionId = currentQuestion._id;

    // If the user already visited this and answered
    if (savedAnswer !== null && savedAnswer !== undefined) {
      button.disabled = true;

      if (index === savedAnswer.correctChoice) {
        button.classList.add("correct");
      }

      if (
        index === savedAnswer.userChoice &&
        savedAnswer.userChoice !== savedAnswer.correctChoice
      ) {
        button.classList.add("incorrect");
      }
    } else {
      button.addEventListener("click", selectAnswer);
    }

    answerContainerEl.appendChild(button);
  });
}

async function selectAnswer(e) {
  if (store.answersDisabled) return;
  const currentIndex = store.currentQuestionIndex;
  const selectedOptionIndex = parseInt(this.id, 10);
  const questionId = this.dataset.questionId;

  try {
    const response = await verifyAnswer(questionId, selectedOptionIndex + 1);
    const correctAnswerIndex = response.correctAnswer - 1;
    const isCorrect = response.correct;

    store.userAnswers[currentIndex] = {
      userChoice: selectedOptionIndex,
      correctChoice: correctAnswerIndex,
    };

    if (isCorrect) {
      this.classList.add("correct");
      store.score++;
      scoreEl.textContent = store.score;
    } else {
      this.classList.add("incorrect");

      const correctAnswerEl = document.getElementById(`${correctAnswerIndex}`);

      if (correctAnswerEl) {
        correctAnswerEl.classList.add("correct");
      }
    }

    const buttons = answerContainerEl.querySelectorAll("button");
    buttons.forEach((btn) => (btn.disabled = true));

    const percent = store.getPercent();
    progressBarEl.style.width = percent + "%";

    saveToSession();
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
    userAnswers: store.userAnswers,
  };
  sessionStorage.setItem(
    `quiz_progress_${currentLecon}`,
    JSON.stringify(sessionData),
  );
}
