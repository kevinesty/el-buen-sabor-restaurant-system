from functools import wraps

from flask import jsonify, redirect, request, session, url_for


def _es_peticion_api():
    """Indica si la petición va dirigida a un endpoint JSON de la API."""
    return request.path.startswith("/api/")


def login_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        if "usuario_id" not in session:
            if _es_peticion_api():
                return jsonify({
                    "error": "Debes iniciar sesión para realizar esta acción."
                }), 401

            return redirect(url_for("usuarios.vista_login"))

        return func(*args, **kwargs)

    return decorated_function


def admin_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        if session.get("rol") != "admin":
            if _es_peticion_api():
                if "usuario_id" not in session:
                    return jsonify({
                        "error": "Debes iniciar sesión para realizar esta acción."
                    }), 401

                return jsonify({
                    "error": "Acceso restringido a administradores."
                }), 403

            return redirect(url_for("index"))

        return func(*args, **kwargs)

    return decorated_function