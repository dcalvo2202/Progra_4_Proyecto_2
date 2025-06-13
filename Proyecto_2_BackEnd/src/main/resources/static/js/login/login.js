// login.js - SPA view for login page
export function renderLoginPage(error = false) {
    const main = document.createElement('main');
    main.innerHTML = `
    <div class="login-container">
      <h2>Login</h2>
      <div class="avatar">
        <img src="/images/image_User.png" alt="User">
      </div>
      <form id="login-form">
        <div class="input-group">
          <span>👤</span>
          <input type="text" id="username" name="username" placeholder="User id" required>
        </div>
        <div class="input-group">
          <span>🔑</span>
          <input type="password" id="password" name="password" placeholder="User Password" required>
        </div>
        <button type="submit" class="btn-form">Log in</button>
      </form>

      <div class="register">
        <p>Don't have an account? <a href="#" id="register-link">Register here</a></p>
      </div>

      ${error ? `<div class="error"><p>Credenciales Incorrectas</p></div>` : ''}
    </div>
  `;

    main.querySelector('#login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const response = await fetch('/login', {
            method: 'POST',
            body: formData
        });

        if (response.redirected) {
            window.location.href = response.url; // manejo especial por Spring Security
        } else if (response.status === 401) {
            window.router.navigate('/login?error=true');
        }
    });

    main.querySelector('#register-link').addEventListener('click', () => {
        window.router.navigate('/registro');
    });

    return main;
}
