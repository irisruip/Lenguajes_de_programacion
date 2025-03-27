"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "./DetallePedido.css"
import { pedidoServicio } from "./servicios/PedidoServicio"
import productos from "./productos.json"
import axios from "axios"

function DetallePedido() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const cargarPedido = async () => {
      try {
        const response = await axios.get(`/api/orders/get_order/${id}/`)
        const pedidosData = response.data

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

        setPedido(pedidosConItems)
      }
      catch (err) {
        console.log(err)
        setError("No se pudo cargar la información del pedido")
      }
      finally {
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

  const {
    numero,
    estado,
    fecha,
    total,
    subtotal,
    impuestos,
    costo_envio,
    direccion_envio,
    metodo_pago,
    pais_envio,
    codigo_postal_envio,
    ciudad_envio,
    fecha_envio,
    items,
  } = pedido[0]
  console.log(pedido)

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <Link to="/pedidos" className="back-link">
          &larr; Volver a Mis Pedidos
        </Link>
        <h1>Detalles del Pedido #{numero}</h1>
      </div>

      <div className="order-detail-grid">
        <div className="order-detail-main">
          <div className="order-detail-card">
            <div className="order-detail-section">
              <h2>Artículos</h2>
              <div className="order-items-list">
                {items.map((item) => (
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
                    <div className="item-quantity">x{item.cantidad}</div>
                    <div className="item-total">${(item.price * item.cantidad).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-detail-section">
              <h2>Seguimiento</h2>
              <div className="order-timeline">
                <div
                  className={`timeline-step ${estado === "Pendiente" || estado === "Enviado" || estado === "Entregado" ? "active" : ""}`}
                >
                  <div className="step-icon">1</div>
                  <div className="step-content">
                    <div className="step-title">Pedido Recibido</div>
                    <div className="step-date">{new Date(fecha).toLocaleDateString()}</div>
                  </div>
                </div>

                <div
                  className={`timeline-step ${estado === "Enviado" || estado === "Entregado" ? "active" : ""}`}
                >
                  <div className="step-icon">2</div>
                  <div className="step-content">
                    <div className="step-title">Pago Confirmado</div>
                    <div className="step-date">
                      {fecha ? new Date(fecha).toLocaleDateString() : "Pendiente"}
                    </div>
                  </div>
                </div>

                <div
                  className={`timeline-step ${estado === "Enviado" || estado === "Entregado" ? "active" : ""}`}
                >
                  <div className="step-icon">3</div>
                  <div className="step-content">
                    <div className="step-title">Pedido Enviado</div>
                    <div className="step-date">
                      {fecha_envio ? new Date(fecha_envio).toLocaleDateString() : "Pendiente"}
                    </div>
                  </div>
                </div>

                <div className={`timeline-step ${estado === "Entregado" ? "active" : ""}`}>
                  <div className="step-icon">4</div>
                  <div className="step-content">
                    <div className="step-title">Pedido Entregado</div>
                    <div className="step-date">
                      {fecha ? new Date(fecha).toLocaleDateString() : "Pendiente"}
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
                  <span className={`status-badge status-${estado.toLowerCase()}`}>{estado}</span>
                </div>
                <div className="summary-row">
                  <span>Fecha del Pedido:</span>
                  <span>{new Date(fecha).toLocaleDateString()}</span>
                </div>
                <div className="summary-row">
                  <span>Número de Pedido:</span>
                  <span>#{numero}</span>
                </div>
                <div className="summary-row">
                  <span>Método de Pago:</span>
                  <span>{metodo_pago}</span>
                </div>
              </div>
            </div>

            <div className="order-detail-section">
              <h2>Dirección de Envío</h2>
              <div className="shipping-address">
                <p>{direccion_envio}</p>

                <p>
                  {ciudad_envio}, {codigo_postal_envio}
                </p>
                <p>{pais_envio}</p>
              </div>
            </div>

            <div className="order-detail-section">
              <h2>Resumen de Pago</h2>
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span>${Number(costo_envio).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Impuestos:</span>
                  <span>${Number(impuestos).toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${Number(total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetallePedido

