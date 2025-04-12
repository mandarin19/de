// API ключи
const PIXABAY_API_KEY = '49715163-f6f66decab0b2289715c8648f';
const PLAYHT_API_KEY = 'f51fcc9401c845f99852a15529797167';
const PLAYHT_USER_ID = 'C1LWicA88EgXcyTYDN6xlkw5Qrd2';

console.log('Загрузка words.js...');

fetch('data/words.json')
  .then(response => {
    console.log('Fetching words.json...');
    if (!response.ok) throw new Error(`Не удалось загрузить words.json: ${response.status}`);
    return response.json();
  })
  .then(words => {
    console.log('Words loaded:', words.length);
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
    const sectionSelect = document.getElementById('section');
    const modeSelect = document.getElementById('mode');
    const categorySelect = document.getElementById('category');

    if (!imageEl || !germanEl || !ukrainianEl || !audioBtn || !menuBtn || !closeMenuBtn || !menu) {
      console.error('Ошибка: Не найдены DOM-элементы');
      return;
    }

    async function fetchImage(word) {
      console.log(`Fetching image for: ${word}`);
      try {
        const response = await fetch(
          `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&lang=de&image_type=photo&safesearch=true`
        );
        if (!response.ok) throw new Error(`Pixabay error: ${response.status}`);
        const data = await response.json();
        return data.hits[0]?.webformatURL || 'https://via.placeholder.com/300x200?text=Зображення';
      } catch (err) {
        console.error(`Ошибка Pixabay для ${word}:`, err);
        return 'https://via.placeholder.com/300x200?text=Зображення';
      }
    }

    async function fetchAudio(word) {
      console.log(`Fetching audio for: ${word}`);
      try {
        const response = await fetch('https://api.play.ht/v2/tts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PLAYHT_API_KEY}`,
            'X-USER-ID': PLAYHT_USER_ID,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            text: word,
            voice: 'de-DE-Felix-Male',
            output_format: 'mp3'
          })
        });
        if (!response.ok) throw new Error(`Play.ht error: ${response.status}`);
        const data = await response.json();
        if (data._links && data._links.mp3) {
          return data._links.mp3.href;
        }
        throw new Error('Нет ссылки на аудио');
      } catch (err) {
        console.error(`Ошибка Play.ht для ${word}:`, err);
        return null;
      }
    }

    function updateCard() {
      if (currentWords.length === 0) {
        console.warn('Нет слов для отображения');
        return;
      }
      const word = currentWords[currentIndex];
      console.log('Updating card:', word.german);
      germanEl.textContent = word.german;
      ukrainianEl.textContent = word.ukrainian;
      ukrainianEl.classList.add('blur-sm');
      ukrainianEl.onclick = () => ukrainianEl.classList.toggle('blur-sm');
      audioBtn.disabled = true;
      audioBtn.textContent = 'Завантаження...';

      fetchImage(word.german).then(url => {
        imageEl.src = url;
        imageEl.onerror = () => {
          console.warn(`Не удалось загрузить изображение для ${word.german}`);
          imageEl.src = 'https://via.placeholder.com/300x200?text=Зображення';
        };
      });

      fetchAudio(word.german).then(url => {
        if (url) {
          audioBtn.dataset.audio = url;
          audioBtn.disabled = false;
          audioBtn.textContent = '▶ Вимова';
        } else {
          audioBtn.textContent = 'Аудіо недоступне';
        }
      });
    }

    function playAudio() {
      const audioUrl = audioBtn.dataset.audio;
      if (audioUrl) {
        console.log('Playing audio:', audioUrl);
        const audio = new Audio(audioUrl);
        audio.play().catch(err => {
          console.error('Ошибка воспроизведения:', err);
          audioBtn.textContent = 'Аудіо недоступне';
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
      console.log('Updating words, mode:', mode, 'category:', category);
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
      console.log('Prev card:', currentIndex);
      updateCard();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = currentIndex < currentWords.length - 1 ? currentIndex + 1 : 0;
      console.log('Next card:', currentIndex);
      updateCard();
    });

    audioBtn.addEventListener('click', playAudio);

    menuBtn.addEventListener('click', () => {
      console.log('Toggle menu');
      menu.classList.toggle('translate-x-full');
      menu.classList.toggle('hidden');
    });

    closeMenuBtn.addEventListener('click', () => {
      console.log('Close menu');
      menu.classList.add('translate-x-full');
      menu.classList.add('hidden');
    });

    sectionSelect.addEventListener('change', e => {
      console.log('Section changed:', e.target.value);
      window.location.href = `${e.target.value}.html`;
    });

    modeSelect.addEventListener('change', e => {
      mode = e.target.value;
      console.log('Mode changed:', mode);
      updateWords();
    });

    categorySelect.addEventListener('change', e => {
      category = e.target.value;
      console.log('Category changed:', category);
      updateWords();
    });

    console.log('Initializing card...');
    updateWords();
  })
  .catch(err => console.error('Ошибка загрузки данных:', err));