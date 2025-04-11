fetch('data/words.json')
  .then(response => {
    if (!response.ok) throw new Error('Не удалось загрузить words.json');
    return response.json();
  })
  .then(words => {
    let currentIndex = 0;
    let currentWords = words;
    let mode = '20';
    let category = 'all';

    const imageEl = document.getElementById('word-image');
    const germanEl = document.getElementById('word-german');
    const ukrainianEl = document.getElementById('word-ukrainian');
    const audioBtn = document.getElementById('audio-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const menu = document.getElementById('menu');
    const modeSelect = document.getElementById('mode');
    const categorySelect = document.getElementById('category');

    // Проверка элементов DOM
    if (!menuBtn || !closeMenuBtn || !menu) {
      console.error('Ошибка: Элементы меню не найдены в DOM');
      return;
    }

    function updateCard() {
      if (currentWords.length === 0) return;
      const word = currentWords[currentIndex];
      imageEl.src = word.image || 'https://via.placeholder.com/300x200?text=Картинка+недоступна';
      imageEl.onerror = () => {
        imageEl.src = 'https://via.placeholder.com/300x200?text=Картинка+недоступна';
      };
      germanEl.textContent = word.german;
      ukrainianEl.textContent = word.ukrainian;
      ukrainianEl.classList.add('blur-sm');
      ukrainianEl.onclick = () => ukrainianEl.classList.toggle('blur-sm');
      audioBtn.disabled = !word.audio;
      audioBtn.textContent = word.audio ? '▶ Вимова' : 'Аудіо недоступне';
    }

    function playAudio() {
      const word = currentWords[currentIndex];
      if (word.audio) {
        const audio = new Audio(word.audio);
        audio.play().catch(err => {
          console.error('Ошибка воспроизведения:', err);
          audioBtn.textContent = 'Помилка аудіо';
        });
      }
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function updateWords() {
      currentWords = category === 'all' ? words : words.filter(w => w.category === category);
      if (mode === 'random') {
        currentWords = shuffle([...currentWords]);
      } else if (mode === '20') {
        currentWords = currentWords.slice(0, 20);
      }
      currentIndex = 0;
      updateCard();
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : currentWords.length - 1;
      updateCard();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = currentIndex < currentWords.length - 1 ? currentIndex + 1 : 0;
      updateCard();
    });

    audioBtn.addEventListener('click', playAudio);

    // Исправленное открытие/закрытие меню
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('translate-x-full');
      menu.classList.toggle('hidden');
    });

    closeMenuBtn.addEventListener('click', () => {
      menu.classList.add('translate-x-full');
      menu.classList.add('hidden');
    });

    modeSelect.addEventListener('change', e => {
      mode = e.target.value;
      updateWords();
    });

    categorySelect.addEventListener('change', e => {
      category = e.target.value;
      updateWords();
    });

    // Инициализация
    updateWords();
  })
  .catch(err => console.error('Ошибка загрузки данных:', err));