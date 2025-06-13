// // mostrarNotas.js - SPA view for displaying appointment notes
// export function renderMostrarNotas(notas) {
//     const container = document.createElement('div');
//     container.className = 'contenedor-notas';
//
//     container.innerHTML = `
//     <h2>Notas de la Cita</h2>
//     <p>${notas && notas.trim() !== '' ? notas : 'No hay notas disponibles'}</p>
//   `;
//
//     return container;
// }

// /js/cita/mostrarNotas.js
function renderMostrarNotas(container) {
    container.innerHTML = `
    <section class="mostrar-notas">
      <h2>Buscar Nota por ID de Cita</h2>
      <form id="formBuscarNota">
        <div>
          <label for="idCita">ID de la Cita:</label>
          <input type="text" id="idCita" name="idCita" required />
        </div>
        <button type="submit">Buscar Nota</button>
      </form>
      <div id="resultadoNota" class="resultado"></div>
    </section>
  `;

    document.getElementById("formBuscarNota").addEventListener("submit", function (e) {
        e.preventDefault();

        const idCita = document.getElementById("idCita").value;

        fetch("/api/citas/" + idCita + "/nota", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontró la nota o no tiene permiso para verla.");
                }
                return response.text();
            })
            .then(nota => {
                document.getElementById("resultadoNota").innerHTML = `
          <h3>Nota encontrada:</h3>
          <p>${nota}</p>
        `;
            })
            .catch(error => {
                document.getElementById("resultadoNota").innerHTML = `<p class="error">${error.message}</p>`;
            });
    });
}


/*
Este componente SPA:

Permite buscar una nota médica por el ID de la cita.

Llama a GET /api/citas/{id}/nota.

Muestra la nota en pantalla si se encuentra y está autorizada.
*/
