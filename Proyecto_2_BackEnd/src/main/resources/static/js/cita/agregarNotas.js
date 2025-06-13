// agregarNotas.js - SPA view for adding notes to a medical appointment
export function renderAgregarNotas(citaId) {
    const form = document.createElement('form');
    form.className = 'nota-form';
    form.innerHTML = `
    <label for="nota">Agregar Nota:</label>
    <textarea id="nota" name="nota" rows="4" cols="50" placeholder="Escribe la nota aquí..."></textarea>
    <button type="submit">Guardar Nota</button>
  `;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nota = form.querySelector('#nota').value;
        const res = await fetch(`/api/agregarNotas/${citaId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nota })
        });

        if (res.ok) {
            alert('Nota guardada exitosamente');
            window.router.navigate('/historial');
        } else {
            alert('Error al guardar la nota');
        }
    });

    return form;
}
