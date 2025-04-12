const template = document.createElement('template');
template.innerHTML = `
    <style>
        .contenedor {
            display: flex;
            background-color: #000;
            padding: 100px 0;
            font-family: sans-serif;
            justify-content: center;
        }

        .titulo {
            color: #fff;
        }
    </style>

    <div class='contenedor'>
        <h2 class='titulo'>Soy un contenedor custom!!!</h2>
    </div>
`;

class ComponenteCustom extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'closed'});
        this.root.append(template.content.cloneNode(true));
    }

    // define los atributos permitidos
    static get observedAttributes() {
        return ['titulo', 'color'];
    }

    // sincroniza atributos con propiedades como vos quieras
    get titulo() {
        return this.getAttribute('titulo');
    }

    set titulo(value) {
        this.setAttribute('titulo', value);
    }

    get color() {
        return this.getAttribute('color');
    }

    set color(value) {
        this.setAttribute('color', value);
    }

    // podes manejar valores y cambios a los atributos
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName.toLowerCase() === 'titulo') {
            const div = this.root.querySelector('.contenedor');
            let titulo = div.querySelector('.titulo') ? div.querySelector('.titulo') : document.createElement('h2');
            titulo.className = 'titulo';
            titulo.textContent = newVal;
            div.append(titulo);
        }

        if (attrName.toLowerCase() === 'color') {
            let contenedor = this.root.querySelector('.contenedor');
            contenedor.style.backgroundColor = newVal;
        }
    }
}


customElements.define('componente-custom', ComponenteCustom);