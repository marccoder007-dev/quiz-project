export const store = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  answersDisabled: false,

  getPercent() {
    if (this.questions.length === 0) return 0;

    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  },

  reset() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answersDisabled = false;
  },
};
