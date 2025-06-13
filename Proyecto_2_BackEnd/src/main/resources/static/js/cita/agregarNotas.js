// // agregarNotas.js - SPA view for adding notes to a medical appointment
// export function renderAgregarNotas(citaId) {
//     const form = document.createElement('form');
//     form.className = 'nota-form';
//     form.innerHTML = `
//     <label for="nota">Agregar Nota:</label>
//     <textarea id="nota" name="nota" rows="4" cols="50" placeholder="Escribe la nota aquí..."></textarea>
//     <button type="submit">Guardar Nota</button>
//   `;
//
//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const nota = form.querySelector('#nota').value;
//         const res = await fetch(`/api/agregarNotas/${citaId}`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ nota })
//         });
//
//         if (res.ok) {
//             alert('Nota guardada exitosamente');
//             window.router.navigate('/historial');
//         } else {
//             alert('Error al guardar la nota');
//         }
//     });
//
//     return form;
// }

// /js/cita/agregarNotas.js
function renderAgregarNotas(container) {
    container.innerHTML = `
    <section class="agregar-notas">
      <h2>Agregar Notas a la Cita</h2>
      <form id="formAgregarNota">
        <div>
          <label for="idCita">ID de la Cita:</label>
          <input type="text" id="idCita" name="idCita" required />
        </div>
        <div>
          <label for="nota">Nota del Médico:</label>
          <textarea id="nota" name="nota" rows="4" required></textarea>
        </div>
        <button type="submit">Guardar Nota</button>
      </form>
      <div id="respuestaNota" class="mensaje"></div>
    </section>
  `;

    document.getElementById("formAgregarNota").addEventListener("submit", function (e) {
        e.preventDefault();

        const idCita = document.getElementById("idCita").value;
        const nota = document.getElementById("nota").value;

        fetch("/api/citas/" + idCita + "/nota", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ nota: nota })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al guardar la nota.");
                }
                return response.text();
            })
            .then(data => {
                document.getElementById("respuestaNota").textContent = "Nota guardada correctamente.";
            })
            .catch(error => {
                document.getElementById("respuestaNota").textContent = error.message;
            });
    });
}

/*
Este código:

Crea un formulario para ingresar una nota asociada a una cita.

Hace un PUT a /api/citas/{id}/nota.

Usa token guardado en localStorage para autorización.
*/