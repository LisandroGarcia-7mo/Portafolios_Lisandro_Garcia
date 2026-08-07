// 1. Función para cargar todos los productos al iniciar
async function cargarCatalogo() {
// Llamamos a nuestro endpoint general
const respuesta = await fetch('api/productos.php');
const productos = await respuesta.json();
// Usamos map para crear las tarjetas HTML
const htmlTarjetas = productos.map( prod => `
<div style="border: 1px solid black; padding: 10px;">
<h3>${prod.nombre}</h3>
<p>Precio: $${prod.precio}</p>
<button onclick="verDetalle(${prod.id})">Ver Detalles</button>
</div>
`).join(''); // El join('') quita las comas entre cada tarjeta
// Inyectamos el HTML en el div correspondiente
document.getElementById('detalle-producto').innerHTML = htmlTarjetas;
}
// 2. Función que se ejecuta al hacer clic en un botón
async function verDetalle(id) {
// Llamamos a nuestro endpoint específico sumándole el ID a la URL
const respuesta = await fetch('api/producto.php?id=' + id);
const producto = await respuesta.json();
// Armamos el HTML del detalle (incluyendo la descripción y categoría)
const htmlDetalle = `
<h3>Elegiste: ${producto.nombre}</h3>
<p><strong>Categoría:</strong> ${producto.categoria}</p>
<p><strong>Descripción:</strong>
${producto.descripcion}</p>
`;
// Inyectamos en el div de detalle
document.getElementById('detalle-producto').innerHTML =
htmlDetalle;
}
// 3. Ejecutamos la carga inicial apenas abre la página
cargarCatalogo();