<?php
$host = "localhost";
$usuario = "root";
$clave = "";
$base = "tienda_tech";
// Creamos la conexión
$conexion = new mysqli($host,$usuario, $clave,$base);
// Configurar codificación para evitar problemas con acentos y ñ
$conexion->set_charset("utf8mb4");
// Verificamos si hay error
if ($conexion->connect_error) {
    die("Error de conexión. Hablá con el profe de Base de Datos: " . $conexion->connect_error);
}
?>
