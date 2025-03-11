"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("soudfy-cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("soudfy-cart", JSON.stringify(cart))
  }, [cart])

  // Add item to cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      // Check if item already exists in cart (with same format)
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.format === item.format,
      )

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += item.quantity
        return updatedCart
      } else {
        // Add new item if it doesn't exist
        return [...prevCart, item]
      }
    })
  }

  // Update item quantity
  const updateQuantity = (item, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id && cartItem.format === item.format ? { ...cartItem, quantity: newQuantity } : cartItem,
      ),
    )
  }

  // Remove item from cart
  const removeFromCart = (item) => {
    setCart((prevCart) => prevCart.filter((cartItem) => !(cartItem.id === item.id && cartItem.format === item.format)))
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

