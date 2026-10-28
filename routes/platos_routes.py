from flask import Blueprint, request, jsonify
from controllers.platos_controller import PlatoController
from utils.decorators import admin_required, login_required

platos_bp = Blueprint("platos", __name__)
controller = PlatoController()


# ──────────── PLATOS ────────────

@platos_bp.route("/api/platos", methods=["GET"])
def get_platos():
    try:
        return jsonify(controller.obtener_platos())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@platos_bp.route("/api/platos/<string:id>", methods=["GET"])
def get_plato(id):
    try:
        plato = controller.obtener_plato(id)
        if not plato:
            return jsonify({"error": "Plato no encontrado"}), 404
        return jsonify(plato)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@platos_bp.route("/api/platos", methods=["POST"])
@login_required
@admin_required
def crear_plato():
    try:
        body = request.get_json()
        if not body or not body.get("nombre"):
            return jsonify({"error": "Nombre es requerido"}), 400
        nuevo_id = controller.crear_plato(
            body["nombre"],
            body.get("descripcion", ""),
            body.get("precio", 0.0),
            body.get("imagen", "")
        )
        return jsonify({"message": "Plato creado", "id": nuevo_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@platos_bp.route("/api/platos/<string:id>", methods=["PUT"])
@login_required
@admin_required
def editar_plato(id):
    try:
        body = request.get_json()
        if not body or not body.get("nombre"):
            return jsonify({"error": "Nombre es requerido"}), 400
        controller.editar_plato(
            id,
            body["nombre"],
            body.get("descripcion", ""),
            body.get("precio", 0.0),
            body.get("imagen", "")
        )
        return jsonify({"message": "Plato actualizado"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@platos_bp.route("/api/platos/<string:id>", methods=["DELETE"])
@login_required
@admin_required
def eliminar_plato(id):
    try:
        controller.eliminar_plato(id)
        return jsonify({"message": "Plato eliminado"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ──────────── LIKES / DISLIKES ────────────

@platos_bp.route("/api/platos/<string:id>/like", methods=["POST"])
def like_plato(id):
    try:
        body = request.get_json() or {}
        accion = body.get("accion", "like")  # "like" o "dislike"
        resultado = controller.toggle_like(id, accion)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ──────────── COMENTARIOS ────────────

@platos_bp.route("/api/platos/<string:id>/comentarios", methods=["POST"])
def agregar_comentario(id):
    try:
        body = request.get_json()
        if not body or not body.get("comentario"):
            return jsonify({"error": "Comentario es requerido"}), 400
        nuevo = controller.agregar_comentario(
            id,
            body["comentario"],
            body.get("autor", "Anónimo")
        )
        return jsonify({"message": "Comentario añadido", "comentario": nuevo}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@platos_bp.route("/api/comentarios/<int:comentario_id>", methods=["DELETE"])
@login_required
@admin_required
def eliminar_comentario(comentario_id):
    try:
        controller.eliminar_comentario(comentario_id)
        return jsonify({"message": "Comentario eliminado"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ──────────── ESTADÍSTICAS ────────────

@platos_bp.route("/api/estadisticas", methods=["GET"])
def estadisticas():
    try:
        return jsonify(controller.obtener_estadisticas())
    except Exception as e:
        return jsonify({"error": str(e)}), 500