// Servicio de pedidos: procesa pedidos, incluida la realización de pedidos, el seguimiento del estado de los pedidos y la gestión del historial de pedidos.

class PedidoServicio {
  constructor() {
    this.pedidosKey = "soudfy-pedidos"
  }

  async obtenerPedidosUsuario() {
    // Simulación de obtención de pedidos del usuario
    return new Promise((resolve) => {
      setTimeout(() => {
        // En un entorno real, esto obtendría los pedidos del usuario desde el backend
        const pedidosGuardados = localStorage.getItem(this.pedidosKey)
        const pedidos = pedidosGuardados ? JSON.parse(pedidosGuardados) : this.generarPedidosEjemplo()

        // Guardar pedidos de ejemplo si no existen
        if (!pedidosGuardados) {
          localStorage.setItem(this.pedidosKey, JSON.stringify(pedidos))
        }

        resolve(pedidos)
      }, 800)
    })
  }

  async obtenerPedidoPorId(id) {
    // Simulación de obtención de un pedido específico
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const pedidos = await this.obtenerPedidosUsuario()
        const pedido = pedidos.find((p) => p.id === Number.parseInt(id))

        if (pedido) {
          resolve(pedido)
        } else {
          reject(new Error("Pedido no encontrado"))
        }
      }, 500)
    })
  }

  async crearPedido(carritoItems, direccionEnvio, metodoPago) {
    // Simulación de creación de un nuevo pedido
    return new Promise((resolve) => {
      setTimeout(async () => {
        const subtotal = carritoItems.reduce((total, item) => total + item.price * item.quantity, 0)
        const costoEnvio = 5.99
        const impuestos = subtotal * 0.08 // 8% de impuestos
        const total = subtotal + costoEnvio + impuestos

        const pedidos = await this.obtenerPedidosUsuario()

        const nuevoPedido = {
          id: Date.now(),
          numero: Math.floor(Math.random() * 10000) + 1000,
          fecha: new Date().toISOString(),
          estado: "Pendiente",
          items: carritoItems,
          subtotal,
          costoEnvio,
          impuestos,
          total,
          metodoPago,
          direccionEnvio,
          fechaPago: null,
          fechaEnvio: null,
          fechaEntrega: null,
        }

        pedidos.unshift(nuevoPedido)
        localStorage.setItem(this.pedidosKey, JSON.stringify(pedidos))

        resolve(nuevoPedido)
      }, 1000)
    })
  }

  async actualizarEstadoPedido(pedidoId, nuevoEstado) {
    // Simulación de actualización del estado de un pedido
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        const pedidos = await this.obtenerPedidosUsuario()
        const pedidoIndex = pedidos.findIndex((p) => p.id === Number.parseInt(pedidoId))

        if (pedidoIndex === -1) {
          reject(new Error("Pedido no encontrado"))
          return
        }

        const pedidoActualizado = { ...pedidos[pedidoIndex], estado: nuevoEstado }

        // Actualizar fechas según el estado
        if (nuevoEstado === "Pagado" && !pedidoActualizado.fechaPago) {
          pedidoActualizado.fechaPago = new Date().toISOString()
        } else if (nuevoEstado === "Enviado" && !pedidoActualizado.fechaEnvio) {
          pedidoActualizado.fechaEnvio = new Date().toISOString()
        } else if (nuevoEstado === "Entregado" && !pedidoActualizado.fechaEntrega) {
          pedidoActualizado.fechaEntrega = new Date().toISOString()
        }

        pedidos[pedidoIndex] = pedidoActualizado
        localStorage.setItem(this.pedidosKey, JSON.stringify(pedidos))

        resolve(pedidoActualizado)
      }, 800)
    })
  }

  async cancelarPedido(pedidoId) {
    // Simulación de cancelación de un pedido
    return this.actualizarEstadoPedido(pedidoId, "Cancelado")
  }

  // Método auxiliar para generar pedidos de ejemplo
  generarPedidosEjemplo() {
    return [
      {
        id: 1,
        numero: 3201,
        fecha: "2023-06-15T10:30:00.000Z",
        estado: "Entregado",
        items: [
          {
            id: 1,
            title: "Midnight Echoes",
            artist: "Luna Waves",
            cover: "/placeholder.svg?height=500&width=500",
            price: 9.99,
            format: "vinyl",
            quantity: 1,
          },
          {
            id: 3,
            title: "Soulful Journey",
            artist: "Melody Rivers",
            cover: "/placeholder.svg?height=500&width=500",
            price: 10.99,
            format: "digital",
            quantity: 1,
          },
        ],
        subtotal: 20.98,
        costoEnvio: 5.99,
        impuestos: 1.68,
        total: 28.65,
        metodoPago: "Tarjeta de Crédito",
        direccionEnvio: {
          nombre: "Usuario Ejemplo",
          direccion: "Calle Ejemplo 123",
          ciudad: "Ciudad Ejemplo",
          codigoPostal: "12345",
          pais: "País Ejemplo",
        },
        fechaPago: "2023-06-15T10:35:00.000Z",
        fechaEnvio: "2023-06-16T14:20:00.000Z",
        fechaEntrega: "2023-06-20T11:45:00.000Z",
      },
      {
        id: 2,
        numero: 3202,
        fecha: "2023-07-10T15:45:00.000Z",
        estado: "Enviado",
        items: [
          {
            id: 5,
            title: "Guitar Dreams",
            artist: "Acoustic Wanderers",
            cover: "/placeholder.svg?height=500&width=500",
            price: 8.49,
            format: "cd",
            quantity: 2,
          },
        ],
        subtotal: 16.98,
        costoEnvio: 5.99,
        impuestos: 1.36,
        total: 24.33,
        metodoPago: "PayPal",
        direccionEnvio: {
          nombre: "Usuario Ejemplo",
          direccion: "Calle Ejemplo 123",
          ciudad: "Ciudad Ejemplo",
          codigoPostal: "12345",
          pais: "País Ejemplo",
        },
        fechaPago: "2023-07-10T15:50:00.000Z",
        fechaEnvio: "2023-07-12T09:15:00.000Z",
        fechaEntrega: null,
      },
      {
        id: 3,
        numero: 3203,
        fecha: "2023-08-05T18:20:00.000Z",
        estado: "Pendiente",
        items: [
          {
            id: 7,
            title: "Jazz Nights",
            artist: "Smooth Quartet",
            cover: "/placeholder.svg?height=500&width=500",
            price: 11.99,
            format: "digital",
            quantity: 1,
          },
          {
            id: 9,
            title: "Chill Vibes",
            artist: "Lofi Beats",
            cover: "/placeholder.svg?height=500&width=500",
            price: 7.99,
            format: "digital",
            quantity: 1,
          },
        ],
        subtotal: 19.98,
        costoEnvio: 5.99,
        impuestos: 1.6,
        total: 27.57,
        metodoPago: "Transferencia Bancaria",
        direccionEnvio: {
          nombre: "Usuario Ejemplo",
          direccion: "Calle Ejemplo 123",
          ciudad: "Ciudad Ejemplo",
          codigoPostal: "12345",
          pais: "País Ejemplo",
        },
        fechaPago: null,
        fechaEnvio: null,
        fechaEntrega: null,
      },
    ]
  }
}

export const pedidoServicio = new PedidoServicio()

