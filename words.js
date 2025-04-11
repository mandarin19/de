fetch('data/words.json')
  .then(response => response.json())
  .then(data => {
    const words = data;
    let currentIndex = 0;
    let currentWords = words;
    let mode = "20";
    let category = "all";
    // Остальной код...
  });
// Загрузка данных (в реальном проекте будет fetch из words.json)
const words = [
  { id: 1, german: "Haus", ukrainian: "Дім", image: "https://source.unsplash.com/random/?house", audio: "https://forvo.com/word/haus/#de", category: "Дом" },
  // ... 500 слов
];

let currentIndex = 0;
let currentWords = words;
let mode = "20";
let category = "all";

const imageEl = document.getElementById("word-image");
const germanEl = document.getElementById("word-german");
const ukrainianEl = document.getElementById("word-ukrainian");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const modeSelect = document.getElementById("mode");
const categorySelect = document.getElementById("category");

function updateCard() {
  const word = currentWords[currentIndex];
  imageEl.src = word.image;
  germanEl.textContent = word.german;
  ukrainianEl.textContent = word.ukrainian;
  ukrainianEl.classList.add("blur-sm");
}

function playWordAudio() {
  const word = currentWords[currentIndex];
  const audio = new Audio(word.audio);
  audio.play();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateWords() {
  if (category === "all") {
    currentWords = words;
  } else {
    currentWords = words.filter(word => word.category === category);
  }

  if (mode === "random") {
    currentWords = shuffle([...currentWords]);
  } else if (mode === "20") {
    currentWords = currentWords.slice(0, 20);
  }

  currentIndex = 0;
  updateCard();
}

prevBtn.addEventListener("click", () => {
  currentIndex = currentIndex > 0 ? currentIndex - 1 : currentWords.length - 1;
  updateCard();
});

nextBtn.addEventListener("click", () => {
  currentIndex = currentIndex < currentWords.length - 1 ? currentIndex + 1 : 0;
  updateCard();
});

modeSelect.addEventListener("change", (e) => {
  mode = e.target.value;
  updateWords();
});

categorySelect.addEventListener("change", (e) => {
  category = e.target.value;
  updateWords();
});

// Инициализация
updateWords();