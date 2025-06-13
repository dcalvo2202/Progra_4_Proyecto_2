// /js/main.js
window.addEventListener("load", router);
window.addEventListener("hashchange", router);

function router() {
    const path = location.hash.slice(1) || "home";
    const container = document.getElementById("app");

    const routes = {
        home: { script: "/js/home/home.js", render: "renderHome" },
        login: { script: "/js/login/login.js", render: "renderLogin" },
        about: { script: "/js/about/about.js", render: "renderAbout" },
        perfil: { script: "/js/home/MiPerfil.js", render: "renderMiPerfil" },
        confirmar: { script: "/js/home/confirmar.js", render: "renderConfirmar" },
        gestion: { script: "/js/home/gestion.js", render: "renderGestion" },
        registro: { script: "/js/registro/registro.js", render: "renderRegistro" },
        registroMedico: { script: "/js/registro/registroMedico.js", render: "renderRegistroMedico" },
        registroExitoso: { script: "/js/registro/registroExitoso.js", render: "renderRegistroExitoso" },
        historial: { script: "/js/cita/historial.js", render: "renderHistorial" },
        historialPaciente: { script: "/js/cita/historialPaciente.js", render: "renderHistorialPaciente" },
        agregarNotas: { script: "/js/cita/agregarNotas.js", render: "renderAgregarNotas" },
        mostrarNotas: { script: "/js/cita/mostrarNotas.js", render: "renderMostrarNotas" },
        schedule: { script: "/js/cita/schedule.js", render: "renderSchedule" },
        notAuthorized: { script: "/js/login/notAuthorized.js", render: "renderNotAuthorized" },
        gestionLogin: { script: "/js/login/gestion.js", render: "renderGestionLogin" },
    };

    const route = routes[path] || routes["home"];

    loadScript(route.script, () => {
        if (typeof window[route.render] === "function") {
            window[route.render](container);
        } else {
            container.innerHTML = `<p>Error: función ${route.render} no encontrada</p>`;
        }
    });
}

function loadScript(src, callback) {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
        callback();
        return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = callback;
    document.body.appendChild(script);
}
