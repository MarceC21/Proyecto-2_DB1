// Este es el componente del navbar, que se va a mostrar en todas las páginas
// para evitar hacerlo otra vez
import React from "react";
import { Link } from "react-router-dom";


// Para navegar en las páginas de ventas, productos, clientes y compras
function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Tienda</h2>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Ventas</Link>
        <Link to="/productos" style={styles.link}>Productos</Link>
        <Link to="/clientes" style={styles.link}>Clientes</Link>
        <Link to="/compras" style={styles.link}>Compras</Link>
      </div>
    </nav>
  );
}


// Para el estilo 

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
  },
  logo: {
    color: "white",
  },
  links: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Navbar;