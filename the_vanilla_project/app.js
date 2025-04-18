let paginaActual = 1;
let tamanioPagina = 10;
let totalPeliculas = 0;
let totalPaginas = 0;
let endpointPaginaAnterior = null;
let endpointPaginaSiguiente = null;

const MOVIE_API_URL = 'https://the-movie-api-ykho.onrender.com';
const endpointBackend = `${MOVIE_API_URL}/movies?page=${paginaActual}&size=${tamanioPagina}`;

const MOVIE_DB_URL = 'https://api.themoviedb.org/3/search/movie?api_key=da1321128843457e4bab639b36d150e4'

const contadoresPaginaActual = document.querySelectorAll('.pagina-actual');
const botonesPaginaAnterior = document.querySelectorAll('.pagina-anterior');
const botonesPaginaSiguiente = document.querySelectorAll('.pagina-siguiente');
const botonReset = document.querySelector('.reset');

botonReset.addEventListener('click', function () {
    const main = document.querySelector('main');
    main.innerHTML = '';
    for (let i = 0; i < tamanioPagina; i++) {
        const tarjetaPelicula = document.createElement('tarjeta-pelicula');
        main.appendChild(tarjetaPelicula);
    }
});

for (boton of botonesPaginaAnterior) {
    boton.addEventListener('click', function () {
        if (!endpointPaginaAnterior) return;
        botonReset.click();
        obtenerDatosPeliculas(MOVIE_API_URL + endpointPaginaAnterior);
    });
}

for (boton of botonesPaginaSiguiente) {
    boton.addEventListener('click', function () {
        if (!endpointPaginaSiguiente) return;
        botonReset.click();
        obtenerDatosPeliculas(MOVIE_API_URL + endpointPaginaSiguiente);
    });
}

function actualizarDatosEnUi(respuestaEnTexto) {
    const respuesta = JSON.parse(respuestaEnTexto);
    const peliculas = respuesta['movies'];
    paginaActual = respuesta['metadata']['page'];
    tamanioPagina = respuesta['metadata']['size'];
    totalPeliculas = respuesta['metadata']['movie_count'];
    totalPaginas = respuesta['metadata']['page_count'];
    endpointPaginaAnterior = respuesta['metadata']['links']['previous'];
    endpointPaginaSiguiente = respuesta['metadata']['links']['next'];
    
    for (const contador of contadoresPaginaActual) {
        contador.innerText = `${paginaActual} / ${totalPaginas}`
    }
    
    const main = document.querySelector('main');

    for (let i = 0; i < peliculas.length; i++) {
        const pelicula = peliculas[i];
        const tarjetaPelicula = main.children[i];
        tarjetaPelicula.cargarDetalles(pelicula);

        obtenerUrlPosterPelicula(pelicula).then((urlPoster) => {
            tarjetaPelicula.cargarPoster(urlPoster);
        });
    }

    for (let i = peliculas.length; i < tamanioPagina; i++) {
        main.removeChild(main.children[peliculas.length])
    }
}

async function obtenerUrlPosterPelicula(pelicula) {
    const resultado = pelicula.title.split(" ").join("+");
    const endpointMovieDb = `${MOVIE_DB_URL}&query=${resultado}&year=${pelicula.year}`;
    const respuesta = await fetch(endpointMovieDb);
    if (!respuesta.ok) {
        throw new Error(`HTTP error: ${respuesta.status}`);
    }
    return JSON.parse(await respuesta.text())['results'][0]['poster_path'];
}

function obtenerDatosPeliculas(endpointBackend) {
    fetch(endpointBackend)
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`HTTP error: ${respuesta.status}`);
            }
            return respuesta.text();
        })
        .then(actualizarDatosEnUi);
}

botonReset.click();
obtenerDatosPeliculas(endpointBackend);