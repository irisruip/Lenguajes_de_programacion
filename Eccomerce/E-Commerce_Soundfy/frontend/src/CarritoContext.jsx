"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CarritoContext = createContext()

export function useCart() {
  return useContext(CarritoContext)
}

export function CarritoProvider({ children }) {
  // Inicializar carrito desde localStorage si está disponible
  const [cart, setCart] = useState(() => {
    const carritoGuardado = localStorage.getItem("soudfy-cart")
    return carritoGuardado ? JSON.parse(carritoGuardado) : []
  })

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("soudfy-cart", JSON.stringify(cart))
  }, [cart])

  // Añadir artículo al carrito
  const addToCart = (item) => {
    setCart((prevCart) => {
      // Verificar si el artículo ya existe en el carrito (con el mismo formato)
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.format === item.format,
      )

      if (existingItemIndex >= 0) {
        // Actualizar cantidad si el artículo existe
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += item.quantity
        return updatedCart
      } else {
        // Añadir nuevo artículo si no existe
        return [...prevCart, item]
      }
    })
  }

  // Actualizar cantidad de artículo
  const updateQuantity = (item, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id && cartItem.format === item.format ? { ...cartItem, quantity: newQuantity } : cartItem,
      ),
    )
  }

  // Eliminar artículo del carrito
  const removeFromCart = (item) => {
    setCart((prevCart) => prevCart.filter((cartItem) => !(cartItem.id === item.id && cartItem.format === item.format)))
  }

  // Vaciar carrito
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

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
}

