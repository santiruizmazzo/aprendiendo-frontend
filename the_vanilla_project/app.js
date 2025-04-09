let paginaActual = 1;
let tamanioPagina = 10;
let totalPeliculas = 0;
let totalPaginas = 0;

const MOVIE_API_URL = 'https://the-movie-api-ykho.onrender.com';
const endpointBackend = `${MOVIE_API_URL}/movies?page=${paginaActual}&size=${tamanioPagina}`;

const contadoresPaginaActual = document.querySelectorAll('.pagina-actual');
const botonesPaginaAnterior = document.querySelectorAll('.pagina-anterior');
const botonesPaginaSiguiente = document.querySelectorAll('.pagina-siguiente');
const botonReset = document.querySelector('.reset');

botonReset.addEventListener("click", function (e) {
    const main = document.querySelector('main');
    main.innerHTML = '';
    console.log(main);
});

function actualizarDatosEnUi(respuestaEnTexto) {
    const peliculas = JSON.parse(respuestaEnTexto)['movies'];
    paginaActual = JSON.parse(respuestaEnTexto)['metadata']['page'];
    tamanioPagina = JSON.parse(respuestaEnTexto)['metadata']['size'];
    totalPeliculas = JSON.parse(respuestaEnTexto)['metadata']['movie_count'];
    totalPaginas = JSON.parse(respuestaEnTexto)['metadata']['page_count'];
    
    for (const contador of contadoresPaginaActual) {
        contador.innerText = `${paginaActual} / ${totalPaginas}`
    }
    
    const main = document.querySelector('main');

    for (const pelicula of peliculas) {
        const tarjetaPelicula = crearTarjetaPelicula(pelicula);
        main.appendChild(tarjetaPelicula);
    }
}

function crearTarjetaPelicula(pelicula) {
    const tarjetaPelicula = document.createElement('div');
    tarjetaPelicula.className = 'tarjeta-pelicula';

    const placeholderCargando = document.createElement('div');
    placeholderCargando.className = 'placeholder-cargando';

    const detallesPelicula = document.createElement('div');
    detallesPelicula.className = 'detalles-pelicula';

    tarjetaPelicula.appendChild(placeholderCargando);
    tarjetaPelicula.appendChild(detallesPelicula);

    const titulo = document.createElement('h2');
    titulo.innerText = pelicula.title;
    
    const director = document.createElement('p');
    director.innerText = pelicula.director;
    
    const anio = document.createElement('p');
    anio.innerText = pelicula.year;

    detallesPelicula.appendChild(titulo);
    detallesPelicula.appendChild(director);
    detallesPelicula.appendChild(anio);

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

obtenerDatosPeliculas(endpointBackend);