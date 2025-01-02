const contenedor = document.querySelector(".contenedor")
const hijos = contenedor.children

for (let hijo of hijos) {
    console.log(hijo)
}

function cambiarTexto() {
    let parrafo = document.getElementById("parrafo")
    parrafo.innerHTML = "Este es el nuevo texto del parrafo"
    return
}