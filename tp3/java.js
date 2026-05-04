const url = 'https://jsonplaceholder.typicode.com/users';
const listaUl = document.getElementById('lista-usuarios');
const buscador = document.getElementById('buscador');

let usuariosTotales = [];

async function obtenerUsuarios() {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error HTTP: ' + res.status);

        usuariosTotales = await res.json();
        renderizarUsuarios(usuariosTotales);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderizarUsuarios(listaAMostrar) {
    listaUl.innerHTML = '';

    listaAMostrar.forEach(user => {
        const li = document.createElement('li');
        li.classList.add('usuario-card');
        li.innerHTML = `
            <div class="usuario-nombre">${user.name}</div>
            <div class="usuario-email">${user.email}</div>
        `;
        listaUl.appendChild(li);
    });
}

buscador.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();

    const filtrados = usuariosTotales.filter(user =>
        user.name.toLowerCase().includes(texto)
    );

    renderizarUsuarios(filtrados);
});

obtenerUsuarios();

const urlUsuarioUno = 'https://jsonplaceholder.typicode.com/users/1';
const fichaDiv = document.getElementById('ficha-usuario');

async function obtenerUsuarioUno() {
    try {
        const res = await fetch(urlUsuarioUno);

        if (!res.ok) {
            throw new Error('No se pudo traer al usuario');
        }

        const user = await res.json();

        fichaDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${user.name}</p>
            <p><strong>Teléfono:</strong> ${user.phone}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Ciudad:</strong> ${user.address.city}</p>
        `;

    } catch (error) {
        console.error('Error en punto 4:', error);
        fichaDiv.innerHTML = '<p>Error al cargar el perfil.</p>';
    }
}

obtenerUsuarioUno();

const formulario = document.getElementById('formulario-usuario');
const mensajeServidor = document.getElementById('mensaje-servidor');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nuevo-nombre').value;
    const email = document.getElementById('nuevo-email').value;

    if (nombre === "" || email === "") {
        mensajeServidor.style.color = "red";
        mensajeServidor.innerText = "Por favor, completá todos los campos.";
        return;
    }

    const nuevoUsuario = {
        name: nombre,
        email: email
    };

    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Respuesta del servidor:', data);
            mensajeServidor.style.color = "green";
            mensajeServidor.innerText = `¡Éxito! Usuario creado con ID: ${data.id}`;
            formulario.reset();
        } else {
            throw new Error('Error al crear el usuario');
        }

    } catch (error) {
        mensajeServidor.style.color = "red";
        mensajeServidor.innerText = "Hubo un error al conectar con el servidor.";
        console.error(error);
    }
});