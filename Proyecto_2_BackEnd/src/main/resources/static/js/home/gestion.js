// gestion.js - SPA view for admin doctor approval
export function renderGestionMedicos(medicos = []) {
    const section = document.createElement('section');

    section.innerHTML = `
    <h2>Médicos Pendientes de Aprobación</h2>
    <table class="gestion-table">
      <thead>
        <tr>
          <th>Foto</th>
          <th>Nombre</th>
          <th>Especialidad</th>
          <th>Localidad</th>
          <th>Costo</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

    const tbody = section.querySelector('tbody');
    medicos.filter(m => m.status !== 'PENDIENTE').forEach(medico => {
        const row = document.createElement('tr');
        row.className = 'medicos-row';
        row.innerHTML = `
      <td><img src="/usuario/imagen/${medico.id}" alt="Medico" class="picture rounded-circle"></td>
      <td>${medico.usuario.nombre}</td>
      <td>${medico.especialidad}</td>
      <td>${medico.localidad}</td>
      <td>${medico.costo}</td>
      <td>
        <button class="btn-accept" data-id="${medico.id}">Aceptar</button>
      </td>
    `;

        row.querySelector('.btn-accept').addEventListener('click', async () => {
            const res = await fetch('/api/medico/aceptar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: medico.id })
            });
            if (res.ok) {
                alert('Médico aprobado correctamente');
                window.router.navigate('/gestion');
            } else {
                alert('Error al aprobar médico');
            }
        });

        tbody.appendChild(row);
    });

    return section;
}