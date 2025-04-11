fetch('data/articles.json')
  .then(response => response.json())
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

    function updateCard() {
      if (currentArticles.length === 0) return;
      const article = currentArticles[currentIndex];
      imageEl.src = article.image;
      germanEl.textContent = `${article.article} ${article.german}`;
      ukrainianEl.textContent = article.ukrainian;
      ukrainianEl.classList.add('blur-sm');
      ukrainianEl.onclick = () => ukrainianEl.classList.toggle('blur-sm');
    }

    function playAudio() {
      const article = currentArticles[currentIndex];
      const audio = new Audio(article.audio);
      audio.play().catch(err => console.error('Audio error:', err));
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
      menu.classList.remove('translate-x-full');
    });

    closeMenuBtn.addEventListener('click', () => {
      menu.classList.add('translate-x-full');
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
  .catch(err => console.error('Fetch error:', err));