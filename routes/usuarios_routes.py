from flask import Blueprint, flash, redirect, render_template, request, session, url_for
from controllers.usuarios_controller import UsuariosController
from utils.decorators import login_required
from werkzeug.security import check_password_hash

usuarios_bp = Blueprint("usuarios", __name__)

controller = UsuariosController()


@usuarios_bp.route("/registro", methods=["GET", "POST"])
def vista_registro():
    if request.method == "POST":
        nombre = request.form.get("nombre")
        correo = request.form.get("correo")
        password = request.form.get("password")

        try:
            registrado, mensaje = controller.registrar_usuario(
                nombre, correo, password
            )
        except Exception:
            flash("Ocurrió un error al registrar el usuario.", "error")
        else:
            if registrado:
                flash(
                    "¡Cuenta creada correctamente! Ahora puedes iniciar sesión.",
                    "success"
                )
                return redirect("/login")

            flash(mensaje, "error")

    return render_template("registro.html")


@usuarios_bp.route("/login", methods=["GET", "POST"])
def vista_login():
    if request.method == "POST":
        correo = request.form.get("correo")
        password = request.form.get("password")
        usuario = controller.buscar_por_correo(correo)

        if not usuario:
            flash("Correo o contraseña incorrectos.", "error")
            return render_template("login.html")

        if not check_password_hash(usuario.password, password):
            flash("Correo o contraseña incorrectos.", "error")
            return render_template("login.html")

        session["usuario_id"] = usuario.id
        session["nombre"] = usuario.nombre
        session["correo"] = usuario.correo
        session["rol"] = usuario.rol

        if usuario.rol == "admin":
            return redirect(url_for("admin"))

        if usuario.rol == "cliente":
            return redirect(url_for("index"))

        return redirect(url_for("index"))

    return render_template("login.html")

@usuarios_bp.route("/perfil")
@login_required
def vista_perfil():
    return render_template("perfil.html")


@usuarios_bp.route("/logout")
def logout():
    session.pop("usuario_id", None)
    session.pop("nombre", None)
    session.pop("correo", None)
    session.pop("rol", None)
    return redirect(url_for("index"))
