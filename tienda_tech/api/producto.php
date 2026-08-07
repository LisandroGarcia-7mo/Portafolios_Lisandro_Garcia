<?php
header("Content-Type: application/json");
require '../conexion.php';
// 1. Atrapamos el ID que viene en la URL (ej:producto.php?id=3)
$id_buscado = $_GET['id'];
// 2. Escribimos el SQL filtrando por ese ID
$sql = "SELECT * FROM productos WHERE id = " . $id_buscado;
// 3. Ejecutamos
$resultado = $conexion->query($sql);
// 4. Extraemos SOLO UNA fila (usamos fetch_assoc en lugar de fetch_all)
$producto_unico = $resultado->fetch_assoc();
// 5. Imprimimos en JSON
echo json_encode($producto_unico);
?>