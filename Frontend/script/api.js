const API_BASE_URL = "https://quiz-project-rosy-gamma.vercel.app/api/v1";

export const fetchQuestionsByLesson = async (lessonName) => {
  const response = await fetch(`${API_BASE_URL}/questions?lecon=${lessonName}`);
  if (!response.ok)
    throw new Error("Erreur lors de la récupération des questions");
  const json = await response.json();
  return json.data; // Renvoie le tableau de questions
};

export const verifyAnswer = async (questionId, selectedOption) => {
  const response = await fetch(`${API_BASE_URL}/questions/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, selectedOption }),
  });

  if (!response.ok) throw new Error("Erreur de vérification");
  return await response.json(); // Renvoie { isCorrect: true/false}
};
