
// /js/registro/registro.js
function renderRegistro(container) {
    container.innerHTML = `
    <section class="registro-paciente">
      <h2>Registro de Paciente</h2>
      <form id="formRegistro">
        <div>
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" required />
        </div>
        <div>
          <label for="username">Correo electrónico:</label>
          <input type="email" id="username" name="username" required />
        </div>
        <div>
          <label for="password">Contraseña:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      <div id="mensajeRegistro" class="mensaje"></div>
    </section>
  `;

    document.getElementById("formRegistro").addEventListener("submit", function (e) {
        e.preventDefault();

        const datosRegistro = {
            nombre: document.getElementById("nombre").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        fetch("/api/auth/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosRegistro)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo registrar el usuario.");
                }
                return response.text();
            })
            .then(msg => {
                location.hash = "registroExitoso";
            })
            .catch(error => {
                document.getElementById("mensajeRegistro").textContent = error.message;
            });
    });
}


/*
Este componente SPA:

Permite registrar pacientes con nombre, correo y contraseña.

Llama a POST /api/auth/registro.

Redirige a #registroExitoso si el registro fue exitoso.
*/