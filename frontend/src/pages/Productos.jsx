// Está página maneja todo lo relacionado a productos
import { useEffect, useState } from "react";
import {
  getProductosDetalle,
  getProductosBajoStock,
  getTop5Productos,
  getVentasPorProducto,
} from "../services/api";

// Hook para fetching de datos con manejo de loading y error
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

// Tabla que muestras todos los productos con su categoría y proveedor (JOIN)
function TablaProductos() {
  const { data, loading, error } = useFetch(getProductosDetalle);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Productos con categoría y proveedor (JOIN)</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Proveedor</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5">No hay datos</td>
            </tr>
          ) : (
            data.map((p) => (
              <tr key={p.producto}>
                <td>{p.producto}</td>
                <td>Q{Number(p.precio).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.categoria}</td>
                <td>{p.proveedor}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Subquery para mostrar productos con stock bajo el promedio
function ProductosBajoStock() {
  const { data, loading, error } = useFetch(getProductosBajoStock);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Productos con stock bajo el promedio (SUBQUERY)</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="2">No hay datos</td>
            </tr>
          ) : (
            data.map((p) => (
              <tr key={p.producto}>
                <td>{p.producto}</td>
                <td>{p.stock}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Tabla con los 5 productos más vendidos S
function Top5Productos() {
  const { data, loading, error } = useFetch(getTop5Productos);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Top 5 productos más vendidos (CTE)</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Unidades vendidas</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3">No hay datos</td>
            </tr>
          ) : (
            data.map((p, i) => (
              <tr key={p.producto}>
                <td>{i + 1}</td>
                <td>{p.producto}</td>
                <td>{p.total_vendido}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Ventas por producto usando GROUP BY
function VentasPorProducto() {
  const { data, loading, error } = useFetch(getVentasPorProducto);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Unidades vendidas por producto (GROUP BY)</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Total vendido</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="2">No hay datos</td>
            </tr>
          ) : (
            data.map((p) => (
              <tr key={p.producto}>
                <td>{p.producto}</td>
                <td>{p.total_vendido}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Página principal
export default function Productos() {
  return (
    <div>
      <h1>Productos</h1>

      <TablaProductos />
      <hr />

      <ProductosBajoStock />
      <hr />

      <Top5Productos />
      <hr />

      <VentasPorProducto />
    </div>
  );
}