# Aqui estaran todas las rutas necesarias 
from flask import Blueprint, jsonify, request
from .db import get_connection

# 
routes = Blueprint("routes", __name__)

# JOINS

# Productos con categoría y proveedor
@routes.route("/productos-detalle", methods=["GET"])
def productos_con_detalle():
    """Productos con categoría y proveedor"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT
            p.nombre_producto, 
            p.precio_producto,
            p.stock,
            c.nombre_categoria,
            pro.nombre_proveedor
        FROM producto p
        INNER JOIN categoria c ON c.id_categoria = p.id_categoria
        INNER JOIN proveedor pro ON pro.id_proveedor = p.id_proveedor
        """

        cur.execute(query)
        rows = cur.fetchall()

        productos = [{
            "producto": r[0],
            "precio": float(r[1]),
            "stock": r[2],
            "categoria": r[3],
            "proveedor": r[4]
        } for r in rows]

        return jsonify(productos)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()


#Todas la ventas con detalle
@routes.route("/ventas/detalles", methods=["GET"])
def ventas_detalles():
    """Todas las ventas con detalle"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
        SELECT
            v.id_venta,
            v.fecha,
            c.nombre_cliente,
            e.nombre_empleado,
            p.nombre_producto,
            d.cantidad,
            d.precio_unitario,
            v.total
        FROM venta v
        JOIN cliente c ON c.id_cliente = v.id_cliente
        JOIN empleado e ON e.id_empleado = v.id_empleado
        JOIN detalle_venta d ON d.id_venta = v.id_venta
        JOIN producto p ON p.id_producto = d.id_producto
        ORDER BY v.fecha DESC
        """)

        rows = cur.fetchall()

        return jsonify([{
            "id_venta": r[0],
            "fecha": str(r[1]),
            "cliente": r[2],
            "empleado": r[3],
            "producto": r[4],
            "cantidad": r[5],
            "precio": float(r[6]),
            "total": float(r[7])
        } for r in rows])

    finally:
        cur.close()
        conn.close()

# Detalle completo de una venta específica
@routes.route("/venta/<int:id_venta>/detalle", methods=["GET"])
def detalle_venta(id_venta):
    """Detalle completo de una venta"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT
            v.id_venta,
            v.fecha, 
            c.nombre_cliente,
            e.nombre_empleado,
            p.nombre_producto, 
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

        if not rows:
            return jsonify({"error": "Venta no encontrada"}), 404

        return jsonify([{
            "id_venta": r[0],
            "fecha": str(r[1]),
            "cliente": r[2],
            "empleado": r[3],
            "producto": r[4],
            "cantidad": r[5],
            "precio_unitario": float(r[6]),
            "total": float(r[7])
        } for r in rows])

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()


# Clientes con cantidad de compras
@routes.route("/clientes", methods=["GET"])
def lista_clientes():
    """Lista de clientes con cantidad de compras"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
        SELECT c.nombre_cliente, COUNT(v.id_venta) AS total_compras
        FROM cliente c
        LEFT JOIN venta v ON v.id_cliente = c.id_cliente
        GROUP BY c.nombre_cliente
        ORDER BY total_compras DESC
        """)

        rows = cur.fetchall()

        return jsonify([{
            "cliente": r[0],
            "total_compras": r[1]
        } for r in rows])

    finally:
        cur.close()
        conn.close()
    
# Historial de compras de un cliente
@routes.route("/cliente/<int:id_cliente>/historial", methods=["GET"])
def historial_cliente(id_cliente):
    """Historial de compras de un cliente"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT 
            c.nombre_cliente,
            v.id_venta,
            v.fecha,
            e.nombre_empleado,
            p.nombre_producto,
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

        return jsonify([{
            "cliente": r[0],
            "id_venta": r[1],
            "fecha": str(r[2]),
            "empleado": r[3],
            "producto": r[4],
            "cantidad": r[5],
            "total": float(r[6])
        } for r in rows])

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()


# SUBQUERIES

# Productos con stock menor al promedio
@routes.route("/productos/bajo-stock", methods=["GET"])
def productos_bajo_stock():
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
        SELECT nombre_producto, stock
        FROM producto
        WHERE stock < (SELECT AVG(stock) FROM producto)
        ORDER BY stock ASC
        """)

        rows = cur.fetchall()

        return jsonify([{"producto": r[0], "stock": r[1]} for r in rows])

    finally:
        cur.close()
        conn.close()


# Clientes con al menos una compra
@routes.route("/clientes/activos", methods=["GET"])
def clientes_activos():
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
        SELECT nombre_cliente
        FROM cliente c
        WHERE EXISTS (
            SELECT 1 FROM venta v WHERE v.id_cliente = c.id_cliente
        )
        """)

        rows = cur.fetchall()

        return jsonify([{"nombre_cliente": r[0]} for r in rows])

    finally:
        cur.close()
        conn.close()


# GROUP BY

@routes.route("/ventas/por-producto", methods=["GET"])
def ventas_por_producto():
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
        SELECT p.nombre_producto, SUM(d.cantidad)
        FROM detalle_venta d
        INNER JOIN producto p ON p.id_producto = d.id_producto
        GROUP BY p.nombre_producto
        ORDER BY SUM(d.cantidad) DESC
        """)

        rows = cur.fetchall()

        return jsonify([{
            "producto": r[0],
            "total_vendido": float(r[1])
        } for r in rows])

    finally:
        cur.close()
        conn.close()


# CTE

@routes.route("/productos/top-5", methods=["GET"])
def top_5_productos():
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
        WITH ventas AS (
            SELECT p.nombre_producto, SUM(d.cantidad) total
            FROM detalle_venta d
            JOIN producto p ON p.id_producto = d.id_producto
            GROUP BY p.nombre_producto
        )
        SELECT * FROM ventas ORDER BY total DESC LIMIT 5
        """)

        rows = cur.fetchall()

        return jsonify([{
            "producto": r[0],
            "total_vendido": float(r[1])
        } for r in rows])

    finally:
        cur.close()
        conn.close()



# LAS VIEWS

# Resumen de ventas
@routes.route("/ventas/resumen", methods=["GET"])
def resumen_ventas():
    """Usando VIEW resumen_ventas"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM resumen_ventas ORDER BY fecha DESC")

        rows = cur.fetchall()

        return jsonify([{
            "id_venta": r[0],
            "fecha": str(r[1]),
            "cliente": r[2],
            "empleado": r[3],
            "total": float(r[4])
        } for r in rows])

    finally:
        cur.close()
        conn.close()

#Resumen de compras
@routes.route("/compras/detalles", methods=["GET"])
def compras_detalles():
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM detalle_compras ORDER BY fecha DESC")

        rows = cur.fetchall()

        return jsonify([{
            "id_compra": r[0],
            "fecha": str(r[1]),
            "proveedor": r[2],
            "producto": r[3],
            "cantidad": r[4],
            "costo": float(r[5]),
            "total": float(r[6])
        } for r in rows])

    finally:
        cur.close()
        conn.close()


# TRANSACCIÓN

@routes.route("/ventas", methods=["POST"])
def crear_venta():
    """
    Crear venta con transacción:
    - Inserta venta
    - Inserta detalles
    - Actualiza stock
    - Rollback si algo falla
    """
    try:
        data = request.json

        conn = get_connection()
        cur = conn.cursor()

        conn.autocommit = False 

        # 1. Crear venta
        cur.execute("""
        INSERT INTO venta (fecha, id_cliente, id_empleado, total)
        VALUES (CURRENT_DATE, %s, %s, %s)
        RETURNING id_venta
        """, (data["id_cliente"], data["id_empleado"], data["total"]))

        id_venta = cur.fetchone()[0]

        # 2. Procesar productos
        for item in data["productos"]:
            id_producto = item["id_producto"]
            cantidad = item["cantidad"]
            precio = item["precio_unitario"]

            # Verificar stock
            cur.execute("""
            UPDATE producto
            SET stock = stock - %s
            WHERE id_producto = %s AND stock >= %s
            """, (cantidad, id_producto, cantidad))

            if cur.rowcount == 0:
                conn.rollback()
                return jsonify({"error": f"Stock insuficiente para producto {id_producto}"}), 400

            # Insertar detalle
            cur.execute("""
            INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
            VALUES (%s, %s, %s, %s)
            """, (id_venta, id_producto, cantidad, precio))

        conn.commit()

        return jsonify({"mensaje": "Venta creada", "id_venta": id_venta})

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()