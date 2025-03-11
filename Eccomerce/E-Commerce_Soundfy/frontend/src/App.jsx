import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Header from "./Header"
import Footer from "./Footer"
import Inicio from "./Inicio"
import Explorar from "./Explorar"
import DetalleAlbum from "./DetalleAlbum"
import Carrito from "./Carrito"
import { CarritoProvider } from "./CarritoContext"
import Login from "./Login"
import Registro from "./Registro"
import Perfil from "./Perfil"
import Pedidos from "./Pedidos"
import DetallePedido from "./DetallePedido"

function App() {
  return (
    <CarritoProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/explorar" element={<Explorar />} />
              <Route path="/album/:id" element={<DetalleAlbum />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/perfil/:id" element={<Perfil />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/pedidos/:id" element={<DetallePedido />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CarritoProvider>
  )
}

export default App

