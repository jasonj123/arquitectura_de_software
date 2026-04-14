function login() {
    let usuario = document.getElementById("usuario").value;
    let password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");

    // 🔐 CREDENCIALES
    const USER = "R03394K";
    const PASS = "Jhilmar";

    // 👉 Convertir usuario a MAYÚSCULA (para aceptar todo)
    usuario = usuario.toUpperCase();

    if (usuario === USER && password === PASS) {

        // Guardar sesión
        localStorage.setItem("admin", "true");

        mensaje.style.color = "lightgreen";
        mensaje.textContent = "Acceso correcto";

        setTimeout(() => {
            window.location.href = "semanas.html";
        }, 1000);

    } else {
        mensaje.style.color = "red";
        mensaje.textContent = "Usuario o contraseña incorrectos";
    }
}