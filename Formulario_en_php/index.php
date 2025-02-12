<?php
$server = "localhost";
$user = "root";
$pass = "";
$bd = "registro";

$conexion = mysqli_connect($server, $user, $pass, $bd);

?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <form method="post" class="registration-form" enctype="multipart/form-data">
        <h2>Formulario de Registro</h2>
        <p>Completa la información requerida</p>

        <!-- Nombre y Apellido -->
        <div class="input-wrapper">
            <input type="text" name="name" placeholder="Nombre" required>
        </div>
        <div class="input-wrapper">
            <input type="text" name="lastname" placeholder="Apellido" required>
        </div>

        <!-- Correo y Teléfono -->
        <div class="input-wrapper">
            <input type="email" name="email" placeholder="Correo Electrónico" required>
        </div>
        <div class="input-wrapper">
            <input type="tel" name="phone" placeholder="Teléfono" required>
        </div>

        <!-- Dirección y País -->
        <div class="input-wrapper">
            <input type="text" name="direction" placeholder="Dirección" required>
        </div>
        <div class="input-wrapper">
            <input type="text" name="country" placeholder="País" required>
        </div>

        <!-- Fecha de Nacimiento y Género -->
        <div class="input-wrapper">
            <label>Fecha de Nacimiento:</label>
            <input type="date" name="birthdate" required>
        </div>
        <div class="input-wrapper">
            <select name="gender" required>
                <option value="" disabled selected>Selecciona tu género</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
            </select>
        </div>

        <!-- Nivel Educativo y Estado Civil -->
        <div class="input-wrapper">
            <select name="education_level" required>
                <option value="" disabled selected>Nivel Educativo</option>
                <option value="highschool">Bachillerato</option>
                <option value="university">Universidad</option>
                <option value="postgraduate">Postgrado</option>
                <option value="other">Otro</option>
            </select>
        </div>
        <div class="input-wrapper">
            <select name="marital_status" required>
                <option value="" disabled selected>Estado Civil</option>
                <option value="single">Soltero/a</option>
                <option value="married">Casado/a</option>
                <option value="divorced">Divorciado/a</option>
                <option value="widowed">Viudo/a</option>
            </select>
        </div>

        <!-- Área de Trabajo y Redes Sociales -->
        <div class="input-wrapper">
            <input type="text" name="job" placeholder="Área de trabajo o profesión" required>
        </div>
        <div class="input-wrapper">
            <input type="text" name="social" placeholder="Perfil en redes sociales (opcional)">
        </div>

        <!-- Subir archivos (imagen, video, o documento) -->
        <div class="input-wrapper">
            <label>Sube una foto, video o documento:</label>
            <input type="file" name="media" accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onchange="previewImage(event)">
            <!-- Cuadro para la previsualización de la imagen -->
            <div id="imagePreviewContainer">
                <img id="imagePreview" src="" style="display: none; max-width: 300px; margin-top: 10px; background-color:yellow">
            </div>
        </div>


        <!-- Intereses -->
        <div class="input-wrapper">
            <label>Selecciona tus intereses:</label>
            <div class="checkbox-group">
                <label><input type="checkbox" name="interests[]" value="tech"> Tecnología</label>
                <label><input type="checkbox" name="interests[]" value="sports"> Deportes</label>
                <label><input type="checkbox" name="interests[]" value="music"> Música</label>
                <label><input type="checkbox" name="interests[]" value="travel"> Viajes</label>
                <label><input type="checkbox" name="interests[]" value="art"> Arte</label>
                <label><input type="checkbox" name="interests[]" value="cooking"> Cocina</label>
                <label><input type="checkbox" name="interests[]" value="movies">Peliculas</label>
                <label><input type="checkbox" name="interests[]" value="tv shows">Series</label>
            </div>
        </div>

        <!-- Comentarios -->
        <div class="input-wrapper">
            <textarea name="comments" placeholder="Comentarios adicionales" rows="4"></textarea>
        </div>

        <!-- Botón de Envío -->
        <input class="btn" type="submit" name="register" value="Enviar">
    </form>
</body>
<script>
    function previewImage(event) {
        var reader = new FileReader();
        reader.onload = function() {
            var image = document.getElementById('imagePreview');
            image.src = reader.result;
            image.style.display = 'block'; 
        }
        reader.readAsDataURL(event.target.files[0]);
    }
</script>


<?php

$message = "";
$messageClass = "";

if (isset($_POST['register'])) {

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

        $interests = isset($_POST['interests']) ? $_POST['interests'] : [];


        if (!is_array($interests)) {
            $interests = [$interests];
        }


        $interestsStr = implode(', ', $interests);

        print_r($interests);

        print_r($interestsStr);

        $comments = isset($_POST['comments']) ? trim($_POST['comments']) : '';


        if (isset($_FILES['media']) && $_FILES['media']['error'] == 0) {
            $media = $_FILES['media']['tmp_name'];
            $mediaContent = file_get_contents($media);
        } else {
            $mediaContent = null;
        }


        $insertardatos = "INSERT INTO datos (namee, lastname, email, phone, direction, country, birthdate, gender, education_level, marital_status, job, social, comments, media, created_at, interests) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)";

        $stmt = mysqli_prepare($conexion, $insertardatos);
        mysqli_stmt_bind_param($stmt, 'sssssssssssssbs', $name, $lastname, $email, $phone, $direction, $country, $birthdate, $gender, $education_level, $marital_status, $job, $social, $comments, $mediaContent, $interestsStr);

        if (mysqli_stmt_execute($stmt)) {
            echo "Datos insertados correctamente.";
        } else {
            die("Error en la consulta: " . mysqli_error($conexion));
        }

        mysqli_stmt_close($stmt);
    }
}
?>