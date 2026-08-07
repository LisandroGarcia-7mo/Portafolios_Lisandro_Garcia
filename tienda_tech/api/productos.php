<?php
// 1. Avisamos que vamos a devolver un JSON
header("Content-Type: application/json");
// 2. Traemos la conexión a la base de datos
require '../conexion.php';
// 3. Escribimos la consulta SQL (Para traer todo de la tabla productos)
$sql = "SELECT * FROM productos";
// 4. Ejecutamos la consulta usando la variable $conexion
$resultado = $conexion->query($sql);
// 5. Convertimos los registros de MySQL a un Array asociativo de PHP
$productos = $resultado->fetch_all(MYSQLI_ASSOC);
// 6. Transformamos el Array a texto JSON y lo imprimimos
echo json_encode($productos);
?>