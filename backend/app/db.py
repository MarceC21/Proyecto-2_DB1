# Aquí es la Conexión a la base de datos en PostgreSQL 

# La libreria psycopg2 es un adaptador de base de datos PostgreSQL para el lenguaje de programación Python
import psycopg2
import os
import time

# Esta función establece una conexión a la base de datos utilizando las variables de entorno para obtener los detalles de conexión
# Como a veces PostgreSQL puede tardar, se pone un retry para intentar conectarse varias veces antes de fallar definitivamente

def get_connection():
    for i in range(5):
        try:
            return psycopg2.connect(
                host=os.getenv("DB_HOST"),
                database=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD")
            )
        except:
            print("Reintentando conexión a DB...")
            time.sleep(2)
    raise Exception("No se pudo conectar a la DB")