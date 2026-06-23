const courses = [
  {
    name: "Frontend",
    slug: "front-end",
  },
  {
    name: "Backend",
    slug: "back-end",
  },
  {
    name: "Graphes et Combinatoires",
    slug: "graphes-combinatoires",
  },
  {
    name: "Intégrales",
    slug: "integrales",
  },
  {
    name: "Data Science",
    slug: "data-science",
  },
  {
    name: "Sécurité Informatique",
    slug: "securite-informatique",
  },
  {
    name: "Statistiques et Analyse de Données",
    slug: "statistiques-analyse-donnees",
  },
];

const coursesGridEl = document.querySelector(".js-courses-grid");
const dateEl = document.getElementById("current-year");
dateEl.textContent = new Date().getFullYear();

const randomCourses = () => {
  for (const courseOb of courses) {
    const button = document.createElement("button");
    button.textContent = courseOb.name;
    button.dataset.lecon = courseOb.slug;
    button.classList.add("course-btn", "js-course-btn");
    // button.addEventListener("click", () => console.log(button.dataset.lecon));

    coursesGridEl.appendChild(button);
  }
};

randomCourses();
