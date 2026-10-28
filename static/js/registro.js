// Esperar a que cargue toda la página
document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("registroForm");

    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm_password");

    nombreInput.addEventListener("input", validarNombre);
    correoInput.addEventListener("input", validarCorreo);
    passwordInput.addEventListener("input", validarPassword);
    confirmPasswordInput.addEventListener("input", validarConfirmPassword);
    passwordInput.addEventListener("input", validarConfirmPassword);
    formulario.addEventListener("submit", function (e) {

        e.preventDefault();

        // Limpiar mensajes anteriores
        document.getElementById("nombreError").textContent = "";
        document.getElementById("correoError").textContent = "";
        document.getElementById("passwordError").textContent = "";
        document.getElementById("confirmPasswordError").textContent = "";

        let valido = true;

        // Validar nombre
        if (!validarNombre()) {
            valido = false;
        }
        // Validar correo
        if (!validarCorreo()) {
            valido = false;
        }
        // Validar contraseña
        if (!validarPassword()) {
            valido = false;
        }

        // Confirmar contraseña
        if (!validarConfirmPassword()) {
            valido = false;
        }

        if (valido) {
            formulario.submit();
        }


    });

});

function validarNombre() {

    const nombre = document.getElementById("nombre").value.trim();
    const error = document.getElementById("nombreError");

    if (nombre === "") {
        error.textContent = "El nombre es obligatorio.";
        return false;
    }

    if (nombre.length < 3) {
        error.textContent = "Debe tener al menos 3 caracteres.";
        return false;
    }

    if (nombre.length > 50) {

    error.textContent = "El nombre no puede superar los 50 caracteres.";
    return false;

    }

    error.textContent = "";
    return true;
}

function validarCorreo() {

    const correo = document.getElementById("correo").value.trim();
    const error = document.getElementById("correoError");

    if (correo === "") {
        error.textContent = "El correo es obligatorio.";
        return false;
    }

    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!expresion.test(correo)) {
        error.textContent = "Ingresa un correo válido.";
        return false;
    }

    error.textContent = "";
    return true;
}

function validarPassword() {

    const password = document.getElementById("password").value;
    const error = document.getElementById("passwordError");
    const barra = document.getElementById("passwordStrengthBar");
    const texto = document.getElementById("passwordStrengthText");
    
    error.classList.remove("text-success");
    error.classList.add("text-danger");


    if (password === "") {

    barra.style.width = "0%";
    barra.className = "progress-bar";

    texto.className = "";
    texto.textContent = "";

    error.textContent = "";

    return false;

}

    let fuerza = 0;

    if (password.length >= 8) fuerza++;
    if (/[A-Z]/.test(password)) fuerza++;
    if (/[a-z]/.test(password)) fuerza++;
    if (/[0-9]/.test(password)) fuerza++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) fuerza++;

    if (fuerza <= 2) {

        barra.style.width = "40%";
        barra.className = "progress-bar bg-danger";

        texto.className = "text-danger";
        texto.textContent = "Débil";

    }
    else if (fuerza <= 4) {

        barra.style.width = "70%";
        barra.className = "progress-bar bg-warning";

        texto.className = "text-warning";
        texto.textContent = "Media";

    }
    else {

        barra.style.width = "100%";
        barra.className = "progress-bar bg-success";

        texto.className = "text-success";
        texto.textContent = "Fuerte";

    }

    if (password.length < 8) {
        error.textContent = "Debe tener al menos 8 caracteres.";
        return false;
    }

    if (!/[A-Z]/.test(password)) {
        error.textContent = "Debe contener al menos una letra mayúscula.";
        return false;
    }

    if (!/[a-z]/.test(password)) {
        error.textContent = "Debe contener al menos una letra minúscula.";
        return false;
    }

    if (!/[0-9]/.test(password)) {
        error.textContent = "Debe contener al menos un número.";
        return false;
    }

    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
        error.textContent = "Debe contener un carácter especial.";
        return false;
    }

        error.classList.remove("text-danger");
        error.classList.add("text-success");
        error.textContent = "Contraseña segura.";

        return true;
    }

function validarConfirmPassword() {

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    const error = document.getElementById("confirmPasswordError");
    

    error.classList.remove("text-success");
    error.classList.add("text-danger");

    if (confirmPassword === "") {

        error.textContent = "";
        return false;

    }

    if (password !== confirmPassword) {
        error.textContent = "Las contraseñas no coinciden.";
        return false;
    }

    error.classList.remove("text-danger");
    error.classList.add("text-success");
    error.textContent = "Las contraseñas coinciden.";

    return true;
}

