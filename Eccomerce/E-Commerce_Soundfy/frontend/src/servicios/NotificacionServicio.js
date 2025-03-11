// Servicio de notificaciones: envía notificaciones por correo electrónico y SMS para diversos eventos (por ejemplo, confirmación de pedidos, actualizaciones de envío).

class NotificacionServicio {
  async enviarCorreoConfirmacionPedido(pedidoId, emailDestino) {
    // Simulación de envío de correo de confirmación de pedido
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Correo de confirmación para pedido #${pedidoId} enviado a ${emailDestino}`)
        resolve({
          success: true,
          mensaje: "Correo de confirmación enviado correctamente",
        })
      }, 1000)
    })
  }

  async enviarCorreoActualizacionEnvio(pedidoId, emailDestino, estadoEnvio) {
    // Simulación de envío de correo de actualización de envío
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `Correo de actualización de envío para pedido #${pedidoId} enviado a ${emailDestino}. Estado: ${estadoEnvio}`,
        )
        resolve({
          success: true,
          mensaje: "Correo de actualización de envío enviado correctamente",
        })
      }, 1000)
    })
  }

  async enviarSMSActualizacionEnvio(pedidoId, numeroTelefono, estadoEnvio) {
    // Simulación de envío de SMS de actualización de envío
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `SMS de actualización de envío para pedido #${pedidoId} enviado a ${numeroTelefono}. Estado: ${estadoEnvio}`,
        )
        resolve({
          success: true,
          mensaje: "SMS de actualización de envío enviado correctamente",
        })
      }, 800)
    })
  }

  async enviarCorreoRecuperacionContraseña(emailDestino, tokenRecuperacion) {
    // Simulación de envío de correo de recuperación de contraseña
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Correo de recuperación de contraseña enviado a ${emailDestino} con token ${tokenRecuperacion}`)
        resolve({
          success: true,
          mensaje: "Correo de recuperación de contraseña enviado correctamente",
        })
      }, 1000)
    })
  }

  async enviarNotificacionStock(emailDestino, productoId, nombreProducto) {
    // Simulación de envío de notificación de disponibilidad de stock
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `Notificación de stock disponible para producto ${nombreProducto} (ID: ${productoId}) enviada a ${emailDestino}`,
        )
        resolve({
          success: true,
          mensaje: "Notificación de stock enviada correctamente",
        })
      }, 1000)
    })
  }

  async suscribirseNewsletter(emailDestino) {
    // Simulación de suscripción a newsletter
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`${emailDestino} suscrito al newsletter`)
        resolve({
          success: true,
          mensaje: "Suscripción al newsletter completada correctamente",
        })
      }, 800)
    })
  }
}

export const notificacionServicio = new NotificacionServicio()

