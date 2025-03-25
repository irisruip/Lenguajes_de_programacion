"use client"
import { Link } from "react-router-dom"
import { useCart } from "./CarritoContext"
import "./Cart.css"
import { useEffect } from "react"
import axios from "axios"

function convertirNumeroAFormatoVenezolano(numero) {
  // Eliminar cualquier carácter no numérico
  const numeroLimpo = numero.replace(/\D/g, '');

  // Verificar si el número comienza con 0 (formato local)
  if (numeroLimpo.startsWith('0')) {
    return '+58' + numeroLimpo.substring(1);
  }

  // Si ya está en formato internacional, devolver el número tal cual
  return '+58' + numeroLimpo;
}

function Carrito() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const usuario = JSON.parse(localStorage.getItem("user"))

  // Calcular totales
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const envio = cart.length > 0 ? 5.99 : 0
  const impuestos = subtotal * 0.08 // 8% de impuestos
  const total = subtotal + envio + impuestos

  // Agregar script de PayPal
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.paypal.com/sdk/js?client-id=AX0tP_PZ9TwJdkF7R-Q1Fg9tfrj5kfOCPRyzsJWcMCaY9BhkwC4mDXrWZ3zGW5ZiIZJ64STTWFsWQfv-&currency=USD"
    script.async = true
    script.onload = () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total.toFixed(2),
                },
              },
            ],
          })
        },
        onApprove: async (data, actions) => {
          try {
            const details = await actions.order.capture()
            const usuario = await axios.get(`/api/users/${JSON.parse(localStorage.getItem("user")).id}/`)
            console.log("carritoooo", cart)

            const orderData = {
              items: cart,
              total: total,
              estado: "Pagado",
              numero_pedido: details.id,
              fecha: new Date().toISOString(),
              direccion_envio: usuario.data.direccion,
              ciudad_envio: usuario.data.ciudad,
              codigo_postal_envio: usuario.data.codigo_postal,
              pais_envio: usuario.data.pais,
              impuestos: impuestos,
              costo_envio: envio,
              fecha_envio: new Date().toISOString(),
              subtotal: subtotal,
            }
            console.log("Datos de la orden:", orderData)

            const response = await axios.post(`/api/orders/create_order/${usuario.data.id}/`, orderData)
            console.log("Orden creada:", response.data)
            const notificacion = {
              to: convertirNumeroAFormatoVenezolano(usuario.data.telefono),
              message: `Tu pedido #${details.id} ha sido procesado. Espero que tengas un lindo dia y disfrutes tu música :)`,
            }
            console.log("Notificación:", notificacion)

            await axios.post(`/api/notification-service/send-sms/`, notificacion)
            alert("Pago exitoso. Tu pedido ha sido procesado.")
            clearCart()

          }
          catch (error) {
            console.error("Error al capturar pago de PayPal:", error)
          }
        },


      }).render("#paypal-button-container")
    }
    document.body.appendChild(script)
  }, [total, clearCart])

  if (!usuario || !usuario.id) {
    return (
      <div className="empty-cart">
        <h1>Usuario no encontrado</h1>
        <p>Por favor, inicia sesión para ver tu carrito.</p>
        <Link to="/login" className="btn">
          Iniciar Sesión
        </Link>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Tu Carrito está Vacío</h1>
        <p>Parece que aún no has añadido ningún artículo a tu carrito.</p>
        <Link to="/explorar" className="btn">
          Explorar Música
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Tu Carrito</h1>

      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-header">
            <span className="header-product">Producto</span>
            <span className="header-price">Precio</span>
            <span className="header-quantity">Cantidad</span>
            <span className="header-total">Total</span>
            <span className="header-actions"></span>
          </div>

          {cart.map((item) => (
            <div className="cart-item" key={`${item.id}-${item.format}`}>
              <div className="item-product">
                <div className="item-image">
                  <img src={item.cover || "/placeholder.svg"} alt={item.title} />
                </div>
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p>{item.artist}</p>
                  <p className="item-format">
                    Formato: {item.format === "digital" ? "Digital" : item.format === "cd" ? "CD" : "Vinilo"}
                  </p>
                </div>
              </div>

              <div className="item-price">${Number(item.price).toFixed(2)}</div>

              <div className="item-quantity">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))}
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item, Math.max(1, Number.parseInt(e.target.value) || 1))}
                  />
                  <button onClick={() => updateQuantity(item, item.quantity + 1)} aria-label="Aumentar cantidad">
                    +
                  </button>
                </div>
              </div>

              <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>

              <div className="item-actions">
                <button className="remove-button" onClick={() => removeFromCart(item)} aria-label="Eliminar artículo">
                  ×
                </button>
              </div>
            </div>
          ))}

          <div className="cart-actions">
            <button className="btn btn-secondary" onClick={clearCart}>
              Vaciar Carrito
            </button>
            <Link to="/explorar" className="btn">
              Continuar Comprando
            </Link>
          </div>
        </div>

        <div className="cart-summary">
          <h2>Resumen del Pedido</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Envío</span>
            <span>${envio.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Impuestos (8%)</span>
            <span>${impuestos.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div id="paypal-button-container"></div>

          <div className="payment-methods">
            <p>Aceptamos:</p>
            <div className="payment-icons">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carrito

