const phrases = [
  {id: 1, german: "Guten Morgen!", ukrainian: "Добрий ранок!"}
];

// Загрузка первой фразы
document.getElementById("phrase-german").textContent = phrases[0].german;
document.getElementById("phrase-ukrainian").textContent = phrases[0].ukrainian;