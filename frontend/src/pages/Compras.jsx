// Edta página solo muestra un reporte de las compras relizadas
//Usando view 

import { useEffect, useState } from "react";
import { getComprasDetalles } from "../services/api";

// Hook reutilizable (igual que en otras páginas)
function useFetch(fn) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    fn()
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((e) => {
        if (isMounted) setError(e.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [fn]);

  return { data, loading, error };
}

// La table de compras 
function TablaCompras() {
  const { data, loading, error } = useFetch(getComprasDetalles);

  if (loading) return <p>Cargando compras...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Detalle de compras</h2>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID Compra</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Costo unitario</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7">No hay datos</td>
            </tr>
          ) : (
            data.map((c) => (
              <tr key={c.id_compra}>
                <td>{c.id_compra}</td>
                <td>{c.fecha}</td>
                <td>{c.proveedor}</td>
                <td>{c.producto}</td>
                <td>{c.cantidad}</td>
                <td>Q{Number(c.costo).toFixed(2)}</td>
                <td>Q{Number(c.total).toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Página principal
export default function Compras() {
  return (
    <div>
      <h1>Compras</h1>
      <TablaCompras />
    </div>
  );
}