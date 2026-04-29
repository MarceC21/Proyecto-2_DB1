// Aqui es donde se haran todas las llamadas a la API

const BASE_URL = "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error en el servidor");
  return data;
}

// Para Productos
export const getProductosDetalle    = () => request("/productos-detalle");
export const getProductosBajoStock  = () => request("/productos/bajo-stock");
export const getTop5Productos       = () => request("/productos/top-5");
export const getVentasPorProducto   = () => request("/ventas/por-producto");

// Para Clientes
export const getClientes            = () => request("/clientes");
export const getClientesActivos     = () => request("/clientes/activos");
export const getHistorialCliente    = (id) => request(`/cliente/${id}/historial`);

// Para Ventas 
export const getResumenVentas       = () => request("/ventas/resumen");
export const getVentasDetalles      = () => request("/ventas/detalles");
export const getDetalleVenta        = (id) => request(`/venta/${id}/detalle`);
export const crearVenta             = (body) =>
  request("/ventas", { method: "POST", body: JSON.stringify(body) });

// Para Compras
export const getComprasDetalles     = () => request("/compras/detalles");

// CRUD Productos
export const getProductos           = () => request("/productos");
export const crearProducto          = (body) =>
  request("/productos", { method: "POST", body: JSON.stringify(body) });
export const actualizarProducto     = (id, body) =>
  request(`/productos/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const eliminarProducto       = (id) =>
  request(`/productos/${id}`, { method: "DELETE" });

// CRUD Ventas
export const actualizarVenta        = (id, body) =>
  request(`/ventas/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const eliminarVenta          = (id) =>
  request(`/ventas/${id}`, { method: "DELETE" });