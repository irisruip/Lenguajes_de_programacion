// Servicio de carrito de compra: administra los carritos de compra de los usuarios, incluyendo la adición/eliminación de artículos y la actualización de cantidades.

class CarritoServicio {
  constructor() {
    this.carritoKey = "soudfy-cart"
  }

  async obtenerCarrito() {
    // Obtener carrito desde localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        const carritoGuardado = localStorage.getItem(this.carritoKey)
        const carrito = carritoGuardado ? JSON.parse(carritoGuardado) : []
        resolve(carrito)
      }, 100)
    })
  }

  async guardarCarrito(carrito) {
    // Guardar carrito en localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(this.carritoKey, JSON.stringify(carrito))
        resolve(true)
      }, 100)
    })
  }

  async añadirItem(item) {
    // Añadir un item al carrito
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const carrito = await this.obtenerCarrito()

        // Verificar si el item ya existe en el carrito (con el mismo formato)
        const existingItemIndex = carrito.findIndex(
          (cartItem) => cartItem.id === item.id && cartItem.format === item.format,
        )

        if (existingItemIndex >= 0) {
          // Actualizar cantidad si el item existe
          carrito[existingItemIndex].quantity += item.quantity
        } else {
          // Añadir nuevo item si no existe
          carrito.push(item)
        }

        await this.guardarCarrito(carrito)
        resolve(carrito)
      }, 300)
    })
  }

  async actualizarCantidad(itemId, formato, nuevaCantidad) {
    // Actualizar la cantidad de un item en el carrito
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const carrito = await this.obtenerCarrito()

        const carritoActualizado = carrito.map((item) =>
          item.id === itemId && item.format === formato ? { ...item, quantity: nuevaCantidad } : item,
        )

        await this.guardarCarrito(carritoActualizado)
        resolve(carritoActualizado)
      }, 300)
    })
  }

  async eliminarItem(itemId, formato) {
    // Eliminar un item del carrito
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const carrito = await this.obtenerCarrito()

        const carritoActualizado = carrito.filter((item) => !(item.id === itemId && item.format === formato))

        await this.guardarCarrito(carritoActualizado)
        resolve(carritoActualizado)
      }, 300)
    })
  }

  async vaciarCarrito() {
    // Vaciar completamente el carrito
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        await this.guardarCarrito([])
        resolve([])
      }, 200)
    })
  }

  async calcularTotales() {
    // Calcular subtotal, impuestos, envío y total del carrito
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const carrito = await this.obtenerCarrito()

        const subtotal = carrito.reduce((total, item) => total + item.price * item.quantity, 0)
        const envio = carrito.length > 0 ? 5.99 : 0
        const impuestos = subtotal * 0.08 // 8% de impuestos
        const total = subtotal + envio + impuestos

        resolve({
          subtotal,
          envio,
          impuestos,
          total,
          cantidadItems: carrito.reduce((total, item) => total + item.quantity, 0),
        })
      }, 200)
    })
  }
}

export const carritoServicio = new CarritoServicio()

