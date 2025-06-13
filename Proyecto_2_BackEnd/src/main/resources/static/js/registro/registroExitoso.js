// registroExitoso.js - SPA view for successful registration
export function renderRegistroExitoso(loginUsuario = '') {
    const main = document.createElement('main');
    main.innerHTML = `
    <div class="intro">
      <h2>¡Gracias!</h2>
      <p>Muchas gracias por ingresar a nuestra página.</p>
      <p>Ya fue enviada tu solicitud al administrador. Cuando el administrador te acepte, podrás iniciar a navegar en nuestra página.</p>
      <div class="goTo">
        <p><a href="#" id="login-link">Login here</a></p>
      </div>
      <div class="goTo">
        <p><a href="#" id="editar-perfil-link">Editar Perfil</a></p>
      </div>
    </div>
  `;

    main.querySelector('#login-link').addEventListener('click', () => window.router.navigate('/login'));
    main.querySelector('#editar-perfil-link').addEventListener('click', () => {
        if (loginUsuario) {
            window.router.navigate(`/medicos/nuevo?login=${loginUsuario}`);
        } else {
            alert('No se pudo recuperar el usuario para editar el perfil');
        }
    });

    return main;
}
