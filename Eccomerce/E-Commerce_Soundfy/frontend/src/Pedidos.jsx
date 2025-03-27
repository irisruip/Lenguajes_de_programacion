"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import productos from "./productos.json"
import axios from "axios"
import "./Pedidos.css"

function Pedidos() {
  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user?.id

  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const response = await axios.get(`/api/orders/get_orders/${userId}/`)
        const pedidosData = response.data
        console.log(typeof pedidosData)
        const pedidosConItems = await Promise.all(
          pedidosData.map(async (pedido) => {
            try {
              const itemsResponse = await axios.get(`/api/orders/get_order_items/${pedido.id}/`)
              const itemsConProductos = itemsResponse.data.map((item) => {
                const producto = productos.albums.find((p) => p.id === item.producto_id)
                return { ...item, ...producto }
              })
              return { ...pedido, items: itemsConProductos }
            } catch (error) {
              console.error(`Error al obtener los items del pedido ${pedido.id}:`, error)
              return { ...pedido, items: [] }
            }
          })
        )

        setPedidos(pedidosConItems)
      } catch (err) {

        setError("No se pudieron cargar los pedidos. Por favor, intenta nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    if (userId) cargarPedidos()
  }, [userId])

  if (loading) return <div className="loading">Cargando pedidos...</div>

  if (error) return <div className="error-message">{error}</div>
  console.log(pedidos.id)
  if (pedidos.length === 0) {
    return (
      <div className="orders-empty">
        <h1>Mis Pedidos</h1>
        <p>Aún no has realizado ningún pedido.</p>
        <Link to="/explorar" className="btn">Explorar Música</Link>
      </div>
    )
  }

  return (
    <div className="orders-container">
      <h1>Mis Pedidos</h1>

      <div className="orders-list">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <div className="order-number">Pedido #{pedido.numero}</div>
                <div className="order-date">{new Date(pedido.fecha).toLocaleDateString()}</div>
              </div>
              <div className="order-status">
                <span className={`status-badge status-${pedido.estado.toLowerCase()}`}>{pedido.estado}</span>
              </div>
            </div>

            <div className="order-items">
              {pedido.items.slice(0, 3).map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.cover || "/placeholder.svg"} alt={item.title} />
                  </div>
                  <div className="item-details">
                    <div className="item-title">{item.title}</div>
                    <div className="item-artist">{item.artist}</div>
                    <div className="item-format">
                      {item.format === "digital" ? "Digital" : item.format === "cd" ? "CD" : "Vinilo"}
                    </div>
                  </div>
                  <div className="item-quantity">x{item.cantidad}</div>
                </div>
              ))}
              {pedido.items.length > 3 && <div className="more-items">+ {pedido.items.length - 3} más</div>}
            </div>

            <div className="order-footer">
              <div className="order-total">Total: <span>${Number(pedido.total).toFixed(2)}</span></div>
              <Link to={`/pedidos/${pedido.id}`} className="btn btn-secondary">Ver Detalles</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pedidos
