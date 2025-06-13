// // historialPaciente.js - SPA view for patient appointment history
// export function renderHistorialPaciente(citas = []) {
//     const container = document.createElement('div');
//     container.className = 'appointment-list';
//
//     citas.forEach(cita => {
//         const card = document.createElement('div');
//         card.className = 'appointment-card';
//
//         const statusClass = cita.status === 'Pendiente' ? 'status-pending' : (cita.status === 'Completada' ? 'status-attended' : '');
//
//         card.innerHTML = `
//       <div class="appointment-info">
//         <img src="/usuario/imagen/${cita.medico.id}" alt="doctor" class="picture">
//         <div class="text-content">
//           <h5>
//             ${cita.medico.usuario.nombre} <span class="text-primary"><strong>${cita.medico.costo}</strong></span>
//           </h5>
//           <p class="mb-1">${cita.medico.especialidad}</p>
//           <p class="text-muted">${cita.medico.localidad}</p>
//         </div>
//       </div>
//
//       <div class="fecha">
//         <span class="text">${cita.fecha} - ${cita.hora}</span>
//       </div>
//
//       <div class="appointment-status">
//         <span class="${statusClass}">${cita.status}</span>
//       </div>
//
//       <div class="appointment-actions">
//         <a href="#mostrarNotas/${cita.id}" class="view-link">
//           <i class="fas fa-eye"></i> Ver
//         </a>
//       </div>
//     `;
//
//         container.appendChild(card);
//     });
//
//     return container;
// }

// /js/cita/historialPaciente.js
function renderHistorialPaciente(container) {
    container.innerHTML = `
    <section class="historial-paciente">
      <h2>Mi Historial de Citas</h2>
      <table id="tablaHistorialPaciente">
        <thead>
          <tr>
            <th>ID</th>
            <th>Médico</th>
            <th>Especialidad</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </section>
  `;

    fetch("/api/citas/paciente/historial", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el historial del paciente");
            }
            return response.json();
        })
        .then(citas => {
            const tbody = document.querySelector("#tablaHistorialPaciente tbody");
            tbody.innerHTML = "";
            citas.forEach(cita => {
                const row = document.createElement("tr");
                row.innerHTML = `
          <td>${cita.id}</td>
          <td>${cita.medicoNombre}</td>
          <td>${cita.especialidad}</td>
          <td>${cita.fecha}</td>
          <td>${cita.hora}</td>
          <td>${cita.estado}</td>
          <td>${cita.nota || "Sin nota"}</td>
        `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            container.innerHTML += `<p class="error">${error.message}</p>`;
        });
}


/*
Este código:

Carga el historial de citas del paciente autenticado.

Muestra tabla con datos como médico, especialidad y estado.

Usa GET /api/citas/paciente/historial.
*/
