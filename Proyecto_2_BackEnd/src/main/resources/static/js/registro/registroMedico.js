// registroMedico.js - SPA view for doctor's profile registration
export function renderRegistroMedico(usuarioId) {
    const container = document.createElement('div');
    container.className = 'registerDoc-container';

    container.innerHTML = `
    <form id="form-registro-medico">
      <div class="registerDoc-box">
        <h2>Información del Medico</h2>
        <img src="/images/user.png" alt="User Icon">

        <div class="input-group">
          <i class="fas fa-heartbeat"></i>
          <input type="text" name="especialidad" placeholder="Especialidad" required pattern="[A-Za-z\s]+" title="Números no Aceptados">
        </div>

        <div class="input-group">
          <i class="fas fa-coins"></i>
          <input type="number" name="costo" placeholder="Costo" required min="1">
        </div>

        <div class="input-group">
          <i class="fas fa-map"></i>
          <input type="text" name="localidad" placeholder="Localidad en la que atiende" required>
        </div>

        <div class="input-group">
          <i class="fas fa-clock"></i>
          <input type="number" name="frecuencia" placeholder="Frecuencia de citas en minutos" required min="1">
        </div>

        <button type="submit" class="registrarse-btn">Registrarse</button>
      </div>
    </form>
  `;

    container.querySelector('#form-registro-medico').addEventListener('submit', async e => {
        e.preventDefault();
        const form = e.target;
        const data = Object.fromEntries(new FormData(form).entries());
        const response = await fetch(`/api/register/guardar/medico/${usuarioId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Registro médico completado');
            window.router.navigate('/login');
        } else {
            alert('Error al registrar datos del médico');
        }
    });

    return container;
}
