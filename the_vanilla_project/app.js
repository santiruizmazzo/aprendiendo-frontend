let paginaActual = 1;
let tamanioPagina = 10;
let totalPeliculas = 0;
let totalPaginas = 0;
let endpointPaginaAnterior = null;
let endpointPaginaSiguiente = null;

const MOVIE_API_URL = 'https://the-movie-api-ykho.onrender.com';
const endpointBackend = `${MOVIE_API_URL}/movies?page=${paginaActual}&size=${tamanioPagina}`;

const MOVIE_DB_URL = 'https://api.themoviedb.org/3/search/movie?api_key=da1321128843457e4bab639b36d150e4'
const MOVIE_POSTERS_DB_URL = 'https://image.tmdb.org/t/p/w500'

const contadoresPaginaActual = document.querySelectorAll('.pagina-actual');
const botonesPaginaAnterior = document.querySelectorAll('.pagina-anterior');
const botonesPaginaSiguiente = document.querySelectorAll('.pagina-siguiente');
const botonReset = document.querySelector('.reset');

botonReset.addEventListener('click', function () {
    const main = document.querySelector('main');
    main.innerHTML = '';
    for (let i = 0; i < tamanioPagina; i++) {
        const tarjetaPelicula = crearTarjetaPelicula();
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
        const detallesPelicula = document.createElement('div');
        detallesPelicula.className = 'detalles-pelicula';
        const titulo = document.createElement('h2');
        titulo.innerText = pelicula.title;
        
        const director = document.createElement('p');
        director.innerText = pelicula.director;
        
        const anio = document.createElement('p');
        anio.innerText = pelicula.year;
        
        tarjetaPelicula.appendChild(detallesPelicula);
        detallesPelicula.appendChild(titulo);
        detallesPelicula.appendChild(director);
        detallesPelicula.appendChild(anio);

        obtenerUrlPosterPelicula(pelicula.title, pelicula.year).then((urlPoster) => {
            tarjetaPelicula.style.backgroundImage = `url(${MOVIE_POSTERS_DB_URL + urlPoster})`;
            tarjetaPelicula.children[0].style.display = 'none';
        });
    }

    for (let i = peliculas.length; i < tamanioPagina; i++) {
        main.removeChild(main.children[peliculas.length])
    }
}

async function obtenerUrlPosterPelicula(tituloPelicula, anioPelicula) {
    const resultado = tituloPelicula.split(" ").join("+");
    const endpointMovieDb = `${MOVIE_DB_URL}&query=${resultado}&year=${anioPelicula}`;
    const respuesta = await fetch(endpointMovieDb);
    if (!respuesta.ok) {
        throw new Error(`HTTP error: ${respuesta.status}`);
    }
    return JSON.parse(await respuesta.text())['results'][0]['poster_path'];
}

function crearTarjetaPelicula(pelicula) {
    const tarjetaPelicula = document.createElement('div');
    tarjetaPelicula.className = 'tarjeta-pelicula';

    const placeholderCargando = document.createElement('div');
    placeholderCargando.className = 'placeholder-cargando';
    tarjetaPelicula.appendChild(placeholderCargando);

    if (pelicula) {
        const detallesPelicula = document.createElement('div');
        detallesPelicula.className = 'detalles-pelicula';
        const titulo = document.createElement('h2');
        titulo.innerText = pelicula ? pelicula.title : '';
        
        const director = document.createElement('p');
        director.innerText = pelicula ? pelicula.director : '';
        
        const anio = document.createElement('p');
        anio.innerText = pelicula ? pelicula.year : '';
        
        tarjetaPelicula.appendChild(detallesPelicula);
        detallesPelicula.appendChild(titulo);
        detallesPelicula.appendChild(director);
        detallesPelicula.appendChild(anio);
    }
    return tarjetaPelicula;
}

function obtenerDatosPeliculas(endpointBackend) {
    fetch(endpointBackend)
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`HTTP error: ${respuesta.status}`);
            }
            return respuesta.text();
        })
        .then(actualizarDatosEnUi)
}

botonReset.click();
obtenerDatosPeliculas(endpointBackend);