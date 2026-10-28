class Comentario:
    def __init__(self, id, plato_id, comentario, autor="Anónimo", fecha=None):
        self.id = id
        self.plato_id = plato_id
        self.comentario = comentario
        self.autor = autor
        self.fecha = fecha

    def to_json(self):
        return {
            "id": self.id,
            "plato_id": self.plato_id,
            "comentario": self.comentario,
            "autor": self.autor,
            "fecha": str(self.fecha) if self.fecha else None
        }

    @staticmethod
    def from_db_row(row):
        return Comentario(
            id=row["id"],
            plato_id=row["plato_id"],
            comentario=row["comentario"],
            autor=row.get("autor", "Anónimo"),
            fecha=row.get("fecha", None)
        )
