let paginaActual = 90;
let tamanioPagina = 10;
let totalPeliculas = 0;
let totalPaginas = 0;
let endpointPaginaAnterior = null;
let endpointPaginaSiguiente = null;

const MOVIE_API_URL = 'https://the-movie-api-ykho.onrender.com';
const endpointBackend = `${MOVIE_API_URL}/movies?page=${paginaActual}&size=${tamanioPagina}`;

const contadoresPaginaActual = document.querySelectorAll('.pagina-actual');
const botonesPaginaAnterior = document.querySelectorAll('.pagina-anterior');
const botonesPaginaSiguiente = document.querySelectorAll('.pagina-siguiente');
const botonReset = document.querySelector('.reset');

botonReset.addEventListener('click', function () {
    const main = document.querySelector('main');
    main.innerHTML = '';
    console.log(main);
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