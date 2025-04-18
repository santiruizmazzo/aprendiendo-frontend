const template = document.createElement('template');
template.innerHTML = `
    <style>
        * {
            box-sizing: border-box;
        }

        .menu-paginacion {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            padding: 40px;
        }

        .boton-pagina {
            height: 35px;
            width: 35px;
            border: none;
            background-color: rgb(46, 27, 82);
            border-radius: 7px;

            &:hover {
                cursor: pointer;
            }
        }

        .pagina-anterior {
            background-image: url('icons/arrow_back_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg');
            background-size: contain;
        }

        .pagina-siguiente {
            background-image: url('icons/arrow_forward_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg');
            background-size: contain;
        }

        .pagina-actual {
            height: fit-content;
            width: fit-content;
            font-size: 1.25rem;
        }
    </style>

    <nav class="menu-paginacion">
        <button class="boton-pagina pagina-anterior"></button>
        <div class="pagina-actual"></div>
        <button class="boton-pagina pagina-siguiente"></button>
    </nav>
`;

class MenuPaginacion extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'closed'});
        this.root.append(template.content.cloneNode(true));
        this.paginaActual = 1;
        this.tamanioPagina = 10;
        this.totalPeliculas = 0;
        this.totalPaginas = 0;
        this.endpointPaginaAnterior = null;
        this.endpointPaginaSiguiente = null;
    }

    connectedCallback() {
        const botonAnterior = this.root.querySelector('.pagina-anterior');
        botonAnterior.addEventListener('click', () => {
            if (!this.endpointPaginaAnterior) return;
            this.dispatchEvent(new CustomEvent("pagina-anterior", {
                detail: { endpoint: this.endpointPaginaAnterior },
                bubbles: true,
                composed: true
            }));
        });

        const botonSiguiente = this.root.querySelector('.pagina-siguiente');
        botonSiguiente.addEventListener('click', () => {
            if (!this.endpointPaginaSiguiente) return;
            this.dispatchEvent(new CustomEvent("pagina-siguiente", {
                detail: { endpoint: this.endpointPaginaSiguiente },
                bubbles: true,
                composed: true
            }));
        });
    }

    actualizar(informacionPaginacion) {
        this.paginaActual = informacionPaginacion['page'];
        this.tamanioPagina = informacionPaginacion['size'];
        this.totalPeliculas = informacionPaginacion['movie_count'];
        this.totalPaginas = informacionPaginacion['page_count'];
        this.endpointPaginaAnterior = informacionPaginacion['links']['previous'];
        this.endpointPaginaSiguiente = informacionPaginacion['links']['next'];
        const contadorPaginaActual = this.root.querySelector('.pagina-actual');
        contadorPaginaActual.innerText = `${this.paginaActual} / ${this.totalPaginas}`;
    }
}

customElements.define('menu-paginacion', MenuPaginacion);