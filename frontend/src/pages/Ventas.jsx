import { useEffect, useState } from "react";
import {
  getResumenVentas,
  getVentasDetalles,
  getDetalleVenta,
  crearVenta,
} from "../services/api";

// Hook
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

    return () => (isMounted = false);
  }, [fn]);

  return { data, loading, error };
}

// VIEW
function ResumenVentas() {
  const { data, loading, error } = useFetch(getResumenVentas);

  if (loading) return <p>Cargando resumen...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Resumen de ventas (VIEW)</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Empleado</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v) => (
            <tr key={v.id_venta}>
              <td>{v.id_venta}</td>
              <td>{v.fecha}</td>
              <td>{v.cliente}</td>
              <td>{v.empleado}</td>
              <td>Q{v.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// JOIN
function VentasDetalles() {
  const { data, loading, error } = useFetch(getVentasDetalles);

  if (loading) return <p>Cargando ventas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Ventas con detalle (JOIN)</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Empleado</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v, i) => (
            <tr key={i}>
              <td>{v.id_venta}</td>
              <td>{v.fecha}</td>
              <td>{v.cliente}</td>
              <td>{v.empleado}</td>
              <td>{v.producto}</td>
              <td>{v.cantidad}</td>
              <td>Q{v.precio}</td>
              <td>Q{v.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Buscar venta
function BuscarVenta() {
  const [id, setId] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const buscar = async () => {
    setError(null);
    setData([]);

    if (!id) {
      setError("Ingresa un ID");
      return;
    }

    try {
      const res = await getDetalleVenta(id);
      setData(res);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h2>Detalle de una venta (JOIN con filtro)</h2>

      <input
        type="number"
        placeholder="ID venta"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={buscar}>Buscar</button>

      {error && <p>Error: {error}</p>}

      {data.length > 0 && (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{d.producto}</td>
                <td>{d.cantidad}</td>
                <td>Q{d.precio_unitario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 💥 TRANSACCIÓN
function FormularioVenta() {
  const [cliente, setCliente] = useState("");
  const [empleado, setEmpleado] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);

  const enviar = async () => {
    setMensaje("");
    setError(null);

    if (!cliente || !empleado || !producto || !cantidad || !precio) {
      setError("Completa todos los campos");
      return;
    }

    const body = {
      id_cliente: Number(cliente),
      id_empleado: Number(empleado),
      total: Number(precio) * Number(cantidad),
      productos: [
        {
          id_producto: Number(producto),
          cantidad: Number(cantidad),
          precio_unitario: Number(precio),
        },
      ],
    };

    try {
      const res = await crearVenta(body);
      setMensaje("Venta creada correctamente ID: " + res.id_venta);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h2>Crear venta (TRANSACCIÓN)</h2>

      <input placeholder="ID Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
      <input placeholder="ID Empleado" value={empleado} onChange={(e) => setEmpleado(e.target.value)} />
      <input placeholder="ID Producto" value={producto} onChange={(e) => setProducto(e.target.value)} />
      <input placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
      <input placeholder="Precio unitario" value={precio} onChange={(e) => setPrecio(e.target.value)} />

      <button onClick={enviar}>Crear venta</button>

      {mensaje && <p>{mensaje}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

// Página principal
export default function Ventas() {
  return (
    <div>
      <h1>Ventas</h1>

      <ResumenVentas />
      <hr />

      <VentasDetalles />
      <hr />

      <BuscarVenta />
      <hr />

      <FormularioVenta />
    </div>
  );
}