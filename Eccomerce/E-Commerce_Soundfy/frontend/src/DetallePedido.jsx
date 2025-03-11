"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "./DetallePedido.css"
import { pedidoServicio } from "./servicios/PedidoServicio"

function DetallePedido() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const cargarPedido = async () => {
      try {
        const data = await pedidoServicio.obtenerPedidoPorId(id)
        setPedido(data)
      } catch (err) {
        setError("No se pudo cargar el detalle del pedido")
      } finally {
        setLoading(false)
      }
    }

    cargarPedido()
  }, [id])

  if (loading) {
    return <div className="loading">Cargando detalles del pedido...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!pedido) {
    return (
      <div className="not-found">
        <h2>Pedido No Encontrado</h2>
        <p>Lo sentimos, el pedido que estás buscando no existe.</p>
        <Link to="/pedidos" className="btn">
          Ver Mis Pedidos
        </Link>
      </div>
    )
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <Link to="/pedidos" className="back-link">
          &larr; Volver a Mis Pedidos
        </Link>
        <h1>Detalles del Pedido #{pedido.numero}</h1>
      </div>

      <div className="order-detail-grid">
        <div className="order-detail-main">
          <div className="order-detail-card">
            <div className="order-detail-section">
              <h2>Artículos</h2>
              <div className="order-items-list">
                {pedido.items.map((item) => (
                  <div key={item.id} className="order-detail-item">
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
                    <div className="item-price">${item.price.toFixed(2)}</div>
                    <div className="item-quantity">x{item.quantity}</div>
                    <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-detail-section">
              <h2>Seguimiento</h2>
              <div className="order-timeline">
                <div
                  className={`timeline-step ${pedido.estado === "Pendiente" || pedido.estado === "Pagado" || pedido.estado === "Enviado" || pedido.estado === "Entregado" ? "active" : ""}`}
                >
                  <div className="step-icon">1</div>
                  <div className="step-content">
                    <div className="step-title">Pedido Recibido</div>
                    <div className="step-date">{new Date(pedido.fecha).toLocaleDateString()}</div>
                  </div>
                </div>

                <div
                  className={`timeline-step ${pedido.estado === "Pagado" || pedido.estado === "Enviado" || pedido.estado === "Entregado" ? "active" : ""}`}
                >
                  <div className="step-icon">2</div>
                  <div className="step-content">
                    <div className="step-title">Pago Confirmado</div>
                    <div className="step-date">
                      {pedido.fechaPago ? new Date(pedido.fechaPago).toLocaleDateString() : "Pendiente"}
                    </div>
                  </div>
                </div>

                <div
                  className={`timeline-step ${pedido.estado === "Enviado" || pedido.estado === "Entregado" ? "active" : ""}`}
                >
                  <div className="step-icon">3</div>
                  <div className="step-content">
                    <div className="step-title">Pedido Enviado</div>
                    <div className="step-date">
                      {pedido.fechaEnvio ? new Date(pedido.fechaEnvio).toLocaleDateString() : "Pendiente"}
                    </div>
                  </div>
                </div>

                <div className={`timeline-step ${pedido.estado === "Entregado" ? "active" : ""}`}>
                  <div className="step-icon">4</div>
                  <div className="step-content">
                    <div className="step-title">Pedido Entregado</div>
                    <div className="step-date">
                      {pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString() : "Pendiente"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-detail-sidebar">
          <div className="order-detail-card">
            <div className="order-detail-section">
              <h2>Resumen</h2>
              <div className="order-summary">
                <div className="summary-row">
                  <span>Estado:</span>
                  <span className={`status-badge status-${pedido.estado.toLowerCase()}`}>{pedido.estado}</span>
                </div>
                <div className="summary-row">
                  <span>Fecha del Pedido:</span>
                  <span>{new Date(pedido.fecha).toLocaleDateString()}</span>
                </div>
                <div className="summary-row">
                  <span>Número de Pedido:</span>
                  <span>#{pedido.numero}</span>
                </div>
                <div className="summary-row">
                  <span>Método de Pago:</span>
                  <span>{pedido.metodoPago}</span>
                </div>
              </div>
            </div>

            <div className="order-detail-section">
              <h2>Dirección de Envío</h2>
              <div className="shipping-address">
                <p>{pedido.direccionEnvio.nombre}</p>
                <p>{pedido.direccionEnvio.direccion}</p>
                <p>
                  {pedido.direccionEnvio.ciudad}, {pedido.direccionEnvio.codigoPostal}
                </p>
                <p>{pedido.direccionEnvio.pais}</p>
              </div>
            </div>

            <div className="order-detail-section">
              <h2>Resumen de Pago</h2>
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${pedido.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span>${pedido.costoEnvio.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Impuestos:</span>
                  <span>${pedido.impuestos.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${pedido.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="order-actions">
              {pedido.estado === "Pendiente" && <button className="btn btn-secondary">Cancelar Pedido</button>}
              <button className="btn">Contactar Soporte</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetallePedido

