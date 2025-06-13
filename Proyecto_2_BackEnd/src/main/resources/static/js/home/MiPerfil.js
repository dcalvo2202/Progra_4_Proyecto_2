// miPerfil.js - SPA view for Mi Perfil
export function renderMiPerfil(usuario, horarios = [], error = null) {
    const container = document.createElement('div');
    container.className = 'profile-container';

    const formHTML = `
    <div class="profile-card">
      <img src="/usuario/imagen/${usuario.id}" alt="Foto de perfil" class="profile-photo">
      <h2>${usuario.nombre}</h2>

      <form id="form-actualizar-medico">
        <input type="hidden" name="id" value="${usuario.medico.id}">

        <div class="form-group">
          <label for="especialidad">Especialidad:</label>
          <input type="text" id="especialidad" name="especialidad" value="${usuario.medico.especialidad}" required>
        </div>

        <div class="form-group">
          <label for="costo">Costo:</label>
          <input type="number" id="costo" name="costo" value="${usuario.medico.costo}" required>
        </div>

        <div class="form-group">
          <label for="localidad">Localidad:</label>
          <input type="text" id="localidad" name="localidad" value="${usuario.medico.localidad}" required>
        </div>

        <div class="form-group">
          <label for="frecuencia">Frecuencia:</label>
          <input type="number" id="frecuencia" name="frecuencia" value="${usuario.medico.frecuenciaCitas}" required>
        </div>

        <div class="btn-container">
          <button type="submit" class="btn">Actualizar</button>
        </div>
      </form>

      <h3>Horarios de Atención</h3>
      <table>
        <thead>
          <tr><th>Día</th><th>Hora Inicio</th><th>Hora Fin</th><th>Acción</th></tr>
        </thead>
        <tbody id="horarios-body"></tbody>
      </table>

      <h3>Agregar Nuevo Horario</h3>
      <form id="form-agregar-horario">
        <input type="hidden" name="medicoId" value="${usuario.medico.id}">
        <div class="form-group">
          <label for="dia">Día:</label>
          <select id="dia" name="dia">
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
        </div>
        <div class="form-group">
          <label for="horaInicio">Hora Inicio:</label>
          <input type="time" id="horaInicio" name="horaInicio" required>
        </div>
        <div class="form-group">
          <label for="horaFin">Hora Fin:</label>
          <input type="time" id="horaFin" name="horaFin" required>
        </div>
        <div class="btn-container">
          <button type="submit" class="btn">Agregar</button>
        </div>
      </form>
      ${error ? `<div class="error-message"><p>${error}</p></div>` : ''}
    </div>
  `;

    container.innerHTML = formHTML;

    // Llenar tabla de horarios
    const tbody = container.querySelector('#horarios-body');
    horarios.forEach(horario => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${horario.dia}</td>
      <td>${horario.horaInicioStr}</td>
      <td>${horario.horaFinStr}</td>
      <td>
        <button class="btn-delete" data-id="${horario.id}" data-dia="${horario.dia}">Eliminar</button>
      </td>
    `;

        row.querySelector('.btn-delete').addEventListener('click', async () => {
            await fetch('/api/horario/eliminar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: horario.id, dia: horario.dia })
            });
            window.router.navigate('/perfil');
        });

        tbody.appendChild(row);
    });

    container.querySelector('#form-actualizar-medico').addEventListener('submit', async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        await fetch('/api/medico/actualizar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert('Perfil actualizado');
    });

    container.querySelector('#form-agregar-horario').addEventListener('submit', async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        await fetch('/api/horario/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        window.router.navigate('/perfil');
    });

    return container;
}
