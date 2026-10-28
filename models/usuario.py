class Usuario:
    def __init__(self, id, nombre, correo, password, rol="cliente", fecha_registro=None):
        self.id = id
        self.nombre = nombre
        self.correo = correo
        self.password = password
        self.rol = rol
        self.fecha_registro = fecha_registro

    def to_json(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "correo": self.correo,
            "rol": self.rol,
            "fecha_registro": str(self.fecha_registro) if self.fecha_registro else None
        }

    @staticmethod
    def from_db_row(row):
        return Usuario(
            id=row["id"],
            nombre=row["nombre"],
            correo=row["correo"],
            password=row["password"],
            rol=row.get("rol", "cliente"),
            fecha_registro=row.get("fecha_registro")
        )