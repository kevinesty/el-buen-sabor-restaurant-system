from flask import Flask, render_template
from routes.platos_routes import platos_bp
from routes.usuarios_routes import usuarios_bp
from utils.decorators import admin_required, login_required
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent / ".env")

app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates"
)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

if not app.config["SECRET_KEY"]:
    raise RuntimeError(
        "Falta la variable de entorno SECRET_KEY. "
        "Defínela en el archivo .env antes de iniciar la aplicación."
    )

app.register_blueprint(platos_bp)
app.register_blueprint(usuarios_bp)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/platos")
def platos():
    return render_template("platos.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/admin")
@login_required
@admin_required
def admin():
    return render_template("admin.html")

if __name__ == "__main__":
    app.run(debug=True)