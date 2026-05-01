document.addEventListener("DOMContentLoaded", () => {

    const esAdmin = localStorage.getItem("admin") === "true";

    // BOTÓN CERRAR SESIÓN
    if (esAdmin) {
        const menu = document.querySelector(".menu");
        const btnLogout = document.createElement("button");
        btnLogout.textContent = "CERRAR SESIÓN";
        btnLogout.classList.add("btn-login");
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("admin");
            location.reload();
        });
        menu.appendChild(btnLogout);
    }

    // ADMIN: SUBIR ARCHIVO
    document.querySelectorAll(".semana").forEach(semanaEl => {
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
                if (!archivo) { alert("Selecciona un archivo primero"); return; }

                const nombre = archivo.name;
                const semana = semanaEl.querySelector("h3").textContent.trim();

                const nombreLimpio = archivo.name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "_")
                    .replace(/[^a-zA-Z0-9._-]/g, "");

                const nombreArchivo = Date.now() + "-" + nombreLimpio;

                const { error: errorSubida } = await supabaseClient
                    .storage.from("archivos").upload(nombreArchivo, archivo);

                if (errorSubida) {
                    console.error(errorSubida);
                    alert("Error subiendo archivo");
                    return;
                }

                const urlPublica = `https://kanqkmptwwzgphqsonxk.supabase.co/storage/v1/object/public/archivos/${nombreArchivo}`;

                const { error } = await supabaseClient
                    .from("archivos")
                    .insert([{ semana, nombre, url: urlPublica }]);

                if (error) {
                    console.error(error);
                    alert("Error al guardar");
                } else {
                    alert("Guardado correctamente 🚀");
                    location.reload();
                }
            });

            semanaEl.querySelector(".card").appendChild(contenedor);
        }
    });

    cargarArchivos();

    // HEADER SCROLL
    window.addEventListener("scroll", () => {
        document.querySelector("header").classList.toggle("scrolled", window.scrollY > 60);
    });
});

// ÍCONOS SVG POR EXTENSIÓN
function obtenerIconoSVG(nombre) {
    const ext = nombre.split('.').pop().toLowerCase();

    const iconos = {
        pdf: `<svg class="archivo-icono" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14 2 14 8 20 8" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="6" y="19" font-size="5" fill="#c9a96e" font-family="sans-serif" font-weight="bold">PDF</text>
        </svg>`,

        png: `<svg class="archivo-icono" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#c9a96e" stroke-width="1.5"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="#c9a96e"/>
            <polyline points="21 15 16 10 5 21" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,

        jpg: `<svg class="archivo-icono" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#c9a96e" stroke-width="1.5"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="#c9a96e"/>
            <polyline points="21 15 16 10 5 21" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,

        docx: `<svg class="archivo-icono" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14 2 14 8 20 8" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="8" y1="13" x2="16" y2="13" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="8" y1="17" x2="16" y2="17" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,

        xlsx: `<svg class="archivo-icono" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14 2 14 8 20 8" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="8" y1="12" x2="16" y2="20" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="16" y1="12" x2="8" y2="20" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,

        pptx: `<svg class="archivo-icono" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14 2 14 8 20 8" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="8" y="12" width="5" height="4" rx="1" stroke="#c9a96e" stroke-width="1.5"/>
        </svg>`,

        zip: `<svg class="archivo-icono" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14 2 14 8 20 8" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="12" x2="12" y2="18" stroke="#c9a96e" stroke-width="1.5" stroke-dasharray="2 2" stroke-linecap="round"/>
        </svg>`,

        mp4: `<svg class="archivo-icono" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="#c9a96e" stroke-width="1.5"/>
            <polygon points="10 8 16 12 10 16 10 8" stroke="#c9a96e" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
        </svg>`,

        default: `<svg class="archivo-icono" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14 2 14 8 20 8" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    };

    // jpeg = jpg, doc = docx, xls = xlsx, ppt = pptx, rar = zip
    const alias = { jpeg: 'jpg', doc: 'docx', xls: 'xlsx', ppt: 'pptx', rar: 'zip' };
    const clave = alias[ext] || ext;

    return iconos[clave] || iconos.default;
}

// MOSTRAR ARCHIVOS
async function cargarArchivos() {
    const { data, error } = await supabaseClient.from("archivos").select("*");

    if (error) { console.error("Error cargando:", error); return; }

    const esAdmin = localStorage.getItem("admin") === "true";

    data.forEach(item => {
        document.querySelectorAll(".semana").forEach(semanaEl => {
            const titulo = semanaEl.querySelector("h3").textContent.trim();

            if (titulo === item.semana.trim()) {
                const lista = semanaEl.querySelector(".lista-archivos");

                const fila = document.createElement("div");
                fila.classList.add("archivo-item");

                const enlace = document.createElement("a");
                enlace.classList.add("archivo-link");
                enlace.href = item.url || "#";
                enlace.target = "_blank";
                enlace.innerHTML = `
                    ${obtenerIconoSVG(item.nombre)}
                    <span class="nombre">${item.nombre}</span>
                `;

                fila.appendChild(enlace);

                // Botón eliminar solo admin
                if (esAdmin) {
                    const btnEliminar = document.createElement("button");
                    btnEliminar.textContent = "✕";
                    btnEliminar.classList.add("btn-eliminar");
                    btnEliminar.title = "Eliminar archivo";

                    btnEliminar.addEventListener("click", async () => {
                        if (!confirm(`¿Eliminar "${item.nombre}"?`)) return;

                        const { error: errorDB } = await supabaseClient
                            .from("archivos").delete().eq("id", item.id);

                        if (errorDB) {
                            console.error(errorDB);
                            alert("Error al eliminar");
                            return;
                        }

                        const nombreArchivo = item.url.split("/").pop();
                        await supabaseClient.storage.from("archivos").remove([nombreArchivo]);

                        fila.remove();
                    });

                    fila.appendChild(btnEliminar);
                }

                lista.appendChild(fila);
            }
        });
    });
}