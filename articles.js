const articles = [
  {id: 1, article: "das", german: "Haus", ukrainian: "Дім", image: "https://source.unsplash.com/random/?house", audio: "https://forvo.com/word/haus/#de"},
  // ... 500 слов
];

let currentIndex = 0;
let currentArticles = articles;
let mode = "20";
let category = "all";

const imageEl = document.getElementById("article-image");
const germanEl = document.getElementById("article-german");
const ukrainianEl = document.getElementById("article-ukrainian");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const modeSelect = document.getElementById("mode");
const categorySelect = document.getElementById("category");

function updateCard() {
  const article = currentArticles[currentIndex];
  imageEl.src = article.image;
  germanEl.textContent = `${article.article} ${article.german}`;
  ukrainianEl.textContent = article.ukrainian;
  ukrainianEl.classList.add("blur-sm");
}

function playArticleAudio() {
  const article = currentArticles[currentIndex];
  const audio = new Audio(article.audio);
  audio.play();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateArticles() {
  if (category === "all") {
    currentArticles = articles;
  } else {
    currentArticles = articles.filter(article => article.category === category);
  }

  if (mode === "random") {
    currentArticles = shuffle([...currentArticles]);
  } else if (mode === "20") {
    currentArticles = currentArticles.slice(0, 20);
  }

  currentIndex = 0;
  updateCard();
}

prevBtn.addEventListener("click", () => {
  currentIndex = currentIndex > 0 ? currentIndex - 1 : currentArticles.length - 1;
  updateCard();
});

nextBtn.addEventListener("click", () => {
  currentIndex = currentIndex < currentArticles.length - 1 ? currentIndex + 1 : 0;
  updateCard();
});

modeSelect.addEventListener("change", (e) => {
  mode = e.target.value;
  updateArticles();
});

categorySelect.addEventListener("change", (e) => {
  category = e.target.value;
  updateArticles();
});

// Инициализация
updateArticles();