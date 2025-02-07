<?php
include("conexion.php");

// Inicializar variables para mensajes
$message = "";
$messageClass = "";

if (isset($_POST['register'])) {
    // Validación de campos obligatorios
    $requiredFields = ['name', 'lastname', 'email', 'phone', 'direction', 'country', 'birthdate', 'gender', 'education_level', 'marital_status', 'job'];
    $isEmptyField = false;

    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            $isEmptyField = true;
            break;
        }
    }

    if ($isEmptyField) {
        $message = "Llena todos los campos";
        $messageClass = "error";
    } else {
        // Recoger datos del formulario
        $name = trim($_POST['name']);
        $lastname = trim($_POST['lastname']);
        $email = trim($_POST['email']);
        $phone = trim($_POST['phone']);
        $direction = trim($_POST['direction']);
        $country = trim($_POST['country']);
        $birthdate = trim($_POST['birthdate']);
        $gender = trim($_POST['gender']);
        $education_level = trim($_POST['education_level']);
        $marital_status = trim($_POST['marital_status']);
        $job = trim($_POST['job']);
        $social = isset($_POST['social']) ? trim($_POST['social']) : '';
        $comments = isset($_POST['comments']) ? trim($_POST['comments']) : '';
        
        // Validar email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $message = "El correo electrónico no es válido.";
            $messageClass = "error";
        } else {
            // Verificar si el correo ya existe en la base de datos
            $stmt = $conex->prepare("SELECT email FROM datos WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $message = "El correo electrónico ya está registrado.";
                $messageClass = "error";
                $stmt->close();
            } else {
                // Usar prepared statement para evitar inyección SQL
                $stmt = $conex->prepare("INSERT INTO datos (nombre, apellido, email, telefono, direccion, pais, fecha_nacimiento, genero, nivel_educativo, estado_civil, area_trabajo, perfil_redes, comentarios, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

                if ($stmt === false) {
                    die("Error en la preparación de la consulta: " . $conex->error);
                }

                $fecha = date("Y-m-d");

                $stmt->bind_param("ssssssssssssss", $name, $lastname, $email, $phone, $direction, $country, $birthdate, $gender, $education_level, $marital_status, $job, $social, $comments, $fecha);

                // Ejecutar la consulta
                if ($stmt->execute()) {
                    $message = "Registro exitoso. ¡Bienvenido!";
                    $messageClass = "success";
                } else {
                    $message = "Ocurrió un error al registrar tus datos: " . $stmt->error;
                    $messageClass = "error";
                }

                // Cerrar la declaración
                $stmt->close();
            }
        }
    }
}
?>
