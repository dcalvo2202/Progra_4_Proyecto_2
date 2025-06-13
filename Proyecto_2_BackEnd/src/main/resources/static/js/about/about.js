// about.js - SPA view for about page
export function renderAboutPage() {
    const container = document.createElement('div');
    container.className = 'about-container';

    container.innerHTML = `
    <div class="header">
      <div class="logo">
        <img src="/images/logo.jpg" alt="Logo">
        <h3>Medical Appointments</h3>
      </div>
      <div class="contact">📞 +506 5467 0937</div>
      <div class="nav-links">
        <a href="#" id="search-link">Search</a>
        <a href="#" id="login-link">Login</a>
      </div>
    </div>

    <div class="about-container">
      <h2>Bienvenido al Sistema de Citas Médicas</h2>
      <p>
        Nuestro sistema web ha sido desarrollado para facilitar la gestión de citas médicas en línea.
        Permite a los pacientes buscar médicos especialistas en diversas áreas, revisar sus horarios disponibles y reservar citas de manera rápida y sencilla.
      </p>
      <p>
        Los pacientes pueden registrarse e iniciar sesión para gestionar sus citas y acceder a un directorio de médicos actualizado.
        Por otro lado, los médicos tienen la posibilidad de crear su perfil, definir su disponibilidad semanal, consultar sus citas confirmadas
        y actualizar el estado de cada consulta, añadiendo anotaciones si lo consideran necesario.
      </p>
      <p>
        Además, el sistema cuenta con un administrador encargado de aprobar las solicitudes de registro de nuevos médicos,
        garantizando así la seguridad y confiabilidad del servicio.
      </p>
      <p>
        Nuestro objetivo es ofrecer una plataforma eficiente, segura y accesible para mejorar la experiencia de atención médica tanto para pacientes como para profesionales de la salud.
      </p>
    </div>

    <div class="footer">
      ©2025 Sistema de Citas Médicas - Total Soft Inc.
    </div>
  `;

    container.querySelector('#search-link').addEventListener('click', () => window.router.navigate('/home'));
    container.querySelector('#login-link').addEventListener('click', () => window.router.navigate('/login'));

    return container;
}
