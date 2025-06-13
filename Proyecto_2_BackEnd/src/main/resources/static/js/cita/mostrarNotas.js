// mostrarNotas.js - SPA view for displaying appointment notes
export function renderMostrarNotas(notas) {
    const container = document.createElement('div');
    container.className = 'contenedor-notas';

    container.innerHTML = `
    <h2>Notas de la Cita</h2>
    <p>${notas && notas.trim() !== '' ? notas : 'No hay notas disponibles'}</p>
  `;

    return container;
}
