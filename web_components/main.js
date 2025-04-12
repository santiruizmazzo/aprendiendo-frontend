document.addEventListener('DOMContentLoaded', () => {
    const cc = document.querySelector('componente-custom');
    cc.addEventListener('click', cambiarTitulo);
    cc.addEventListener('click', cambiarColor);
});

function cambiarTitulo(e) {
    const cc = e.target;
    cc.titulo = cc.titulo === 'Santi' ? 'Nico' : 'Santi';
}

function cambiarColor(e) {
    const cc = e.target;
    cc.color = cc.color === 'red' ? 'blue' : 'red';
}