document.addEventListener("DOMContentLoaded", () => {
    const nombreInput = document.getElementById("nombre");
    const precioInput = document.getElementById("precio");
    const agregarBtn = document.getElementById("agregar");
    const lista = document.getElementById("lista");
    const totalSpan = document.getElementById("total");

    let total = 0;

    agregarBtn.addEventListener("click", () => {
        const nombre = nombreInput.value.trim();
        const precio = parseFloat(precioInput.value);

        if (!nombre || isNaN(precio) || precio < 0) {
            alert("Introduce un nombre y un precio válido.");
            return;
        }

        const li = document.createElement("li");
        li.textContent = `${nombre}   ${precio.toFixed(2)} €`;
        lista.appendChild(li);

        total += precio;
        totalSpan.textContent = total.toFixed(2) + " €";

        nombreInput.value = "";
        precioInput.value = "";
        nombreInput.focus();
    });
});
