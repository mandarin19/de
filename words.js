const words = [
  {id: 1, german: "Haus", ukrainian: "Дім", image: "https://source.unsplash.com/random/?house", audio: "haus.mp3", category: "Дом"}
];

function playAudio(file) {
  const audio = new Audio(file);
  audio.play();
}

// Загрузка первого слова (для теста)
document.getElementById("word-image").src = words[0].image;
document.getElementById("word-german").textContent = words[0].german;
document.getElementById("word-ukrainian").textContent = words[0].ukrainian;