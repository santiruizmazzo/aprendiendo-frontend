const template = document.createElement('template');
template.innerHTML = `
    <style>
        * {
            box-sizing: border-box;
        }

        .tarjeta-pelicula {
            border-radius: 15px;
            background-size: contain;
            background-color: rgb(46, 27, 82);
            aspect-ratio: 273 / 409;
            position: relative;
            z-index: 20;
            overflow: hidden;
            transition: scale 0.15s ease-out;

            &:hover {
                scale: 1.08;
            }
        }

        .detalles-pelicula {
            position: absolute;
            height: 100%;
            width: 100%;
            border-radius: 15px;
            background: linear-gradient(rgb(0, 0, 0) 0%, rgb(0, 0, 0) 15%, rgba(0, 0, 0, 0.834) 40%, rgba(0, 0, 0, 0.462) 60%, rgba(0, 0, 0, 0.041) 75%);
            opacity: 0;
            display: flex;
            flex-flow: column wrap;
            justify-content: flex-start;
            align-items: center;
            padding: 30px;
            gap: 10px;
            z-index: 22;
            text-align: center;

            &:hover {
                opacity: 1;
            }

            & h2, p {
                color: #ffffff;
            }

            & h2 {
                margin: 0;
                font-weight: 900;
                font-size: 1.5rem;
            }

            & p {
                margin: 0;
            }
        }

        .placeholder-cargando {
            position: absolute;
            left: 0%;
            height: 100%;
            width: 75%;
            background-image: linear-gradient(to left,rgba(46, 27, 82, .05), rgba(103, 60, 184, 0.3), rgba(105, 62, 186, 0.6), rgba(103, 60, 184, 0.3), rgba(46, 27, 82, .05));
            animation: cargando 1.2s ease-out infinite;
            z-index: 21;
        }
        
        @keyframes cargando {
            0%{
                left: -75%;
            }
            100%{
                left: 100%;
            }
        }
    </style>

    <div class="tarjeta-pelicula">
        <div class="placeholder-cargando"></div>
    </div>
`;

const MOVIE_POSTERS_DB_URL = 'https://image.tmdb.org/t/p/w500';

class TarjetaPelicula extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open'});
        this.root.append(template.content.cloneNode(true));
        this.cargando = true;
    }

    cargarDetalles(pelicula) {
        this.cargando = false;
        const tarjetaPelicula = this.root.querySelector('.tarjeta-pelicula');
        this.root.querySelector('.placeholder-cargando').remove();

        const detallesPelicula = document.createElement('div');
        detallesPelicula.className = 'detalles-pelicula';
        const titulo = document.createElement('h2');
        titulo.innerText = pelicula.title;
        
        const director = document.createElement('p');
        director.innerText = pelicula.director;
        
        const anio = document.createElement('p');
        anio.innerText = pelicula.year;
        
        detallesPelicula.appendChild(titulo);
        detallesPelicula.appendChild(director);
        detallesPelicula.appendChild(anio);
        tarjetaPelicula.appendChild(detallesPelicula);
    }

    cargarPoster(urlPoster) {
        const tarjetaPelicula = this.root.querySelector('.tarjeta-pelicula');
        tarjetaPelicula.style.backgroundImage = `url(${MOVIE_POSTERS_DB_URL + urlPoster})`;
    }
}


customElements.define('tarjeta-pelicula', TarjetaPelicula);