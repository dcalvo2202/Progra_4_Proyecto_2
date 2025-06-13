// historial.js - SPA view for doctor's appointment history
export function renderHistorialCitas(citas = []) {
    const container = document.createElement('div');
    container.className = 'appointment-list';

    citas.forEach(cita => {
        const card = document.createElement('div');
        card.className = 'appointment-card';

        const statusClass = cita.status === 'Pendiente' ? 'status-pending' : (cita.status === 'Completada' ? 'status-attended' : '');

        card.innerHTML = `
      <div class="appointment-info">
        <img src="/usuario/imagen/${cita.usuario.id}" alt="paciente" class="picture">
        <div class="text-content">
          <h5>${cita.usuario.nombre}</h5>
        </div>
      </div>
      <div class="fecha">
        <span class="text">${cita.fecha} - ${cita.hora}</span>
      </div>
      <div class="appointment-status text-end">
        <span class="${statusClass}">${cita.status}</span>
      </div>
      <div class="appointment-actions d-flex align-items-center mt-2"></div>
    `;

        const actions = card.querySelector('.appointment-actions');
        if (['Cancelada', 'Completada'].includes(cita.status)) {
            const ver = document.createElement('a');
            ver.href = `#mostrarNotas/${cita.id}`;
            ver.className = 'ms-3 view-link';
            ver.innerHTML = '<i class="fas fa-eye"></i> Ver';
            actions.appendChild(ver);
        } else if (cita.status === 'Pendiente') {
            const aceptar = document.createElement('button');
            aceptar.textContent = 'Aceptar';
            aceptar.className = 'btn btn-success ms-3';
            aceptar.onclick = async () => {
                await fetch(`/api/AceptarCita/${cita.id}`, { method: 'POST' });
                window.router.navigate('/historial');
            };

            const cancelar = document.createElement('button');
            cancelar.textContent = 'Cancelar';
            cancelar.className = 'btn btn-danger ms-3';
            cancelar.onclick = async () => {
                await fetch(`/api/CancelarCita/${cita.id}`, { method: 'POST' });
                window.router.navigate('/historial');
            };

            actions.appendChild(aceptar);
            actions.appendChild(cancelar);
        }

        container.appendChild(card);
    });

    return container;
}
