from database import get_connection
from models.usuario import Usuario
from werkzeug.security import generate_password_hash, check_password_hash


class UsuariosController:

    def buscar_por_correo(self, correo):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM usuarios WHERE correo = %s",
            (correo,)
        )

        usuario = cursor.fetchone()

        cursor.close()
        conn.close()

        if usuario:
            return Usuario.from_db_row(usuario)

        return None


    def registrar_usuario(self, nombre, correo, password):

        # Verificar si ya existe el correo
        if self.buscar_por_correo(correo):
            return False, "El correo ya está registrado."

        # Cifrar contraseña
        password_hash = generate_password_hash(password)

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO usuarios(nombre, correo, password)
            VALUES(%s, %s, %s)
        """, (nombre, correo, password_hash))

        conn.commit()

        cursor.close()
        conn.close()

        return True, "Usuario registrado correctamente."