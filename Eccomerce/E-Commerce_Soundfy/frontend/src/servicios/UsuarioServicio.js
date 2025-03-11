// Servicio de usuario: gestiona el registro de usuarios, la autenticación y la gestión de perfiles.

class UsuarioServicio {
  constructor() {
    // Simulación de usuario autenticado para desarrollo
    this.usuarioActual = localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")) : null
  }

  async registrar(nombre, email, password) {
    // Simulación de registro
    return new Promise((resolve) => {
      setTimeout(() => {
        const nuevoUsuario = {
          id: Date.now(),
          nombre,
          email,
          telefono: "",
          direccion: "",
          ciudad: "",
          codigoPostal: "",
          pais: "",
          fechaRegistro: new Date().toISOString(),
        }

        localStorage.setItem("usuario", JSON.stringify(nuevoUsuario))
        this.usuarioActual = nuevoUsuario

        resolve(nuevoUsuario)
      }, 1000)
    })
  }

  async iniciarSesion(email, password) {
    // Simulación de inicio de sesión
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // En un entorno real, esto verificaría las credenciales con el backend
        if (email === "usuario@ejemplo.com" && password === "password") {
          const usuario = {
            id: 1,
            nombre: "Usuario Ejemplo",
            email: "usuario@ejemplo.com",
            telefono: "123-456-7890",
            direccion: "Calle Ejemplo 123",
            ciudad: "Ciudad Ejemplo",
            codigoPostal: "12345",
            pais: "País Ejemplo",
            fechaRegistro: "2023-01-01T00:00:00.000Z",
          }

          localStorage.setItem("usuario", JSON.stringify(usuario))
          this.usuarioActual = usuario

          resolve(usuario)
        } else {
          reject(new Error("Credenciales incorrectas"))
        }
      }, 1000)
    })
  }

  async cerrarSesion() {
    // Simulación de cierre de sesión
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem("usuario")
        this.usuarioActual = null

        window.location.href = "/"
        resolve()
      }, 500)
    })
  }

  async obtenerPerfil() {
    // Simulación de obtención de perfil
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.usuarioActual) {
          resolve(this.usuarioActual)
        } else {
          // Si no hay usuario autenticado, devolver un usuario de ejemplo para desarrollo
          const usuarioEjemplo = {
            id: 1,
            nombre: "Usuario Ejemplo",
            email: "usuario@ejemplo.com",
            telefono: "123-456-7890",
            direccion: "Calle Ejemplo 123",
            ciudad: "Ciudad Ejemplo",
            codigoPostal: "12345",
            pais: "País Ejemplo",
            fechaRegistro: "2023-01-01T00:00:00.000Z",
          }

          resolve(usuarioEjemplo)
        }
      }, 800)
    })
  }

  async actualizarPerfil(datosUsuario) {
    // Simulación de actualización de perfil
    return new Promise((resolve) => {
      setTimeout(() => {
        const usuarioActualizado = {
          ...this.usuarioActual,
          ...datosUsuario,
        }

        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado))
        this.usuarioActual = usuarioActualizado

        resolve(usuarioActualizado)
      }, 1000)
    })
  }

  async cambiarContraseña(contraseñaActual, nuevaContraseña) {
    // Simulación de cambio de contraseña
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // En un entorno real, esto verificaría la contraseña actual con el backend
        if (contraseñaActual === "password") {
          resolve({ success: true })
        } else {
          reject(new Error("Contraseña actual incorrecta"))
        }
      }, 1000)
    })
  }

  estaAutenticado() {
    return !!this.usuarioActual
  }
}

export const usuarioServicio = new UsuarioServicio()

