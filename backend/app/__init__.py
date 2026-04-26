# Aqui se inicializa la aplicación Flask y se configuran las rutas y CORS

#CORS permite hacer solicitudes entre dominios
#Sin CORS no se podrían hacer solicitudes desde el frontend al backend si están en dominios diferentes
from flask import Flask
from flask_cors import CORS
from .routes import routes

# Esta función crea y configura la aplicación Flask, habilitando CORS y registrando las rutas definidas en el módulo routes
def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(routes)

    return app