// gestionCitas.js - SPA view for gestión de citas del médico
export function renderGestionCitas(citas = []) {
    const section = document.createElement('section');

    section.innerHTML = `
    <h1>Gestión de Citas</h1>
    <form id="form-filtrar-citas">
      <label for="estado">Estado:</label>
      <select name="estado" id="estado">
        <option value="">Todos</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="CONFIRMADA">Confirmada</option>
        <option value="COMPLETADA">Completada</option>
        <option value="CANCELADA">Cancelada</option>
      </select>

      <label for="nombrePaciente">Nombre del paciente:</label>
      <input type="text" name="nombrePaciente" id="nombrePaciente">

      <button type="submit">Filtrar</button>
    </form>

    <table border="1">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Paciente</th>
          <th>Estado</th>
          <th>Anotaciones</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="citas-body"></tbody>
    </table>
  `;

    const tbody = section.querySelector('#citas-body');
    citas.forEach(cita => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${cita.fecha}</td>
      <td>${cita.horaInicio}:00</td>
      <td>${cita.paciente.nombre}</td>
      <td>${cita.estado}</td>
      <td>${cita.anotaciones || ''}</td>
      <td>
        <select name="estado" data-id="${cita.id}" class="estado-select">
          <option value="COMPLETADA">Completar</option>
          <option value="CANCELADA">Cancelar</option>
        </select>
        <br/>
        <textarea placeholder="Anotaciones..." data-id="${cita.id}" class="anotaciones-text"></textarea>
        <br/>
        <button class="guardar-btn" data-id="${cita.id}">Guardar</button>
      </td>
    `;
        tbody.appendChild(row);
    });

    section.querySelectorAll('.guardar-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const estado = section.querySelector(`.estado-select[data-id="${id}"]`).value;
            const anotaciones = section.querySelector(`.anotaciones-text[data-id="${id}"]`).value;
            await fetch('/api/medico/citas/completar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, estado, anotaciones })
            });
            alert('Cita actualizada');
            window.router.navigate('/gestion-citas');
        });
    });

    section.querySelector('#form-filtrar-citas').addEventListener('submit', e => {
        e.preventDefault();
        const params = new URLSearchParams(new FormData(e.target));
        window.router.navigate(`/gestion-citas?${params.toString()}`);
    });

    return section;
}
