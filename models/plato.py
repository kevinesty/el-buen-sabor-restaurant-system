class Plato:
    def __init__(self, id, nombre, descripcion="", precio=0.0, imagen="", likes=0, dislikes=0):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion
        self.precio = precio
        self.imagen = imagen
        self.likes = likes
        self.dislikes = dislikes

    def to_json(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "precio": float(self.precio),
            "imagen": self.imagen,
            "likes": self.likes,
            "dislikes": self.dislikes
        }

    @staticmethod
    def from_db_row(row):
        return Plato(
            id=row["id"],
            nombre=row["nombre"],
            descripcion=row.get("descripcion", ""),
            precio=row.get("precio", 0.0),
            imagen=row.get("imagen", ""),
            likes=row.get("likes", 0),
            dislikes=row.get("dislikes", 0)
        )
