let movieData = [];

window.onload = () => {
  // Fetch para obtener los datos de las películas
  fetch("https://japceibal.github.io/japflix_api/movies-data.json")
    .then(response => response.json())
    .then(data => {
      movieData = data; // Guardamos los datos pero no los mostramos aún
    })
    .catch(error => console.error("Error al obtener las películas:", error));
};

// Evento al hacer clic en el botón de búsqueda
document.getElementById("btnBuscar").addEventListener("click", () => {
  let searchTerm = document.getElementById("inputBuscar").value.toLowerCase();

  if (searchTerm) {
    let filteredMovies = movieData.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.genres.map(genre => genre.name).join(", ").toLowerCase().includes(searchTerm) ||
      movie.tagline.toLowerCase().includes(searchTerm) ||
      movie.overview.toLowerCase().includes(searchTerm)
    );

    displayMovies(filteredMovies);
  }
});

// Función para mostrar la lista de películas filtradas
function displayMovies(movies) {
  let lista = document.getElementById("lista");
  lista.innerHTML = ""; // Limpiar resultados anteriores

  movies.forEach(movie => {
    let li = document.createElement('li');
    li.className = "list-group-item";
    li.style.cursor = "pointer";
    li.innerHTML = `
      <h5>${movie.title}</h5>
      <p>${movie.tagline}</p>
      <div>Calificación: ${getStarsHTML(Math.round(movie.vote_average / 2))}</div>
    `;

    // Añadir evento de clic para mostrar detalles de la película
    li.addEventListener("click", () => {
      showMovieDetails(movie);
    });

    lista.appendChild(li); // Añadir a la lista
  });
}

// Función para convertir la calificación en estrellas
function getStarsHTML(score) {
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    starsHTML += i <= score ? '⭐' : '☆'; // Llenar con estrellas o vacías
  }
  return starsHTML;
}

// Función para mostrar detalles de la película seleccionada con un botón desplegable
function showMovieDetails(movie) {
  let detailsContainer = document.getElementById("movieDetails");

  // Convertir la fecha de lanzamiento a solo el año
  let releaseYear = new Date(movie.release_date).getFullYear();
  
  // Formatear presupuesto y ganancias con comas para hacerlo más legible
  let budgetFormatted = movie.budget.toLocaleString();
  let revenueFormatted = movie.revenue.toLocaleString();
  
  // Actualizar el contenido del contenedor con los detalles de la película
  detailsContainer.innerHTML = `
    <h2>${movie.title}</h2>
    <p><strong>Descripción:</strong> ${movie.overview}</p>
    <p><strong>Géneros:</strong> ${movie.genres.map(genre => genre.name).join(", ")}</p>

    <!-- Botón con un desplegable para más detalles -->
    <div class="dropdown mt-3">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="detailsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
        Más detalles
      </button>
      <ul class="dropdown-menu" aria-labelledby="detailsDropdown">
        <li class="dropdown-item"><strong>Año:</strong> ${releaseYear}</li>
        <li class="dropdown-item"><strong>Duración:</strong> ${movie.runtime} mins</li>
        <li class="dropdown-item"><strong>Presupuesto:</strong> $${budgetFormatted}</li>
        <li class="dropdown-item"><strong>Ganancias:</strong> $${revenueFormatted}</li>
      </ul>
    </div>
  `;

  // Hacer visible el contenedor de detalles
  detailsContainer.style.display = "block";
}