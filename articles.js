const articles = [
  {id: 1, article: "das", german: "Haus", ukrainian: "Дім", image: "https://source.unsplash.com/random/?house", audio: "haus.mp3"}
];

function playAudio(file) {
  const audio = new Audio(file);
  audio.play();
}

// Загрузка первого слова с артиклем
document.getElementById("article-image").src = articles[0].image;
document.getElementById("article-german").textContent = `${articles[0].article} ${articles[0].german}`;
document.getElementById("article-ukrainian").textContent = articles[0].ukrainian;