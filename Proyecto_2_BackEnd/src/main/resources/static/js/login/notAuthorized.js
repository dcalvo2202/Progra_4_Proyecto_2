// // notAuthorized.js - SPA view for unauthorized access
// export function renderNotAuthorized() {
//     const container = document.createElement('div');
//     container.className = 'authorized-container';
//
//     container.innerHTML = `
//     <div class="header">
//       <div class="logo">
//         <img src="/images/logo.jpg" alt="Logo">
//         <h3>Medical Appointments</h3>
//       </div>
//       <div class="nav-links">
//         <a href="#" id="about-link">About</a>
//         <a href="#" id="search-link">Search</a>
//         <a href="#" id="login-link">Login</a>
//       </div>
//     </div>
//
//     <div class="authorized-container">
//       <h2>No tiene permitido acceder a este recurso</h2>
//     </div>
//
//     <div class="footer">
//       ©2025 Sistema de Citas Médicas - Total Soft Inc.
//     </div>
//   `;
//
//     container.querySelector('#about-link').addEventListener('click', () => window.router.navigate('/about'));
//     container.querySelector('#search-link').addEventListener('click', () => window.router.navigate('/home'));
//     container.querySelector('#login-link').addEventListener('click', () => window.router.navigate('/login'));
//
//     return container;
// }

// /js/login/notAuthorized.js
function renderNotAuthorized(container) {
    container.innerHTML = `
    <section class="no-autorizado">
      <h2>Acceso No Autorizado</h2>
      <p>No tienes permisos para acceder a esta sección.</p>
      <a href="#login" class="boton">Volver al Login</a>
    </section>
  `;
}


/*
Este módulo SPA:

Informa al usuario que no tiene acceso a la página.

Ofrece un enlace para volver al login.
*/