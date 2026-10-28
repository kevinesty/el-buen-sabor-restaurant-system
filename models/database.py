import mysql.connector
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

def get_connection():
    try:
        print("HOST:", os.getenv("MYSQL_HOST"))
        print("USER:", os.getenv("MYSQL_USER"))
        print("DB:", os.getenv("MYSQL_DB"))
        print("PORT:", os.getenv("MYSQL_PORT"))

        conexion = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DB"),
            port=int(os.getenv("MYSQL_PORT"))
        )

        print("✅ Conexión exitosa")

        if conexion.is_connected():
            return conexion

    except Exception as e:
        print("❌ Error de conexión:", e)
        return None


if __name__ == "__main__":
    get_connection()