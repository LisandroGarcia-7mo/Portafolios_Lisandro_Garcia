let tareas = [];

const entradaTarea = document.getElementById('entradaTarea');
const botonAgregar = document.getElementById('botonAgregar');
const mensajeError = document.getElementById('mensajeError');
const cuerpoTabla = document.getElementById("cuerpoTabla");

function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = 'block';
}

function agregarTarea() {
    const texto = entradaTarea.value.trim(); 

    if (texto === "") {
        mostrarError("Error: La tarea no puede estar vacía.");
        return;
    }

    if (texto.length > 50) {
        mostrarError("Error: La tarea supera los 50 caracteres.");
        return;
    }

    mensajeError.style.display = 'none';

    const nuevaTarea = {
        id: Date.now(), 
        descripcion: texto,
        completada: false,
        fechaCreacion: new Date().toLocaleDateString() 
    };

    tareas.push(nuevaTarea);
    entradaTarea.value = "";
    renderizarTareas();
}

function renderizarTareas() {
    cuerpoTabla.innerHTML = ""; // Limpiar tabla

    tareas.forEach((tarea, indice) => {
        const fila = document.createElement('tr');

        // Columna 1: Checkbox
        const celdaCheck = document.createElement('td');
        const selector = document.createElement('input');
        selector.type = 'checkbox';
        selector.checked = tarea.completada;
        selector.addEventListener('change', () => alternarTarea(indice));
        celdaCheck.appendChild(selector);

        // Columna 2: Descripción
        const celdaTexto = document.createElement('td');
        celdaTexto.textContent = tarea.descripcion;
        if (tarea.completada) {
            celdaTexto.style.textDecoration = "line-through";
            celdaTexto.style.color = "gray";
        }

        // Columna 3: Fecha
        const celdaFecha = document.createElement('td');
        celdaFecha.textContent = tarea.fechaCreacion;
        celdaFecha.style.fontSize = "0.9em";

        // Ensamblar fila
        fila.appendChild(celdaCheck);
        fila.appendChild(celdaTexto);
        fila.appendChild(celdaFecha);
        
        cuerpoTabla.appendChild(fila);
    });

    actualizarContadores();
}

function alternarTarea(indice) {
    tareas[indice].completada = !tareas[indice].completada;
    renderizarTareas();
}

function actualizarContadores() {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completada).length;
    const pendientes = total - completadas;

    document.getElementById('contadorTotal').textContent = total;
    document.getElementById('contadorCompletadas').textContent = completadas;
    document.getElementById('contadorPendientes').textContent = pendientes;
}

// Eventos
botonAgregar.addEventListener('click', agregarTarea);

entradaTarea.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        agregarTarea();
    }
});