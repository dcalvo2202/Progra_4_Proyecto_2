// /js/registro/registroExitoso.js
function renderRegistroExitoso(container) {
    container.innerHTML = `
    <section class="registro-exitoso">
      <h2>¡Registro Exitoso!</h2>
      <p>Tu cuenta ha sido registrada correctamente. Si eres médico, tu solicitud será revisada por un administrador.</p>
      <a href="#login" class="boton">Ir al Login</a>
    </section>
  `;
}


/*
Este módulo SPA:

Muestra un mensaje de confirmación tras el registro.

Redirige al login si el usuario lo desea.
*/

