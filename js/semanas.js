document.addEventListener("DOMContentLoaded", () => {

    const esAdmin = localStorage.getItem("admin") === "true";

    // 🔥 BOTÓN CERRAR SESIÓN
    if (esAdmin) {
        const menu = document.querySelector(".menu");

        const btnLogout = document.createElement("button");
        btnLogout.textContent = "Cerrar sesión";
        btnLogout.classList.add("btn-login");

        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("admin");
            location.reload();
        });

        menu.appendChild(btnLogout);
    }

    document.querySelectorAll(".unidad").forEach(unidad => {

        const carrusel = unidad.querySelector(".semanas");
        const tarjetas = unidad.querySelectorAll(".semana");
        const btnDerecha = unidad.querySelector(".next");
        const btnIzquierda = unidad.querySelector(".prev");

        let index = 0;

        function actualizar() {
            carrusel.style.transform = `translateX(-${index * 100}%)`;
        }

        btnDerecha.addEventListener("click", () => {
            index = (index + 1) % tarjetas.length;
            actualizar();
        });

        btnIzquierda.addEventListener("click", () => {
            index = (index - 1 + tarjetas.length) % tarjetas.length;
            actualizar();
        });

        // 🔥 ADMIN: SUBIR ARCHIVO
        tarjetas.forEach(card => {

            // 🔥 CONTENEDOR DE ARCHIVOS (SCROLL)
            const lista = document.createElement("div");
            lista.classList.add("lista-archivos");
            card.appendChild(lista);

            if (esAdmin) {
                const contenedor = document.createElement("div");
                contenedor.classList.add("admin-box");

                contenedor.innerHTML = `
                    <input type="file">
                    <button>Subir archivo</button>
                `;

                const input = contenedor.querySelector("input");
                const boton = contenedor.querySelector("button");

                boton.addEventListener("click", async () => {

                    const archivo = input.files[0];

                    if (!archivo) {
                        alert("Selecciona un archivo primero");
                        return;
                    }

                    const nombre = archivo.name;
                    const semana = card.querySelector("h3").textContent.trim();

                    // 🔥 1. SUBIR ARCHIVO A STORAGE
const nombreLimpio = archivo.name
    .normalize("NFD") // quita tildes
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/\s+/g, "_") // espacios → _
    .replace(/[^a-zA-Z0-9._-]/g, ""); // elimina raros

const nombreArchivo = Date.now() + "-" + nombreLimpio;

const { data: subida, error: errorSubida } = await supabaseClient
    .storage
    .from("archivos") // 🔥 nombre del bucket
    .upload(nombreArchivo, archivo);

if (errorSubida) {
    console.error(errorSubida);
    alert("Error subiendo archivo");
    return;
}

// 🔥 2. OBTENER URL PÚBLICA
const urlPublica = `https://kanqkmptwwzgphqsonxk.supabase.co/storage/v1/object/public/archivos/${nombreArchivo}`;

// 🔥 3. GUARDAR EN BASE DE DATOS
const { error } = await supabaseClient
    .from("archivos")
    .insert([
        {
            semana: semana,
            nombre: nombre,
            url: urlPublica
        }
    ]);

if (error) {
    console.error(error);
    alert("Error al guardar");
} else {
    alert("Guardado correctamente 🚀");
    location.reload();
}


                });

                card.appendChild(contenedor);
            }

        });

    });

    cargarArchivos();

});


// 🔥 MOSTRAR ARCHIVOS
async function cargarArchivos() {

    const { data, error } = await supabaseClient
        .from("archivos")
        .select("*");

    if (error) {
        console.error("Error cargando:", error);
        return;
    }

    data.forEach(item => {

        document.querySelectorAll(".semana").forEach(card => {

            const titulo = card.querySelector("h3").textContent.trim();

            if (titulo === item.semana.trim()) {

                const lista = card.querySelector(".lista-archivos");

                const enlace = document.createElement("a");
                enlace.textContent = item.nombre;

                // 🔥 ABRIR EN NUEVA PESTAÑA
                enlace.href = item.url || "#";
                enlace.target = "_blank";

                enlace.classList.add("archivo-link");

                lista.appendChild(enlace);
            }

        });

    });

}