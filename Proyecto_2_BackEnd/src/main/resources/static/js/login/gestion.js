// // gestionCitas.js - SPA view for gestión de citas del médico
// export function renderGestionCitas(citas = []) {
//     const section = document.createElement('section');
//
//     section.innerHTML = `
//     <h1>Gestión de Citas</h1>
//     <form id="form-filtrar-citas">
//       <label for="estado">Estado:</label>
//       <select name="estado" id="estado">
//         <option value="">Todos</option>
//         <option value="PENDIENTE">Pendiente</option>
//         <option value="CONFIRMADA">Confirmada</option>
//         <option value="COMPLETADA">Completada</option>
//         <option value="CANCELADA">Cancelada</option>
//       </select>
//
//       <label for="nombrePaciente">Nombre del paciente:</label>
//       <input type="text" name="nombrePaciente" id="nombrePaciente">
//
//       <button type="submit">Filtrar</button>
//     </form>
//
//     <table border="1">
//       <thead>
//         <tr>
//           <th>Fecha</th>
//           <th>Hora</th>
//           <th>Paciente</th>
//           <th>Estado</th>
//           <th>Anotaciones</th>
//           <th>Acciones</th>
//         </tr>
//       </thead>
//       <tbody id="citas-body"></tbody>
//     </table>
//   `;
//
//     const tbody = section.querySelector('#citas-body');
//     citas.forEach(cita => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//       <td>${cita.fecha}</td>
//       <td>${cita.horaInicio}:00</td>
//       <td>${cita.paciente.nombre}</td>
//       <td>${cita.estado}</td>
//       <td>${cita.anotaciones || ''}</td>
//       <td>
//         <select name="estado" data-id="${cita.id}" class="estado-select">
//           <option value="COMPLETADA">Completar</option>
//           <option value="CANCELADA">Cancelar</option>
//         </select>
//         <br/>
//         <textarea placeholder="Anotaciones..." data-id="${cita.id}" class="anotaciones-text"></textarea>
//         <br/>
//         <button class="guardar-btn" data-id="${cita.id}">Guardar</button>
//       </td>
//     `;
//         tbody.appendChild(row);
//     });
//
//     section.querySelectorAll('.guardar-btn').forEach(btn => {
//         btn.addEventListener('click', async () => {
//             const id = btn.dataset.id;
//             const estado = section.querySelector(`.estado-select[data-id="${id}"]`).value;
//             const anotaciones = section.querySelector(`.anotaciones-text[data-id="${id}"]`).value;
//             await fetch('/api/medico/citas/completar', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ id, estado, anotaciones })
//             });
//             alert('Cita actualizada');
//             window.router.navigate('/gestion-citas');
//         });
//     });
//
//     section.querySelector('#form-filtrar-citas').addEventListener('submit', e => {
//         e.preventDefault();
//         const params = new URLSearchParams(new FormData(e.target));
//         window.router.navigate(`/gestion-citas?${params.toString()}`);
//     });
//
//     return section;
// }


// /js/login/gestion.js
function renderGestionLogin(container) {
    container.innerHTML = `
    <section class="admin-gestion-medicos">
      <h2>Gestión de Solicitudes de Médicos</h2>
      <table id="tablaMedicos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </section>
  `;

    fetch("/api/medicos/pendientes", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudieron cargar los médicos pendientes.");
            }
            return response.json();
        })
        .then(medicos => {
            const tbody = document.querySelector("#tablaMedicos tbody");
            tbody.innerHTML = "";
            medicos.forEach(medico => {
                const row = document.createElement("tr");
                row.innerHTML = `
          <td>${medico.id}</td>
          <td>${medico.nombre}</td>
          <td>${medico.username}</td>
          <td>${medico.estado}</td>
          <td>
            <button onclick="aprobarMedico(${medico.id})">Aprobar</button>
          </td>
        `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            container.innerHTML += `<p class="error">${error.message}</p>`;
        });
}

function aprobarMedico(id) {
    fetch("/api/medicos/" + id + "/aprobar", {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo aprobar al médico.");
            }
            return response.text();
        })
        .then(msg => {
            alert("Médico aprobado exitosamente.");
            window.location.reload();
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
}

/*
Este módulo SPA:

Lista los médicos con estado pendiente.

Permite aprobar a cada médico mediante un botón.

Utiliza PUT /api/medicos/{id}/aprobar.
*/