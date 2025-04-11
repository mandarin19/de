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
    const sectionSelect = document.getElementById('section');
    const modeSelect = document.getElementById('mode');
    const categorySelect = document.getElementById('category');

    if (!menuBtn || !closeMenuBtn || !menu) {
      console.error('Ошибка: Элементы меню не найдены в DOM');
      return;
    }

    function updateCard() {
      if (currentArticles.length === 0) return;
      const article = currentArticles[currentIndex];
      imageEl.src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(`${article.article} ${article.german}`);
      germanEl.textContent = `${article.article} ${article.german}`;
      ukrainianEl.textContent = article.ukrainian;
      ukrainianEl.classList.add('blur-sm');
      ukrainianEl.onclick = () => ukrainianEl.classList.toggle('blur-sm');
      audioBtn.disabled = false;
      audioBtn.textContent = '▶ Вимова';
    }

    function playAudio() {
      const article = currentArticles[currentIndex];
      const utterance = new SpeechSynthesisUtterance(`${article.article} ${article.german}`);
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
      updateArticles();
    });

    categorySelect.addEventListener('change', e => {
      category = e.target.value;
      updateArticles();
    });

    updateArticles();
  })
  .catch(err => console.error('Ошибка загрузки данных:', err));