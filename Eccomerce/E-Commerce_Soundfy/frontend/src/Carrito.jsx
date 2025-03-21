"use client"
import { Link } from "react-router-dom"
import { useCart } from "./CarritoContext"
import "./Cart.css"

function Carrito() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const usuario = JSON.parse(localStorage.getItem("user"))

  // Calcular totales
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const envio = cart.length > 0 ? 5.99 : 0
  const impuestos = subtotal * 0.08 // 8% de impuestos
  const total = subtotal + envio + impuestos

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

          <button className="btn checkout-button">Proceder al Pago</button>

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

