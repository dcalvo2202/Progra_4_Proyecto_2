// // confirmar.js - SPA view for appointment confirmation
// export function renderConfirmarCita(medico, fecha, hora, error = null) {
//     const container = document.createElement('div');
//     container.className = 'appointment-container';
//
//     container.innerHTML = `
//     <div class="appointment-card">
//       <img src="/usuario/imagen/${medico.id}" alt="Doctor" class="doctor-photo">
//       <p><i class="fas fa-id-card"></i> ${medico.usuario.nombre}</p>
//       <p><i class="fa fa-calendar"></i> ${fecha} - ${hora}</p>
//       <p><i class="fa fa-map-marker"></i> ${medico.localidad}</p>
//       <div class="actions">
//         <button class="confirm-btn">Confirm</button>
//         <button class="cancel-btn">Cancel</button>
//       </div>
//       ${error ? `<div class="error-message"><p>${error}</p></div>` : ''}
//     </div>
//   `;
//
//     container.querySelector('.confirm-btn').addEventListener('click', () => {
//         const ddt = encodeURIComponent(`${fecha}T${hora}`);
//         window.location.href = `/api/appointment/confirm?did=${medico.id}&ddt=${ddt}`;
//     });
//
//     container.querySelector('.cancel-btn').addEventListener('click', () => {
//         window.router.navigate(`/home/${medico.id}/schedule`);
//     });
//
//     return container;
// }

// /js/home/confirmar.js
function renderConfirmar(container) {
    container.innerHTML = `
    <section class="confirmar-cita">
      <h2>Confirmar Cita Pendiente</h2>
      <form id="formConfirmarCita">
        <div>
          <label for="idCita">ID de la Cita:</label>
          <input type="text" id="idCita" name="idCita" required />
        </div>
        <button type="submit">Confirmar</button>
      </form>
      <div id="mensajeConfirmacion" class="mensaje"></div>
    </section>
  `;

    document.getElementById("formConfirmarCita").addEventListener("submit", function (e) {
        e.preventDefault();

        const idCita = document.getElementById("idCita").value;

        fetch("/api/citas/" + idCita + "/confirmar", {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo confirmar la cita.");
                }
                return response.text();
            })
            .then(msg => {
                document.getElementById("mensajeConfirmacion").textContent = "Cita confirmada exitosamente.";
            })
            .catch(error => {
                document.getElementById("mensajeConfirmacion").textContent = error.message;
            });
    });
}


/*
Este módulo SPA:

Solicita el ID de una cita pendiente.

Realiza una solicitud PUT a /api/citas/{id}/confirmar.

Muestra mensaje de éxito o error según la respuesta.
*/
