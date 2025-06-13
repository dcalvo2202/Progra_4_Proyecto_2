// confirmar.js - SPA view for appointment confirmation
export function renderConfirmarCita(medico, fecha, hora, error = null) {
    const container = document.createElement('div');
    container.className = 'appointment-container';

    container.innerHTML = `
    <div class="appointment-card">
      <img src="/usuario/imagen/${medico.id}" alt="Doctor" class="doctor-photo">
      <p><i class="fas fa-id-card"></i> ${medico.usuario.nombre}</p>
      <p><i class="fa fa-calendar"></i> ${fecha} - ${hora}</p>
      <p><i class="fa fa-map-marker"></i> ${medico.localidad}</p>
      <div class="actions">
        <button class="confirm-btn">Confirm</button>
        <button class="cancel-btn">Cancel</button>
      </div>
      ${error ? `<div class="error-message"><p>${error}</p></div>` : ''}
    </div>
  `;

    container.querySelector('.confirm-btn').addEventListener('click', () => {
        const ddt = encodeURIComponent(`${fecha}T${hora}`);
        window.location.href = `/api/appointment/confirm?did=${medico.id}&ddt=${ddt}`;
    });

    container.querySelector('.cancel-btn').addEventListener('click', () => {
        window.router.navigate(`/home/${medico.id}/schedule`);
    });

    return container;
}
