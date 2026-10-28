import re
from database import get_connection

class PlatoController:

    # ─────────────── PLATOS ───────────────

    def obtener_platos(self):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM platos ORDER BY id")
        platos = cursor.fetchall()
        for plato in platos:
            cursor.execute(
                "SELECT id, comentario, autor, fecha FROM comentarios WHERE plato_id = %s ORDER BY fecha DESC",
                (plato["id"],)
            )
            plato["comentarios"] = cursor.fetchall()
            plato["total_comentarios"] = len(plato["comentarios"])
            # Serialize fecha
            for c in plato["comentarios"]:
                c["fecha"] = str(c["fecha"]) if c.get("fecha") else None
        cursor.close()
        conn.close()
        return platos

    def obtener_plato(self, id):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM platos WHERE id = %s", (id,))
        plato = cursor.fetchone()
        if plato:
            cursor.execute(
                "SELECT id, comentario, autor, fecha FROM comentarios WHERE plato_id = %s ORDER BY fecha DESC",
                (id,)
            )
            plato["comentarios"] = cursor.fetchall()
            for c in plato["comentarios"]:
                c["fecha"] = str(c["fecha"]) if c.get("fecha") else None
        cursor.close()
        conn.close()
        return plato

    def crear_plato(self, nombre, descripcion, precio, imagen):
        conn = get_connection()
        cursor = conn.cursor()

        # Genera el siguiente ID tipo P001, P002, P003... a partir del último existente
        cursor.execute("SELECT id FROM platos ORDER BY id DESC LIMIT 1")
        ultimo = cursor.fetchone()
        if ultimo and ultimo[0]:
            match = re.search(r"(\d+)$", str(ultimo[0]))
            numero = int(match.group(1)) + 1 if match else 1
        else:
            numero = 1
        nuevo_id = f"P{numero:03d}"

        cursor.execute(
            "INSERT INTO platos (id, nombre, descripcion, precio, imagen, likes, dislikes) VALUES (%s, %s, %s, %s, %s, 0, 0)",
            (nuevo_id, nombre, descripcion, precio, imagen)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return nuevo_id

    def editar_plato(self, id, nombre, descripcion, precio, imagen):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE platos SET nombre=%s, descripcion=%s, precio=%s, imagen=%s WHERE id=%s",
            (nombre, descripcion, precio, imagen, id)
        )
        conn.commit()
        cursor.close()
        conn.close()

    def eliminar_plato(self, id):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM comentarios WHERE plato_id = %s", (id,))
        cursor.execute("DELETE FROM platos WHERE id = %s", (id,))
        conn.commit()
        cursor.close()
        conn.close()

    # ─────────────── LIKES / DISLIKES ───────────────

    def toggle_like(self, plato_id, accion):
        conn = get_connection()
        cursor = conn.cursor()
        if accion == "like":
            cursor.execute("UPDATE platos SET likes = likes + 1 WHERE id = %s", (plato_id,))
        elif accion == "dislike":
            cursor.execute("UPDATE platos SET dislikes = dislikes + 1 WHERE id = %s", (plato_id,))
        conn.commit()
        cursor.execute("SELECT likes, dislikes FROM platos WHERE id = %s", (plato_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        return {"likes": row[0], "dislikes": row[1]}

    # ─────────────── COMENTARIOS ───────────────

    def agregar_comentario(self, plato_id, comentario, autor="Anónimo"):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO comentarios (plato_id, comentario, autor) VALUES (%s, %s, %s)",
            (plato_id, comentario, autor)
        )
        nuevo_id = cursor.lastrowid
        conn.commit()
        # Devolver el comentario recién creado
        cursor2 = conn.cursor(dictionary=True)
        cursor2.execute("SELECT id, plato_id, comentario, autor, fecha FROM comentarios WHERE id = %s", (nuevo_id,))
        nuevo = cursor2.fetchone()
        if nuevo and nuevo.get("fecha"):
            nuevo["fecha"] = str(nuevo["fecha"])
        cursor.close()
        cursor2.close()
        conn.close()
        return nuevo

    def eliminar_comentario(self, comentario_id):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM comentarios WHERE id = %s", (comentario_id,))
        conn.commit()
        cursor.close()
        conn.close()

    # ─────────────── ESTADÍSTICAS ───────────────

    def obtener_estadisticas(self):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT p.id, p.nombre, p.likes, p.dislikes,
                   COUNT(c.id) AS total_comentarios
            FROM platos p
            LEFT JOIN comentarios c ON c.plato_id = p.id
            GROUP BY p.id
            ORDER BY p.likes DESC
        """)
        datos = cursor.fetchall()
        cursor.close()
        conn.close()
        return datos
