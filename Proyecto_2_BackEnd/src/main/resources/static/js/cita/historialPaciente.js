// historialPaciente.js - SPA view for patient appointment history
export function renderHistorialPaciente(citas = []) {
    const container = document.createElement('div');
    container.className = 'appointment-list';

    citas.forEach(cita => {
        const card = document.createElement('div');
        card.className = 'appointment-card';

        const statusClass = cita.status === 'Pendiente' ? 'status-pending' : (cita.status === 'Completada' ? 'status-attended' : '');

        card.innerHTML = `
      <div class="appointment-info">
        <img src="/usuario/imagen/${cita.medico.id}" alt="doctor" class="picture">
        <div class="text-content">
          <h5>
            ${cita.medico.usuario.nombre} <span class="text-primary"><strong>${cita.medico.costo}</strong></span>
          </h5>
          <p class="mb-1">${cita.medico.especialidad}</p>
          <p class="text-muted">${cita.medico.localidad}</p>
        </div>
      </div>

      <div class="fecha">
        <span class="text">${cita.fecha} - ${cita.hora}</span>
      </div>

      <div class="appointment-status">
        <span class="${statusClass}">${cita.status}</span>
      </div>

      <div class="appointment-actions">
        <a href="#mostrarNotas/${cita.id}" class="view-link">
          <i class="fas fa-eye"></i> Ver
        </a>
      </div>
    `;

        container.appendChild(card);
    });

    return container;
}
