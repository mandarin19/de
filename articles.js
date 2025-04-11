fetch('data/articles.json')
  .then(response => {
    if (!response.ok) throw new Error('Не удалось загрузить articles.json');
    return response.json();
  })
  .then(articles => {
    let currentIndex = 0;
    let currentArticles = articles;
    let mode = '20';
    let category = 'all';

    const imageEl = document.getElementById('article-image');
    const germanEl = document.getElementById('article-german');
    const ukrainianEl = document.getElementById('article-ukrainian');
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
      if (currentArticles.length === 0) return;
      const article = currentArticles[currentIndex];
      imageEl.src = article.image || 'https://via.placeholder.com/300x200?text=Картинка+недоступна';
      imageEl.onerror = () => {
        imageEl.src = 'https://via.placeholder.com/300x200?text=Картинка+недоступна';
      };
      germanEl.textContent = `${article.article} ${article.german}`;
      ukrainianEl.textContent = article.ukrainian;
      ukrainianEl.classList.add('blur-sm');
      ukrainianEl.onclick = () => ukrainianEl.classList.toggle('blur-sm');
      audioBtn.disabled = !article.audio;
      audioBtn.textContent = article.audio ? '▶ Вимова' : 'Аудіо недоступне';
    }

    function playAudio() {
      const article = currentArticles[currentIndex];
      if (article.audio) {
        const audio = new Audio(article.audio);
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

    function updateArticles() {
      currentArticles = category === 'all' ? articles : articles.filter(a => a.category === category);
      if (mode === 'random') {
        currentArticles = shuffle([...currentArticles]);
      } else if (mode === '20') {
        currentArticles = currentArticles.slice(0, 20);
      }
      currentIndex = 0;
      updateCard();
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : currentArticles.length - 1;
      updateCard();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = currentIndex < currentArticles.length - 1 ? currentIndex + 1 : 0;
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
      updateArticles();
    });

    categorySelect.addEventListener('change', e => {
      category = e.target.value;
      updateArticles();
    });

    // Инициализация
    updateArticles();
  })
  .catch(err => console.error('Ошибка загрузки данных:', err));