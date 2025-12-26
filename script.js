// Данные о фильмах
const movies = [
  { id: 1, title: "Матрица", year: 1999, kinopoiskId: 301, poster: "img/matrix.png" },
  { id: 2, title: "Начало", year: 2010, kinopoiskId: 447301, poster: "img/Inception.jpg" },
  { id: 3, title: "Интерстеллар", year: 2014, kinopoiskId: 258687, poster: "img/Interstellar.jpg" },
  { id: 4, title: "Побег из Шоушенка", year: 1994, kinopoiskId: 326, poster: "img/shawshank.png" },
  { id: 5, title: "Криминальное чтиво", year: 1994, kinopoiskId: 342, poster: "img/crime.jpg" },
  { id: 6, title: "Поймай меня если сможешь", year: 2002, kinopoiskId: 324, poster: "img/catch me if you can.jpg" }
];

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let showingFavorites = false;

const movieListEl = document.getElementById('movie-list');
const favoritesListEl = document.getElementById('favorites-list');
const toggleBtn = document.getElementById('toggle-favorites');

// Функция отображения фильмов
function renderMovies(moviesArray, container) {
  container.innerHTML = '';
  moviesArray.forEach(movie => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.dataset.id = movie.id;
    movieCard.innerHTML = `
      <img class="movie-poster" src="${movie.poster}" alt="${movie.title}">
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-year">${movie.year}</div>
        <div class="movie-buttons">
          <button class="btn-favorite" data-id="${movie.id}">
            ★ ${isFavorite ? 'Удалить' : 'В избранное'}
          </button>
          <button class="btn-watch" data-id="${movie.id}">
            ▶ Перейти к просмотру
          </button>
        </div>
      </div>
    `;
    container.appendChild(movieCard);

    // Обработка ошибки загрузки изображения
    const img = movieCard.querySelector('.movie-poster');
    img.addEventListener('error', () => {
      img.src = 'https://via.placeholder.com/400x600/444/eee?text=No+Poster';
    });

    // Клик по карточке (но не по кнопкам) → модальное окно
    movieCard.addEventListener('click', (e) => {
      if (e.target.closest('.btn-favorite') || e.target.closest('.btn-watch')) return;
      openMovieModal(movie);
    });
  });

  // Обработчики кнопок "Избранное"
  container.querySelectorAll('.btn-favorite').forEach(btn => {
    btn.addEventListener('click', toggleFavorite);
  });

  // Обработчики кнопок "Перейти к просмотру"
  container.querySelectorAll('.btn-watch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      const movie = movies.find(m => m.id === id);
      if (movie) {
        window.open(`https://www.kinopoisk.ru/film/${movie.kinopoiskId}/`, '_blank');
      }
    });
  });
}

// Переключение избранного
function toggleFavorite(e) {
  const id = parseInt(e.target.dataset.id);
  const movie = movies.find(m => m.id === id);
  if (!movie) return;

  const index = favorites.findIndex(f => f.id === id);
  if (index === -1) {
    favorites.push(movie);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));

  if (showingFavorites) {
    renderMovies(favorites, favoritesListEl);
  } else {
    renderMovies(movies, movieListEl);
  }
}

// Переключение между списками
toggleBtn.addEventListener('click', () => {
  showingFavorites = !showingFavorites;
  if (showingFavorites) {
    toggleBtn.textContent = 'Все фильмы';
    movieListEl.classList.add('hidden');
    favoritesListEl.classList.remove('hidden');
    renderMovies(favorites, favoritesListEl);
  } else {
    toggleBtn.textContent = 'Избранное';
    favoritesListEl.classList.add('hidden');
    movieListEl.classList.remove('hidden');
    renderMovies(movies, movieListEl);
  }
});

// Модальное окно
function openMovieModal(movie) {
  document.getElementById('modal-poster').src = movie.poster;
  document.getElementById('modal-title').textContent = movie.title;
  document.getElementById('modal-year').textContent = `Год: ${movie.year}`;

  document.getElementById('go-to-kinopoisk').onclick = () => {
    window.open(`https://www.kinopoisk.ru/film/${movie.kinopoiskId}/`, '_blank');
  };

  document.getElementById('modal').classList.remove('hidden');
}

// Закрытие модального окна
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    document.getElementById('modal').classList.add('hidden');
  }
});

// Функция для прокрутки вверх
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Функция для прокрутки вниз
function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Функция для определения направления прокрутки
function updateScrollButton() {
  const scrollButton = document.getElementById('scroll-button');
  const scrollPosition = window.scrollY;
  const halfPageHeight = window.innerHeight / 2;

  if (scrollPosition > halfPageHeight) {
    scrollButton.textContent = '↑';
    scrollButton.onclick = scrollToTop;
  } else {
    scrollButton.textContent = '↓';
    scrollButton.onclick = scrollToBottom;
  }
}

// Обработчик события прокрутки
window.addEventListener('scroll', updateScrollButton);

// Инициализация при загрузке страницы
updateScrollButton();

// Инициализация
renderMovies(movies, movieListEl);
