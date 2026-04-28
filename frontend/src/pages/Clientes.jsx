// Aqui se maneja todo lo relacionado a los clientes
import { useEffect, useState } from "react";
import { getClientes, getClientesActivos, getHistorialCliente } from "../services/api";

// Lo del fecth
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

// Lista de todos los clientes con el total de compras (GROUP BY)
function ListaClientes() {
  const { data, loading, error } = useFetch(getClientes);

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Clientes con total de compras (GROUP BY)</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Total compras</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="2">No hay datos</td>
            </tr>
          ) : (
            data.map((c) => (
              <tr key={c.cliente}>
                <td>{c.cliente}</td>
                <td>{c.total_compras}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// SUBQUERY para mostrar solo clientes que han hecho al menos una compra
function ClientesActivos() {
  const { data, loading, error } = useFetch(getClientesActivos);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Clientes con al menos una compra (SUBQUERY - EXISTS)</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Cliente</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td>No hay datos</td>
            </tr>
          ) : (
            data.map((c) => (
              <tr key={c.nombre_cliente}>
                <td>{c.nombre_cliente}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Aqui es para buscar un cliente por su ID y asi muestra su historial de compras (JOIN)
function HistorialCliente() {
  const [id, setId] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const buscar = async () => {
    setError(null);
    setData([]);

    if (!id) {
      setError("Ingresa un ID de cliente");
      return;
    }

    try {
      const res = await getHistorialCliente(id);
      setData(res);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h2>Historial de compras por cliente</h2>

      <input
        type="number"
        placeholder="ID cliente"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={buscar}>Buscar</button>

      {error && <p>Error: {error}</p>}

      {data.length > 0 && (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Venta</th>
              <th>Fecha</th>
              <th>Empleado</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{d.id_venta}</td>
                <td>{d.fecha}</td>
                <td>{d.empleado}</td>
                <td>{d.producto}</td>
                <td>{d.cantidad}</td>
                <td>Q{d.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Página principal
export default function Clientes() {
  return (
    <div>
      <h1>Clientes</h1>

      <ListaClientes />
      <hr />

      <ClientesActivos />
      <hr />

      <HistorialCliente />
    </div>
  );
}
