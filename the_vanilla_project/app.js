import './components/MenuPaginacion.js';
import './components/TarjetaPelicula.js';

let paginaActual = 1;
let tamanioPagina = 10;
let totalPeliculas = 0;
let totalPaginas = 0;
let endpointPaginaAnterior = null;
let endpointPaginaSiguiente = null;

const MOVIE_API_URL = 'https://the-movie-api-ykho.onrender.com';
const MOVIE_DB_URL = 'https://api.themoviedb.org/3/search/movie?api_key=da1321128843457e4bab639b36d150e4';
const endpointBackend = `${MOVIE_API_URL}/movies?page=${paginaActual}&size=${tamanioPagina}`;

const menusPaginacion = document.querySelectorAll('menu-paginacion');

function crearPaginaDeTarjetasCargando() {
    const main = document.querySelector('main');
    main.innerHTML = '';
    for (let i = 0; i < tamanioPagina; i++) {
        const tarjetaPelicula = document.createElement('tarjeta-pelicula');
        main.appendChild(tarjetaPelicula);
    }
}

const botonReset = document.querySelector('.reset');
botonReset.addEventListener('click', crearPaginaDeTarjetasCargando);

function crearPaginaDeTarjetasConDatos(evento) {
    crearPaginaDeTarjetasCargando();
    obtenerDatosPeliculas(MOVIE_API_URL + evento.detail.endpoint);
}

document.addEventListener("pagina-anterior", crearPaginaDeTarjetasConDatos);
document.addEventListener("pagina-siguiente", crearPaginaDeTarjetasConDatos);

function actualizarDatosEnUi(respuestaEnTexto) {
    const respuesta = JSON.parse(respuestaEnTexto);
    const peliculas = respuesta['movies'];
    paginaActual = respuesta['metadata']['page'];
    tamanioPagina = respuesta['metadata']['size'];
    totalPeliculas = respuesta['metadata']['movie_count'];
    totalPaginas = respuesta['metadata']['page_count'];
    endpointPaginaAnterior = respuesta['metadata']['links']['previous'];
    endpointPaginaSiguiente = respuesta['metadata']['links']['next'];

    for (const menuPaginacion of menusPaginacion) {
        menuPaginacion.actualizar(respuesta['metadata']);
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

    eliminarTarjetasSobrantes(main, peliculas.length);
}

function eliminarTarjetasSobrantes(elementoMain, totalPeliculas) {
    for (let i = totalPeliculas; i < tamanioPagina; i++) {
        elementoMain.removeChild(elementoMain.children[totalPeliculas])
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

crearPaginaDeTarjetasCargando();
obtenerDatosPeliculas(endpointBackend);