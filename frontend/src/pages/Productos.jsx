// Está página maneja todo lo relacionado a productos
import { useEffect, useState, useCallback } from "react";
import {
  getProductosDetalle,
  getProductosBajoStock,
  getTop5Productos,
  getVentasPorProducto,
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../services/api";



// Hook para fetching de datos con manejo de loading y error
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

//CRUD de productos
const EMPTY_FORM = { nombre_producto: "", precio_producto: "", stock: "", id_categoria: "", id_proveedor: "" };

function CrudProductos() {
  const { data, loading, error, reload } = useFetch(getProductos);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgError, setMsgError] = useState("");

  const limpiar = () => { setForm(EMPTY_FORM); setEditId(null); setMsg(""); setMsgError(""); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setMsg("");
    setMsgError("");

    // VALIDACIONES
    if (!form.nombre_producto || !form.precio_producto) {
      setMsgError("Nombre y precio son obligatorios");
      return;
    }

    if (Number(form.precio_producto) <= 0) {
      setMsgError("El precio debe ser mayor a 0");
      return;
    }

    if (form.id_categoria <= 0 || form.id_proveedor <= 0) {
      setMsgError("IDs de categoría y proveedor inválidos");
      return;
    }

    const body = {
      nombre_producto: form.nombre_producto,
      precio_producto: Number(form.precio_producto),
      stock: Number(form.stock),
      id_categoria: Number(form.id_categoria),
      id_proveedor: Number(form.id_proveedor),
    };

    try {
      if (editId) {
        await actualizarProducto(editId, body);
        setMsg("Producto actualizado.");
      } else {
        await crearProducto(body);
        setMsg("Producto creado.");
      }

      limpiar();
      reload();

    } catch (e) {
      const msg = e.message.toLowerCase();

      if (msg.includes("foreign key")) {
        setMsgError("Categoría o proveedor no existe");
      } else {
        setMsgError("Error al guardar el producto");
      }
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id_producto);
    setForm({
      nombre_producto: p.nombre_producto,
      precio_producto: p.precio_producto,
      stock: p.stock,
      id_categoria: p.id_categoria,
      id_proveedor: p.id_proveedor,
    });
    setMsg(""); setMsgError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto " + id + "?")) return;
    try {
      await eliminarProducto(id);
      setMsg("Producto eliminado.");
      setMsgError("");
      reload();
    } catch (e) {
      if (e.message.toLowerCase().includes("foreign key")) {
        setMsgError("No puedes eliminar este producto porque está en una venta");
      } else {
        setMsgError(e.message);
      }
    }
  };

  return (
    <div>
      <h2>CRUD — Productos</h2>

      {/* Formulario */}
      <div>
        <input name="nombre_producto" placeholder="Nombre" value={form.nombre_producto} onChange={handleChange} />
        <input name="precio_producto" placeholder="Precio" type="number" value={form.precio_producto} onChange={handleChange} />
        <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} />
        <input name="id_categoria" placeholder="ID Categoría" type="number" value={form.id_categoria} onChange={handleChange} />
        <input name="id_proveedor" placeholder="ID Proveedor" type="number" value={form.id_proveedor} onChange={handleChange} />
        <button onClick={handleSubmit}>{editId ? "Actualizar" : "Crear"}</button>
        {editId && <button onClick={limpiar}>Cancelar</button>}
      </div>

      {msg      && <p>{msg}</p>}
      {msgError && <p>Error: {msgError}</p>}

      {/* Tabla */}
      {loading && <p>Cargando...</p>}
      {error   && <p>Error: {error}</p>}
      {!loading && !error && (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th>
              <th>Cat.</th><th>Prov.</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id_producto}>
                <td>{p.id_producto}</td>
                <td>{p.nombre_producto}</td>
                <td>Q{Number(p.precio_producto).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.id_categoria}</td>
                <td>{p.id_proveedor}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Editar</button>
                  <button onClick={() => handleDelete(p.id_producto)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Consultas de solo lectura ─────────────────────────────────────
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
      <CrudProductos />
      <hr />
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