document.addEventListener("DOMContentLoaded", () => {
    const elementos = document.querySelectorAll(".animar");

    elementos.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add("visible");
        }, index * 400);
    });
});