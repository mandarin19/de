fetch('data/phrases.json')
  .then(response => response.json())
  .then(phrases => {
    let currentIndex = 0;
    let currentPhrases = phrases;
    let mode = '20';
    let category = 'all';

    const germanEl = document.getElementById('phrase-german');
    const ukrainianEl = document.getElementById('phrase-ukrainian');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const modeSelect = document.getElementById('mode');
    const categorySelect = document.getElementById('category');

    function updateCard() {
      if (currentPhrases.length === 0) return;
      const phrase = currentPhrases[currentIndex];
      germanEl.textContent = phrase.german;
      ukrainianEl.textContent = phrase.ukrainian;
      ukrainianEl.classList.add('blur-sm');
      ukrainianEl.onclick = () => ukrainianEl.classList.toggle('blur-sm');
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
  .catch(err => console.error('Fetch error:', err));