// registro.js - SPA view for user registration
export function renderRegistroPage(roles = []) {
    const container = document.createElement('div');
    container.className = 'register-container';

    container.innerHTML = `
    <form id="registro-form" enctype="multipart/form-data">
      <div class="register-box">
        <h2>Registro</h2>
        <img src="/images/user.png" alt="User Icon">

        <div class="input-group">
          <i class="fas fa-user"></i>
          <input type="text" name="id" placeholder="User id" required>
        </div>

        <div class="input-group">
          <i class="fas fa-key"></i>
          <input type="password" name="clave" placeholder="User password" required>
        </div>

        <div class="input-group">
          <i class="fas fa-id-card"></i>
          <input type="text" name="nombre" placeholder="Name" required pattern="[A-Za-z\s]+" title="Números no Aceptados">
        </div>

        <div class="input-group">
          <i class="fas fa-user-tag"></i>
          <select id="rol" name="rol" required></select>
        </div>

        <div class="input-group">
          <i class="fas fa-camera"></i>
          <input type="file" name="imagen" id="imagen" accept="image/jpeg, image/png">
        </div>

        <button type="submit" class="registrarse-btn">Registrarse</button>
      </div>
    </form>
  `;

    const select = container.querySelector('#rol');
    roles.filter(r => r.id !== 3).forEach(rol => {
        const option = document.createElement('option');
        option.value = rol.id;
        option.textContent = rol.nombre;
        select.appendChild(option);
    });

    container.querySelector('#registro-form').addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const res = await fetch('/api/register/guardar', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            window.router.navigate('/registro/exitoso');
        } else {
            alert('Error al registrarse');
        }
    });

    return container;
}
