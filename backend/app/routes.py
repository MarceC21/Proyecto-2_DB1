# Aqui estaran todas las rutas necesarias 
from flask import Blueprint, jsonify


#Este es de prueba, luego se eliminara y se crearan las rutas necesarias para el proyecto
routes = Blueprint("routes", __name__)

@routes.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Hola desde Flask API"})