"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const CarritoContext = createContext()

export function useCart() {
  return useContext(CarritoContext)
}

export function CarritoProvider({ children }) {
  const [cart, setCart] = useState([])
  const usuario = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    if (!usuario || !usuario.id) {
      console.error("No hay un usuario válido en localStorage")
      return
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get(`/api/cart/ver_carrito/${usuario.id}`)
        const data = await response.data
        setCart(data.cart.items || [])
      } catch (error) {
        console.error("Error al obtener carrito:", error)
      }
    }
    fetchCart()
  }, [usuario?.id])

  const addToCart = (item) => {
    if (!usuario || !usuario.id) {
      console.error("No hay un usuario válido en localStorage")
      return
    }

    try {
      axios.post(`/api/cart/agregar_item/`, item)
    } catch (error) {
      console.error("Error al añadir al carrito:", error)
    }
  }

  const updateQuantity = (item, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id && cartItem.format === item.format ? { ...cartItem, quantity: newQuantity } : cartItem,
      ),
    )
  }

  const removeFromCart = async (item) => {
    if (!usuario || !usuario.id) {
      console.error("No hay un usuario válido en localStorage")
      return
    }

    try {
      await axios.delete(`/api/cart/eliminar_item/${usuario.id}/${item.product_id}/`)
      setCart((prevCart) => prevCart.filter((cartItem) => cartItem.product_id !== item.product_id || cartItem.format !== item.format))
    } catch (error) {
      console.error("Error al eliminar del carrito:", error)
    }
  }

  const clearCart = async () => {
    if (!usuario || !usuario.id) {
      console.error("No hay un usuario válido en localStorage")
      return
    }

    try {
      await axios.delete(`/api/cart/eliminar_carrito/${usuario.id}/`)
      setCart([])
    } catch (error) {
      console.error("Error al vaciar carrito:", error)
    }
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

