import { useEffect, useState, useCallback } from "react";
import {
  getResumenVentas,
  getVentasDetalles,
  getDetalleVenta,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
} from "../services/api";

import { getProductos } from "../services/api";

// Hook
function useFetch(fn) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    fn()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [fn]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}

// CRUD de ventas 
const EMPTY_VENTA = { id_cliente: "", id_empleado: "", total: "" };

function CrudVentas() {
  const { data, loading, error, reload } = useFetch(getResumenVentas);
  const [form, setForm] = useState(EMPTY_VENTA);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgError, setMsgError] = useState("");

  const limpiar = () => {
    setForm(EMPTY_VENTA);
    setEditId(null);
    setMsg("");
    setMsgError("");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setMsg("");
    setMsgError("");

    // VALIDACIONES
    if (!editId) {
      setMsgError("Selecciona una venta para editar");
      return;
    }

    if (!form.id_cliente || !form.id_empleado || !form.total) {
      setMsgError("Todos los campos son obligatorios");
      return;
    }

    if (Number(form.total) <= 0) {
      setMsgError("El total debe ser mayor a 0");
      return;
    }

    try {
      await actualizarVenta(editId, {
        id_cliente: Number(form.id_cliente),
        id_empleado: Number(form.id_empleado),
        total: Number(form.total),
      });

      setMsg("Venta actualizada correctamente.");
      limpiar();
      reload();
    } catch (e) {
      const msgLower = e.message.toLowerCase();

      if (msgLower.includes("foreign key")) {
        setMsgError("Cliente o empleado inválido.");
      } else if (msgLower.includes("not found")) {
        setMsgError("La venta no existe.");
      } else {
        setMsgError(e.message);
      }
    }
  };

  const handleEdit = (v) => {
    setEditId(v.id_venta);

    
    setForm({
      id_cliente: "",
      id_empleado: "",
      total: v.total,
    });

    setMsg("");
    setMsgError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar venta " + id + " y sus detalles?")) return;

    setMsg("");
    setMsgError("");

    try {
      await eliminarVenta(id);
      setMsg("Venta eliminada correctamente.");
      reload();
    } catch (e) {
      const msgLower = e.message.toLowerCase();

      if (msgLower.includes("not found")) {
        setMsgError("La venta no existe.");
      } else {
        setMsgError(e.message);
      }
    }
  };

  return (
    <div>
      <h2>CRUD — Ventas</h2>

      <div>
        {editId ? (
          <>
            <input
              name="id_cliente"
              placeholder="ID Cliente"
              type="number"
              value={form.id_cliente}
              onChange={handleChange}
            />
            <input
              name="id_empleado"
              placeholder="ID Empleado"
              type="number"
              value={form.id_empleado}
              onChange={handleChange}
            />
            <input
              name="total"
              placeholder="Total"
              type="number"
              value={form.total}
              onChange={handleChange}
            />

            <button onClick={handleSubmit}>Actualizar</button>
            <button onClick={limpiar}>Cancelar</button>
          </>
        ) : (
          <p>Selecciona una venta para editar</p>
        )}
      </div>

      {/* MENSAJES */}
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {msgError && <p style={{ color: "red" }}>Error: {msgError}</p>}

      {/* TABLA */}
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Total</th>
              <th>Acciones</th>
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
                <td>
                  <button onClick={() => handleEdit(v)}>Editar</button>
                  <button onClick={() => handleDelete(v.id_venta)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

//Consultas de solo lectura
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

// Formulario para crear una venta (transacción)
function FormularioVenta() {
  const [cliente, setCliente] = useState("");
  const [empleado, setEmpleado] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");

  const [productos, setProductos] = useState([]);
  const [precio, setPrecio] = useState(0);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);

  // Cargar productos
  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(() => setError("Error cargando productos"));
  }, []);

  // Obtener precio automáticamente
  useEffect(() => {
    const p = productos.find((p) => p.id_producto === Number(producto));
    if (p) {
      setPrecio(p.precio_producto);
    } else {
      setPrecio(0);
    }
  }, [producto, productos]);

  const enviar = async () => {
    setMensaje("");
    setError(null);

    // VALIDACIONES
    if (!cliente || !empleado || !producto || !cantidad) {
      setError("Completa todos los campos");
      return;
    }

    if (Number(cantidad) <= 0) {
      setError("Cantidad inválida");
      return;
    }

    // Validar producto existente
    if (precio === 0) {
      setError("El producto no existe");
      return;
    }

    const total = precio * Number(cantidad);

    const body = {
      id_cliente: Number(cliente),
      id_empleado: Number(empleado),
      total,
      productos: [
        {
          id_producto: Number(producto),
          cantidad: Number(cantidad),
          precio_unitario: precio,
        },
      ],
    };

    try {
      const res = await crearVenta(body);
      setMensaje("Venta creada correctamente ID: " + res.id_venta);

      // limpiar
      setCliente("");
      setEmpleado("");
      setProducto("");
      setCantidad("");

    } catch (e) {
      const msg = e.message.toLowerCase();

      if (msg.includes("stock")) {
        setError("Stock insuficiente");
      } else if (msg.includes("foreign key")) {
        setError("Cliente o empleado no existe");
      } else {
        setError("Error al crear la venta");
      }
    }
  };

  return (
    <div>
      <h2>Crear venta (TRANSACCIÓN)</h2>
      <input
        type="number"
        placeholder="ID Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      <input
        type="number"
        placeholder="ID Empleado"
        value={empleado}
        onChange={(e) => setEmpleado(e.target.value)}
      />

      <input
        type="number"
        placeholder="ID Producto"
        value={producto}
        onChange={(e) => setProducto(e.target.value)}
      />

      <input
        type="number"
        placeholder="Cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
      />

      {/* INFO AUTOMÁTICA */}
      <p>Precio unitario: Q{precio}</p>
      <p>Total: Q{precio * (cantidad || 0)}</p>

      <button onClick={enviar}>Crear venta</button>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}

// Página principal
export default function Ventas() {
  return (
    <div>
      <h1>Ventas</h1>
      <CrudVentas />
      <hr />
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