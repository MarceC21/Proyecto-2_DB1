# Aqui estaran todas las rutas necesarias 
from flask import Blueprint, jsonify
from .db import get_connection

routes = Blueprint("routes", __name__)

#Este es de prueba, luego se eliminara y se crearan las rutas necesarias para el proyecto
@routes.route("/productos", methods=["GET"])
def get_productos():
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT id_producto, nombre_producto, precio_producto FROM producto;")
        rows = cur.fetchall()

        cur.close()
        conn.close()

        # convertir a JSON bonito
        productos = []
        for row in rows:
            productos.append({
                "id": row[0],
                "nombre": row[1],
                "precio": float(row[2])
            })

        return jsonify(productos)

    except Exception as e:
        return jsonify({"error": str(e)}), 500