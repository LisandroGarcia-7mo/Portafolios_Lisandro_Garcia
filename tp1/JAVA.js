//ejercicio 1
var Titulo = document.getElementById("titulo")
Titulo.textContent = "!texto¡"
const parrafos = document.getElementsByClassName("parrafo");
parrafos[0].style.color = "blue";
const contenedor = document.querySelector("#contenedor");
contenedor.style.backgroundColor = "lightgreen";

//ejercicio 2
const boton = document.getElementById('miBoton');

boton.addEventListener('click', function () {
    alert("¡Clic detectado!");
    this.textContent = "¡Gracias!";
});

//ejercicio 3
const input = document.getElementById('inputTarea');
const botonagr = document.getElementById('btnAgregar');
const lista = document.getElementById('listaTareas');

botonagr.addEventListener('click', () => {
    const texto = input.value.trim();

    if (texto !== "") {
        // Crear el elemento de la lista
        const nuevoItem = document.createElement('li');
        nuevoItem.textContent = texto + " ";

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = "Eliminar";

        btnEliminar.onclick = function () {
            // Opción A: Usando remove() 
            nuevoItem.remove();

            /* 
            Opción B: Usando parentNode.removeChild(item)
            Es la forma clásica (compatible con navegadores muy antiguos). 
            Aquí accedemos al padre (la <ul>) y le pedimos que borre a su hijo.
            
            nuevoItem.parentNode.removeChild(nuevoItem); 
            */
        };

        // Programar la eliminación
        btnEliminar.onclick = function () {
            nuevoItem.remove();
        };

        nuevoItem.appendChild(btnEliminar);
        lista.appendChild(nuevoItem);

        input.value = "";
    }
});

//punto 5
const formulario = document.getElementById('formRegistro');

formulario.addEventListener('submit', (e) => {
    // Evitamos que la página se recargue
    e.preventDefault();

    // Capturamos los datos usando selectores de atributo
    const usuario = document.querySelector('input[name="usuario"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    // Mostramos los datos capturados 
    console.log("Subiendo datos...");
    console.log("Usuario:", usuario);
    console.log("Email:", email);
    console.log("Password:", password);

    alert(`Usuario ${usuario} registrado con éxito.`);

    formulario.reset();
});

document.querySelector('input[type="email"]').style.border = "2px solid blue";
document.querySelector('input[type="password"]').setAttribute('placeholder', 'Ingrese su clave aquí');

//punto6
const textarea = document.getElementById('textoComentario');
const botonPublicar = document.getElementById('btnPublicar');
const cont = document.getElementById('listaComentarios');

botonPublicar.addEventListener('click', () => {
    const comentarioTexto = textarea.value.trim();

    if (comentarioTexto !== "") {
        // 1. Crear el contenedor del comentario
        const nuevoComentario = document.createElement('div');
        nuevoComentario.className = 'comentario';

        // 2. Crear el texto del comentario
        const texto = document.createElement('span');
        texto.textContent = comentarioTexto;

        // 3. Crear el botón de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = "Eliminar";

        btnEliminar.onclick = function () {
            nuevoComentario.remove();
        };

        nuevoComentario.appendChild(texto);
        nuevoComentario.appendChild(btnEliminar);
        cont.appendChild(nuevoComentario);

        textarea.value = "";
    } else {
        alert("Por favor, escribe algo antes de publicar.");
    }
});