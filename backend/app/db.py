# Aquí es la Conexión a la base de datos en PostgreSQL 

# La libreria psycopg2 es un adaptador de base de datos PostgreSQL para el lenguaje de programación Python
import psycopg2
import os

# Esta función establece una conexión a la base de datos utilizando las variables de entorno para obtener los detalles de conexión
def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )