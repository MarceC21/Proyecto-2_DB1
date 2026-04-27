import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/productos")
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  return (
    <div>
      <h1>Productos</h1>
      <ul>
        {productos.map((p, i) => (
          <li key={i}>{p[1]}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;