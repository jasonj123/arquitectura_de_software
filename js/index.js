document.addEventListener("DOMContentLoaded", () => {

    // Animaciones de entrada
    const elementos = document.querySelectorAll(".animar");
    elementos.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add("visible");
        }, index * 350);
    });

    const hero = document.getElementById("hero");
    const heroOverlay = document.getElementById("heroOverlay");
    const header = document.getElementById("header");
    const scrollHint = document.getElementById("scrollHint");

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        const heroH = hero.offsetHeight;

        // Efecto fade del hero al hacer scroll
        const progreso = Math.min(scrollY / (heroH * 0.6), 1);
        heroOverlay.style.opacity = 1 + progreso * 0.7;
        hero.style.opacity = 1 - progreso * 0.85;

        // Header sólido al salir del hero
        if (scrollY > heroH * 0.5) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Ocultar indicador de scroll
        if (scrollHint) {
            scrollHint.style.opacity = Math.max(0, 0.6 - progreso * 2);
        }
    });
});