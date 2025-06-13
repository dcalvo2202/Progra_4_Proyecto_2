// /js/registro/registroMedico.js
function renderRegistroMedico(container) {
    container.innerHTML = `
    <section class="registro-medico">
      <h2>Registro de Médico</h2>
      <form id="formRegistroMedico">
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
        <div>
          <label for="especialidad">Especialidad:</label>
          <input type="text" id="especialidad" name="especialidad" required />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      <div id="mensajeRegistroMedico" class="mensaje"></div>
    </section>
  `;

    document.getElementById("formRegistroMedico").addEventListener("submit", function (e) {
        e.preventDefault();

        const datos = {
            nombre: document.getElementById("nombre").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            especialidad: document.getElementById("especialidad").value
        };

        fetch("/api/auth/registro-medico", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo registrar el médico.");
                }
                return response.text();
            })
            .then(msg => {
                location.hash = "registroExitoso";
            })
            .catch(error => {
                document.getElementById("mensajeRegistroMedico").textContent = error.message;
            });
    });
}

/*
Este módulo SPA:

Permite registrar médicos.

Requiere nombre, correo, contraseña y especialidad.

Llama a POST /api/auth/registro-medico.

Redirige a #registroExitoso al finalizar correctamente.
*/