"use client"
import { Link } from "react-router-dom"
import { useCart } from "./CartContext"
import "./Cart.css"

function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = cart.length > 0 ? 5.99 : 0
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your Cart is Empty</h1>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/browse" className="btn">
          Browse Music
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Cart</h1>

      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-header">
            <span className="header-product">Product</span>
            <span className="header-price">Price</span>
            <span className="header-quantity">Quantity</span>
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
                  <p className="item-format">Format: {item.format.charAt(0).toUpperCase() + item.format.slice(1)}</p>
                </div>
              </div>

              <div className="item-price">${item.price.toFixed(2)}</div>

              <div className="item-quantity">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item, Math.max(1, Number.parseInt(e.target.value) || 1))}
                  />
                  <button onClick={() => updateQuantity(item, item.quantity + 1)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
              </div>

              <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>

              <div className="item-actions">
                <button className="remove-button" onClick={() => removeFromCart(item)} aria-label="Remove item">
                  ×
                </button>
              </div>
            </div>
          ))}

          <div className="cart-actions">
            <button className="btn btn-secondary" onClick={clearCart}>
              Clear Cart
            </button>
            <Link to="/browse" className="btn">
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="btn checkout-button">Proceed to Checkout</button>

          <div className="payment-methods">
            <p>We Accept:</p>
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

export default Cart

