import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Productos from "./pages/Productos";
import Clientes from "./pages/Clientes";
import Ventas from "./pages/Ventas";
import Compras from "./pages/Compras";

// Esta página solo va a mostrar el navbar 
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/ventas" replace />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/compras" element={<Compras />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}