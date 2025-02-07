<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <form method="post" class="registration-form">
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
            <input type="file" name="media" accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
        </div>

        <!-- Intereses -->
        <div class="input-wrapper">
            <label>Selecciona tus intereses:</label>
            <div class="checkbox-group">
                <label><input type="checkbox" name="interests" value="tech"> Tecnología</label>
                <label><input type="checkbox" name="interests" value="sports"> Deportes</label>
                <label><input type="checkbox" name="interests" value="music"> Música</label>
                <label><input type="checkbox" name="interests" value="travel"> Viajes</label>
                <label><input type="checkbox" name="interests" value="art"> Arte</label>
                <label><input type="checkbox" name="interests" value="music"> Cocina</label>
                <label><input type="checkbox" name="interests" value="travel">Peliculas</label>
                <label><input type="checkbox" name="interests" value="art">Series</label>
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
</html>
