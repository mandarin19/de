fetch('data/phrases.json')
  .then(response => {
    if (!response.ok) throw new Error('Не удалось загрузить phrases.json');
    return response.json();
  })
  .then(phrases => {
    let currentIndex = 0;
    let currentPhrases = phrases;
    let mode = '20';
    let category = 'all';

    const germanEl = document.getElementById('phrase-german');
    const ukrainianEl = document.getElementById('phrase-ukrainian');
    const audioBtn = document.getElementById('audio-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const menu = document.getElementById('menu');
    const sectionSelect = document.getElementById('section');
    const modeSelect = document.getElementById('mode');
    const categorySelect = document.getElementById('category');

    if (!menuBtn || !closeMenuBtn || !menu) {
      console.error('Ошибка: Элементы меню не найдены в DOM');
      return;
    }

    function updateCard() {
      if (currentPhrases.length === 0) return;
      const phrase = currentPhrases[currentIndex];
      germanEl.textContent = phrase.german;
      ukrainianEl.textContent = phrase.ukrainian;
      ukrainianEl.classList.add('blur-sm');
      ukrainianEl.onclick = () => ukrainianEl.classList.toggle('blur-sm');
      audioBtn.disabled = false;
      audioBtn.textContent = '▶ Вимова';
    }

    function playAudio() {
      const phrase = currentPhrases[currentIndex];
      const utterance = new SpeechSynthesisUtterance(phrase.german);
      utterance.lang = 'de-DE'; // Немецкий язык
      window.speechSynthesis.speak(utterance);
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function updatePhrases() {
      currentPhrases = category === 'all' ? phrases : phrases.filter(p => p.category === category);
      if (mode === 'random') {
        currentPhrases = shuffle([...currentPhrases]);
      } else if (mode === '20') {
        currentPhrases = currentPhrases.slice(0, 20);
      }
      currentIndex = 0;
      updateCard();
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : currentPhrases.length - 1;
      updateCard();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = currentIndex < currentPhrases.length - 1 ? currentIndex + 1 : 0;
      updateCard();
    });

    audioBtn.addEventListener('click', playAudio);

    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('translate-x-full');
      menu.classList.toggle('hidden');
    });

    closeMenuBtn.addEventListener('click', () => {
      menu.classList.add('translate-x-full');
      menu.classList.add('hidden');
    });

    sectionSelect.addEventListener('change', e => {
      window.location.href = `${e.target.value}.html`;
    });

    modeSelect.addEventListener('change', e => {
      mode = e.target.value;
      updatePhrases();
    });

    categorySelect.addEventListener('change', e => {
      category = e.target.value;
      updatePhrases();
    });

    updatePhrases();
  })
  .catch(err => console.error('Ошибка загрузки данных:', err));