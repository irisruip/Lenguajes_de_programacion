<?php

$server = "localhost";
$user = "root";
$pass = "";
$bd = "registro";

$conexion = new mysqli($server, $user, $pass, $bd);

if ($conexion->connect_error) {
    die("Error en la conexion: " . $conexion->connect_error);
} else {
    echo "Conexion exitosa";
}
