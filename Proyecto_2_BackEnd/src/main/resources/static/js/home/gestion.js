// // gestion.js - SPA view for admin doctor approval
// export function renderGestionMedicos(medicos = []) {
//     const section = document.createElement('section');
//
//     section.innerHTML = `
//     <h2>Médicos Pendientes de Aprobación</h2>
//     <table class="gestion-table">
//       <thead>
//         <tr>
//           <th>Foto</th>
//           <th>Nombre</th>
//           <th>Especialidad</th>
//           <th>Localidad</th>
//           <th>Costo</th>
//           <th>Acción</th>
//         </tr>
//       </thead>
//       <tbody></tbody>
//     </table>
//   `;
//
//     const tbody = section.querySelector('tbody');
//     medicos.filter(m => m.status !== 'PENDIENTE').forEach(medico => {
//         const row = document.createElement('tr');
//         row.className = 'medicos-row';
//         row.innerHTML = `
//       <td><img src="/usuario/imagen/${medico.id}" alt="Medico" class="picture rounded-circle"></td>
//       <td>${medico.usuario.nombre}</td>
//       <td>${medico.especialidad}</td>
//       <td>${medico.localidad}</td>
//       <td>${medico.costo}</td>
//       <td>
//         <button class="btn-accept" data-id="${medico.id}">Aceptar</button>
//       </td>
//     `;
//
//         row.querySelector('.btn-accept').addEventListener('click', async () => {
//             const res = await fetch('/api/medico/aceptar', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ id: medico.id })
//             });
//             if (res.ok) {
//                 alert('Médico aprobado correctamente');
//                 window.router.navigate('/gestion');
//             } else {
//                 alert('Error al aprobar médico');
//             }
//         });
//
//         tbody.appendChild(row);
//     });
//
//     return section;
// }

// /js/home/gestion.js
function renderGestion(container) {
    container.innerHTML = `
    <section class="gestion-citas">
      <h2>Gestión de Citas del Médico</h2>
      <table id="tablaGestionCitas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </section>
  `;

    fetch("/api/citas/medico/pendientes", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudieron cargar las citas.");
            }
            return response.json();
        })
        .then(citas => {
            const tbody = document.querySelector("#tablaGestionCitas tbody");
            tbody.innerHTML = "";
            citas.forEach(cita => {
                const row = document.createElement("tr");
                row.innerHTML = `
          <td>${cita.id}</td>
          <td>${cita.pacienteNombre}</td>
          <td>${cita.fecha}</td>
          <td>${cita.hora}</td>
          <td>${cita.estado}</td>
          <td><button onclick="confirmarCita(${cita.id})">Confirmar</button></td>
        `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            container.innerHTML += `<p class="error">${error.message}</p>`;
        });
}

function confirmarCita(id) {
    fetch("/api/citas/" + id + "/confirmar", {
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
            alert("Cita confirmada correctamente.");
            window.location.reload();
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
}



/*
Este módulo SPA:

Lista las citas pendientes del médico autenticado.

Permite confirmar cada cita con un botón que invoca PUT /api/citas/{id}/confirmar.

Recarga la vista al confirmar.
*/