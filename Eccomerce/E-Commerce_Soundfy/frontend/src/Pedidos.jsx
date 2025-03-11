"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Pedidos.css"
import { pedidoServicio } from "./servicios/PedidoServicio"

function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const data = await pedidoServicio.obtenerPedidosUsuario()
        setPedidos(data)
      } catch (err) {
        setError("No se pudieron cargar los pedidos")
      } finally {
        setLoading(false)
      }
    }

    cargarPedidos()
  }, [])

  if (loading) {
    return <div className="loading">Cargando pedidos...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (pedidos.length === 0) {
    return (
      <div className="orders-empty">
        <h1>Mis Pedidos</h1>
        <p>Aún no has realizado ningún pedido.</p>
        <Link to="/explorar" className="btn">
          Explorar Música
        </Link>
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
                  <div className="item-quantity">x{item.quantity}</div>
                </div>
              ))}

              {pedido.items.length > 3 && <div className="more-items">+ {pedido.items.length - 3} más</div>}
            </div>

            <div className="order-footer">
              <div className="order-total">
                Total: <span>${pedido.total.toFixed(2)}</span>
              </div>
              <Link to={`/pedidos/${pedido.id}`} className="btn btn-secondary">
                Ver Detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pedidos

