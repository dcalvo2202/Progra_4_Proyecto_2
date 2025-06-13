// schedule.js - SPA view for scheduling appointments
export function renderSchedule(medico, disponibilidad = {}, semana = 0, minSemana = 0, maxSemana = 4, fechaActual = new Date(), ocupados = {}) {
    const container = document.createElement('div');
    container.className = 'table-container';

    const row = document.createElement('div');
    row.className = 'appointment-row';

    const doctorSection = document.createElement('div');
    doctorSection.className = 'doctor-info';
    doctorSection.innerHTML = `
    <div class="button-container">
      ${semana > minSemana ? `<button id="prev-btn">Prev</button>` : ''}
    </div>
    <img src="/usuario/imagen/${medico.id}" alt="Medico" class="picture">
    <div class="doctor-details">
      <strong>${medico.usuario.nombre}</strong>
      <span class="price">${medico.costo}</span>
      <p>${medico.especialidad}</p>
      <p class="hospital">${medico.localidad}</p>
    </div>
  `;

    const availability = document.createElement('div');
    availability.className = 'availability';
    availability.innerHTML = '<div class="dates-times-container"></div>';
    const datesTimesContainer = availability.querySelector('.dates-times-container');

    (disponibilidad[medico.id] || []).forEach(fechaObj => {
        const date = document.createElement('div');
        date.className = 'date';
        const fechaStr = new Date(fechaObj.fecha).toLocaleDateString();
        date.textContent = fechaStr;
        const times = document.createElement('div');
        times.className = 'times';

        fechaObj.horas.forEach(hora => {
            const esPasada = new Date(fechaObj.fecha) < fechaActual;
            const ocupado = ocupados[fechaObj.fecha]?.includes(hora);
            const button = document.createElement('button');
            button.textContent = hora;
            button.disabled = esPasada || ocupado;
            button.onclick = () => {
                window.location.href = `/book?did=${medico.id}&ddt=${fechaObj.fecha}T${hora}`;
            };
            times.appendChild(button);
        });

        datesTimesContainer.appendChild(date);
        datesTimesContainer.appendChild(times);
    });

    if (semana < maxSemana) {
        const nextBtnContainer = document.createElement('div');
        nextBtnContainer.className = 'button-container';
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.onclick = () => window.router.navigate(`/home/${medico.id}/schedule?semana=${semana + 1}`);
        nextBtnContainer.appendChild(nextBtn);
        availability.appendChild(nextBtnContainer);
    }

    if (semana > minSemana) {
        doctorSection.querySelector('#prev-btn')?.addEventListener('click', () => {
            window.router.navigate(`/home/${medico.id}/schedule?semana=${semana - 1}`);
        });
    }

    row.appendChild(doctorSection);
    row.appendChild(availability);
    container.appendChild(row);

    const goBack = document.createElement('div');
    goBack.className = 'go-back-container';
    const backButton = document.createElement('button');
    backButton.className = 'go-back-button';
    backButton.textContent = 'Go Back';
    backButton.onclick = () => window.router.navigate('/home');
    goBack.appendChild(backButton);
    container.appendChild(goBack);

    return container;
}
