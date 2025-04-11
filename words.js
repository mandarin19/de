fetch('data/words.json')
  .then(response => response.json())
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
    const modeSelect = document.getElementById('mode');
    const categorySelect = document.getElementById('category');

    function updateCard() {
      if (currentWords.length === 0) return;
      const word = currentWords[currentIndex];
      imageEl.src = word.image;
      germanEl.textContent = word.german;
      ukrainianEl.textContent = word.ukrainian;
      ukrainianEl.classList.add('blur-sm');
      ukrainianEl.onclick = () => ukrainianEl.classList.toggle('blur-sm');
    }

    function playAudio() {
      const word = currentWords[currentIndex];
      const audio = new Audio(word.audio);
      audio.play().catch(err => console.error('Audio error:', err));
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

    modeSelect.addEventListener('change', e => {
      mode = e.target.value;
      updateWords();
    });

    categorySelect.addEventListener('change', e => {
      category = e.target.value;
      updateWords();
    });

    updateWords();
  })
  .catch(err => console.error('Fetch error:', err));