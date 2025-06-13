// // login.js - SPA view for login page
// export function renderLoginPage(error = false) {
//     const main = document.createElement('main');
//     main.innerHTML = `
//     <div class="login-container">
//       <h2>Login</h2>
//       <div class="avatar">
//         <img src="/images/image_User.png" alt="User">
//       </div>
//       <form id="login-form">
//         <div class="input-group">
//           <span>👤</span>
//           <input type="text" id="username" name="username" placeholder="User id" required>
//         </div>
//         <div class="input-group">
//           <span>🔑</span>
//           <input type="password" id="password" name="password" placeholder="User Password" required>
//         </div>
//         <button type="submit" class="btn-form">Log in</button>
//       </form>
//
//       <div class="register">
//         <p>Don't have an account? <a href="#" id="register-link">Register here</a></p>
//       </div>
//
//       ${error ? `<div class="error"><p>Credenciales Incorrectas</p></div>` : ''}
//     </div>
//   `;
//
//     main.querySelector('#login-form').addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         const response = await fetch('/login', {
//             method: 'POST',
//             body: formData
//         });
//
//         if (response.redirected) {
//             window.location.href = response.url; // manejo especial por Spring Security
//         } else if (response.status === 401) {
//             window.router.navigate('/login?error=true');
//         }
//     });
//
//     main.querySelector('#register-link').addEventListener('click', () => {
//         window.router.navigate('/registro');
//     });
//
//     return main;
// }

// /js/login/login.js
function renderLogin(container) {
    container.innerHTML = `
    <section class="login">
      <h2>Iniciar Sesión</h2>
      <form id="formLogin">
        <div>
          <label for="username">Usuario:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label for="password">Contraseña:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Ingresar</button>
      </form>
      <div id="mensajeLogin" class="mensaje"></div>
    </section>
  `;

    document.getElementById("formLogin").addEventListener("submit", function (e) {
        e.preventDefault();

        const loginData = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Usuario o contraseña incorrectos.");
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("rol", data.rol);
                // Redireccionar según el rol
                if (data.rol === "ADMIN") {
                    location.hash = "gestionLogin";
                } else if (data.rol === "MEDICO") {
                    location.hash = "gestion";
                } else if (data.rol === "PACIENTE") {
                    location.hash = "home";
                }
            })
            .catch(error => {
                document.getElementById("mensajeLogin").textContent = error.message;
            });
    });
}

/*
Este módulo SPA:

Proporciona un formulario de inicio de sesión.

Envía un POST a /api/auth/login.

Guarda el token JWT y redirecciona según el rol recibido: ADMIN, MEDICO o PACIENTE.
*/