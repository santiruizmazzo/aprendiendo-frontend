const detallesPeliculas = document.querySelectorAll('.detalles-pelicula');

fetch('https://the-movie-api-ykho.onrender.com/movies?page=2&size=10')
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.text();
    })
    .then((text) => {
        const movies = JSON.parse(text)['movies'];

        for (let i = 0; i < movies.length; i++) {
            const title = document.createElement('h2')
            const director = document.createElement('p')
            const year = document.createElement('p')
            title.innerText = movies[i].title
            director.innerText = movies[i].director
            year.innerText = movies[i].year
            detallesPeliculas[i].appendChild(title)
            detallesPeliculas[i].appendChild(director)
            detallesPeliculas[i].appendChild(year)
        }
    })