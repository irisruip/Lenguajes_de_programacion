<?php
// Establecer conexión con la base de datos
$conex = mysqli_connect("localhost", "root", "", "registro");

// Verificar si la conexión fue exitosa
if (!$conex) {
    die("Error de conexión: " . mysqli_connect_error());
} else {
    echo "Conexión exitosa a la base de datos.";
}
?>
