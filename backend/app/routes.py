# Aqui estaran todas las rutas necesarias 
from flask import Blueprint, jsonify, request
from .db import get_connection

routes = Blueprint("routes", __name__)

# LOS JOINS
# Productos con categoría y proveedor
@routes.route("/productos-detalle", methods=["GET"])
def productos_con_detalle():
    """Productos con categoría y proveedor"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT
            p.nombre_producto AS producto, 
            p.precio_producto,
            p.stock,
            c.nombre_categoria AS categoria,
            pro.nombre_proveedor AS proveedor
        FROM producto p
        INNER JOIN categoria c ON c.id_categoria = p.id_categoria
        INNER JOIN proveedor pro ON pro.id_proveedor = p.id_proveedor
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        productos = []
        for row in rows:
            productos.append({
                "producto": row[0],
                "precio": float(row[1]),
                "stock": row[2],
                "categoria": row[3],
                "proveedor": row[4]
            })

        return jsonify(productos)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Todo el detalle completo de una venta específica 
@routes.route("/venta/<int:id_venta>/detalle", methods=["GET"])
def detalle_venta(id_venta):
    """Detalle completo de una venta específica"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT
            v.id_venta,
            v.fecha, 
            c.nombre_cliente AS cliente,
            e.nombre_empleado AS empleado,
            p.nombre_producto AS producto, 
            d.cantidad, 
            d.precio_unitario,
            v.total
        FROM venta v
        INNER JOIN cliente c ON c.id_cliente = v.id_cliente
        INNER JOIN empleado e ON e.id_empleado = v.id_empleado
        INNER JOIN detalle_venta d ON d.id_venta = v.id_venta
        INNER JOIN producto p ON p.id_producto = d.id_producto
        WHERE v.id_venta = %s
        """
        
        cur.execute(query, (id_venta,))
        rows = cur.fetchall()
        cur.close()
        conn.close()

        if not rows:
            return jsonify({"error": "Venta no encontrada"}), 404

        detalles = []
        for row in rows:
            detalles.append({
                "id_venta": row[0],
                "fecha": str(row[1]),
                "cliente": row[2],
                "empleado": row[3],
                "producto": row[4],
                "cantidad": row[5],
                "precio_unitario": float(row[6]),
                "total": float(row[7])
            })

        return jsonify(detalles)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Para ver el historial de compras de un cliente en específico
@routes.route("/cliente/<int:id_cliente>/historial", methods=["GET"])
def historial_cliente(id_cliente):
    """Historial de compras de un cliente"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT 
            c.nombre_cliente AS cliente,
            v.id_venta,
            v.fecha,
            e.nombre_empleado AS empleado,
            p.nombre_producto AS producto,
            d.cantidad,
            v.total
        FROM venta v
        INNER JOIN cliente c ON c.id_cliente = v.id_cliente
        INNER JOIN empleado e ON e.id_empleado = v.id_empleado
        INNER JOIN detalle_venta d ON d.id_venta = v.id_venta
        INNER JOIN producto p ON p.id_producto = d.id_producto
        WHERE v.id_cliente = %s
        ORDER BY v.fecha DESC
        """
        
        cur.execute(query, (id_cliente,))
        rows = cur.fetchall()
        cur.close()
        conn.close()

        if not rows:
            return jsonify({"error": "Cliente no encontrado o sin compras"}), 404

        historial = []
        for row in rows:
            historial.append({
                "cliente": row[0],
                "id_venta": row[1],
                "fecha": str(row[2]),
                "empleado": row[3],
                "producto": row[4],
                "cantidad": row[5],
                "total": float(row[6])
            })

        return jsonify(historial)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# AQUI ESTAN LAS SUBQUERIES


# Productos con stock menor al promedio (SI HAY)
@routes.route("/productos/bajo-stock", methods=["GET"])
def productos_bajo_stock():
    """Productos con stock menor al promedio"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT 
            p.nombre_producto AS producto,
            p.stock
        FROM producto p
        WHERE p.stock < (SELECT AVG(stock) FROM producto)
        ORDER BY p.stock ASC
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        productos = []
        for row in rows:
            productos.append({
                "producto": row[0],
                "stock": row[1]
            })

        return jsonify(productos)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Clientes que han realizado compras (DEBEN APARECER TODOS LOS CLIENTES)
@routes.route("/clientes/activos", methods=["GET"])
def clientes_activos():
    """Clientes que han realizado compras"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT DISTINCT nombre_cliente
        FROM cliente c
        WHERE EXISTS (
            SELECT 1
            FROM venta v
            WHERE v.id_cliente = c.id_cliente
        )
        ORDER BY nombre_cliente
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        clientes = []
        for row in rows:
            clientes.append({"nombre_cliente": row[0]})

        return jsonify(clientes)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Para ver productos que nunca se han vendido (SI HAY)
@routes.route("/productos/no-vendidos", methods=["GET"])
def productos_no_vendidos():
    """Productos que nunca se han vendido"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT nombre_producto
        FROM producto p
        WHERE NOT EXISTS (
            SELECT 1
            FROM detalle_venta d
            WHERE d.id_producto = p.id_producto
        )
        ORDER BY nombre_producto
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        productos = []
        for row in rows:
            productos.append({"nombre_producto": row[0]})

        return jsonify(productos)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# EStas son las consultas con GROUP BY + HAVING 

# Ventas totales por producto (sin filtrar por cantidad, solo el total vendido)
@routes.route("/ventas/por-producto", methods=["GET"])
def ventas_por_producto():
    """Ventas totales por producto"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT
            p.nombre_producto AS producto, 
            SUM(d.cantidad) AS total_vendido
        FROM detalle_venta d
        INNER JOIN producto p ON p.id_producto = d.id_producto
        GROUP BY p.nombre_producto
        ORDER BY total_vendido DESC
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        ventas = []
        for row in rows:
            ventas.append({
                "producto": row[0],
                "total_vendido": row[1]
            })

        return jsonify(ventas)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Productos que han vendido más de 10 unidades en total 

@routes.route("/productos/mas-vendidos", methods=["GET"])
def productos_mas_vendidos():
    """Productos más vendidos (cantidad > 10)"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT
            p.nombre_producto AS producto, 
            SUM(d.cantidad) AS total_vendido
        FROM detalle_venta d
        INNER JOIN producto p ON p.id_producto = d.id_producto
        GROUP BY p.nombre_producto
        HAVING SUM(d.cantidad) > 10
        ORDER BY total_vendido DESC
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        productos = []
        for row in rows:
            productos.append({
                "producto": row[0],
                "total_vendido": row[1]
            })

        return jsonify(productos)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

