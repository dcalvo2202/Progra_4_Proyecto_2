// // API Configuration
//const API_BASE_URL = 'http://localhost:8080'; // Cambia esto por tu URL del backend
// let currentUser = null;
// let authToken = null;
// let selectedDoctor = null;
//
// // Initialize the application
// document.addEventListener('DOMContentLoaded', function() {
//     checkAuthStatus();
//     setupEventListeners();
// });
//
// // Check if user is authenticated
// function checkAuthStatus() {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//         authToken = token;
//         validateToken();
//     } else {
//         showPage('loginPage');
//     }
// }
//
// // Validate token with backend
// async function validateToken() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             const isValid = await response.json();
//             if (isValid) {
//                 await loadUserData();
//                 showPage('homePage');
//                 setupNavigation();
//             } else {
//                 logout();
//             }
//         } else {
//             logout();
//         }
//     } catch (error) {
//         console.error('Error validating token:', error);
//         logout();
//     }
// }
//
// // Load user data
// async function loadUserData() {
//     try {
//         const userId = parseJwt(authToken).sub;
//         const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}`, {
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             currentUser = await response.json();
//         } else {
//             console.error('Error loading user data');
//         }
//     } catch (error) {
//         console.error('Error loading user data:', error);
//     }
// }
//
// // Parse JWT token
// function parseJwt(token) {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
//     return JSON.parse(jsonPayload);
// }
//
// // Setup event listeners
// function setupEventListeners() {
//     // Login form
//     document.getElementById('loginForm').addEventListener('submit', handleLogin);
//
//     // Appointment form
//     document.getElementById('appointmentForm').addEventListener('submit', handleAppointmentBooking);
// }
//
// // Handle login
// async function handleLogin(e) {
//     e.preventDefault();
//
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;
//
//     try {
//         const response = await fetch(`${API_BASE_URL}/auth/login`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ username, password })
//         });
//
//         if (response.ok) {
//             const data = await response.json();
//             authToken = data.token;
//             localStorage.setItem('authToken', authToken);
//
//             await loadUserData();
//             showPage('homePage');
//             setupNavigation();
//             hideError('loginError');
//         } else {
//             const error = await response.text();
//             showError('loginError', error);
//         }
//     } catch (error) {
//         console.error('Login error:', error);
//         showError('loginError', 'Error de conexión');
//     }
// }
//
// // Setup navigation based on user role
// function setupNavigation() {
//     const navLinks = document.getElementById('navLinks');
//
//     if (!currentUser) {
//         navLinks.innerHTML = `
//             <button onclick="showPage('loginPage')">Login</button>
//         `;
//         return;
//     }
//
//     let navigationHTML = `
//         <button onclick="showPage('homePage')">Inicio</button>
//     `;
//
//     // Add role-specific navigation
//     if (currentUser.rol && currentUser.rol.id === 1) { // Paciente
//         navigationHTML += `
//             <button onclick="showPage('appointmentsPage'); loadAppointments()">Mis Citas</button>
//         `;
//     } else if (currentUser.rol && currentUser.rol.id === 2) { // Médico
//         navigationHTML += `
//             <button onclick="showPage('appointmentsPage'); loadDoctorAppointments()">Citas</button>
//         `;
//     } else if (currentUser.rol && currentUser.rol.id === 3) { // Admin
//         navigationHTML += `
//             <button onclick="showPage('adminPage'); loadAdminContent()">Gestión</button>
//         `;
//     }
//
//     navigationHTML += `
//         <button onclick="showPage('profilePage'); loadProfile()">Perfil</button>
//         <div class="user-info">
//             <div class="user-avatar">${currentUser.nombre.charAt(0).toUpperCase()}</div>
//             <span>${currentUser.nombre}</span>
//             <button onclick="logout()">Cerrar Sesión</button>
//         </div>
//     `;
//
//     navLinks.innerHTML = navigationHTML;
// }
//
// // Show specific page
// function showPage(pageId) {
//     const pages = document.querySelectorAll('.page');
//     pages.forEach(page => page.classList.remove('active'));
//     document.getElementById(pageId).classList.add('active');
//
//     // Load page-specific content
//     if (pageId === 'homePage') {
//         loadDoctors();
//     }
// }
//
// // Load doctors
// async function loadDoctors() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/medicos`, {
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             const doctors = await response.json();
//             displayDoctors(doctors);
//         } else {
//             console.error('Error loading doctors');
//         }
//     } catch (error) {
//         console.error('Error loading doctors:', error);
//     }
// }
//
// // Display doctors
// function displayDoctors(doctors) {
//     const doctorsGrid = document.getElementById('doctorsGrid');
//
//     if (!doctors || doctors.length === 0) {
//         doctorsGrid.innerHTML = '<p>No hay médicos disponibles.</p>';
//         return;
//     }
//
//     const doctorsHTML = doctors
//         .filter(doctor => doctor.status === 'Aprobado')
//         .map(doctor => `
//             <div class="doctor-card">
//                 <div class="doctor-header">
//                     <div class="doctor-photo">
//                         ${doctor.usuario.nombre.charAt(0).toUpperCase()}
//                     </div>
//                     <div class="doctor-info">
//                         <h3>${doctor.usuario.nombre}</h3>
//                         <p>${doctor.especialidad}</p>
//                         <p><strong>$${doctor.costo}</strong></p>
//                     </div>
//                 </div>
//                 <div class="doctor-details">
//                     <p><i class="fas fa-map-marker-alt"></i> ${doctor.localidad}</p>
//                     <p><i class="fas fa-clock"></i> Frecuencia: ${doctor.frecuenciaCitas} min</p>
//                 </div>
//                 <button onclick="openAppointmentModal('${doctor.id}')" class="btn">
//                     Agendar Cita
//                 </button>
//             </div>
//         `).join('');
//
//     doctorsGrid.innerHTML = doctorsHTML;
// }
//
// // Search doctors
// async function searchDoctors() {
//     const specialty = document.getElementById('searchSpecialty').value;
//     const location = document.getElementById('searchLocation').value;
//
//     try {
//         const params = new URLSearchParams();
//         if (specialty) params.append('especialidad', specialty);
//         if (location) params.append('localidad', location);
//
//         const response = await fetch(`${API_BASE_URL}/api/medicos/filtrar?${params}`, {
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             const doctors = await response.json();
//             displayDoctors(doctors);
//         } else {
//             console.error('Error searching doctors');
//         }
//     } catch (error) {
//         console.error('Error searching doctors:', error);
//     }
// }
//
// // Open appointment modal
// async function openAppointmentModal(doctorId) {
//     selectedDoctor = doctorId;
//
//     // Load doctor's available schedules
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/medicos/${doctorId}/horarios`, {
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             const horarios = await response.json();
//             populateTimeSlots(horarios);
//             document.getElementById('appointmentModal').style.display = 'block';
//         } else {
//             console.error('Error loading doctor schedules');
//         }
//     } catch (error) {
//         console.error('Error loading doctor schedules:', error);
//     }
// }
//
// // Close modal
// function closeModal() {
//     document.getElementById('appointmentModal').style.display = 'none';
// }
//
// // Populate time slots
// function populateTimeSlots(horarios) {
//     const timeSelect = document.getElementById('appointmentTime');
//     timeSelect.innerHTML = '<option value="">Seleccionar hora</option>';
//
//     horarios.forEach(horario => {
//         const startTime = new Date(`2000-01-01T${horario.horaInicio}`);
//         const endTime = new Date(`2000-01-01T${horario.horaFin}`);
//
//         while (startTime < endTime) {
//             const timeString = startTime.toTimeString().slice(0, 5);
//             const option = document.createElement('option');
//             option.value = timeString;
//             option.textContent = timeString;
//             timeSelect.appendChild(option);
//
//             startTime.setMinutes(startTime.getMinutes() + 30); // 30-minute slots
//         }
//     });
// }
//
// // Handle appointment booking
// async function handleAppointmentBooking(e) {
//     e.preventDefault();
//
//     const appointmentData = {
//         medico: { id: selectedDoctor },
//         usuario: { id: currentUser.id },
//         fecha: document.getElementById('appointmentDate').value,
//         hora: document.getElementById('appointmentTime').value,
//         notas: document.getElementById('appointmentNotes').value,
//         status: 'PENDIENTE'
//     };
//
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/citas`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(appointmentData)
//         });
//
//         if (response.ok) {
//             closeModal();
//             alert('Cita agendada exitosamente');
//             // Reset form
//             document.getElementById('appointmentForm').reset();
//         } else {
//             const error = await response.text();
//             alert('Error al agendar cita: ' + error);
//         }
//     } catch (error) {
//         console.error('Error booking appointment:', error);
//         alert('Error de conexión');
//     }
// }
//
// // Load appointments
// async function loadAppointments() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/citas/usuario/${currentUser.id}`, {
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             const appointments = await response.json();
//             displayAppointments(appointments);
//         } else {
//             console.error('Error loading appointments');
//         }
//     } catch (error) {
//         console.error('Error loading appointments:', error);
//     }
// }
//
// // Display appointments
// function displayAppointments(appointments) {
//     const appointmentsContent = document.getElementById('appointmentsContent');
//
//     if (!appointments || appointments.length === 0) {
//         appointmentsContent.innerHTML = '<p>No tienes citas programadas.</p>';
//         return;
//     }
//
//     const appointmentsHTML = `
//         <table class="table">
//             <thead>
//                 <tr>
//                     <th>Médico</th>
//                     <th>Fecha</th>
//                     <th>Hora</th>
//                     <th>Estado</th>
//                     <th>Notas</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${appointments.map(appointment => `
//                     <tr>
//                         <td>${appointment.medico.usuario.nombre}</td>
//                         <td>${new Date(appointment.fecha).toLocaleDateString()}</td>
//                         <td>${appointment.hora}</td>
//                         <td>${appointment.status}</td>
//                         <td>${appointment.notas || '-'}</td>
//                     </tr>
//                 `).join('')}
//             </tbody>
//         </table>
//     `;
//
//     appointmentsContent.innerHTML = appointmentsHTML;
// }
//
// // Load doctor appointments
// async function loadDoctorAppointments() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/citas/medico/${currentUser.medico.id}`, {
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             const appointments = await response.json();
//             displayDoctorAppointments(appointments);
//         } else {
//             console.error('Error loading doctor appointments');
//         }
//     } catch (error) {
//         console.error('Error loading doctor appointments:', error);
//     }
// }
//
// // Display doctor appointments
// function displayDoctorAppointments(appointments) {
//     const appointmentsContent = document.getElementById('appointmentsContent');
//
//     if (!appointments || appointments.length === 0) {
//         appointmentsContent.innerHTML = '<p>No tienes citas programadas.</p>';
//         return;
//     }
//
//     const appointmentsHTML = `
//         <table class="table">
//             <thead>
//                 <tr>
//                     <th>Paciente</th>
//                     <th>Fecha</th>
//                     <th>Hora</th>
//                     <th>Estado</th>
//                     <th>Notas</th>
//                     <th>Acciones</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${appointments.map(appointment => `
//                     <tr>
//                         <td>${appointment.usuario.nombre}</td>
//                         <td>${new Date(appointment.fecha).toLocaleDateString()}</td>
//                         <td>${appointment.hora}</td>
//                         <td>${appointment.status}</td>
//                         <td>${appointment.notas || '-'}</td>
//                         <td>
//                             <button onclick="updateAppointmentStatus('${appointment.id}', 'CONFIRMADA')" class="btn btn-success">
//                                 Confirmar
//                             </button>
//                             <button onclick="updateAppointmentStatus('${appointment.id}', 'CANCELADA')" class="btn btn-danger">
//                                 Cancelar
//                             </button>
//                         </td>
//                     </tr>
//                 `).join('')}
//             </tbody>
//         </table>
//     `;
//
//     appointmentsContent.innerHTML = appointmentsHTML;
// }
//
// // Update appointment status
// async function updateAppointmentStatus(appointmentId, status) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/citas/${appointmentId}/status`, {
//             method: 'PUT',
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ status })
//         });
//
//         if (response.ok) {
//             alert('Estado de cita actualizado');
//             loadDoctorAppointments(); // Reload appointments
//         } else {
//             const error = await response.text();
//             alert('Error al actualizar estado: ' + error);
//         }
//     } catch (error) {
//         console.error('Error updating appointment status:', error);
//         alert('Error de conexión');
//     }
// }
//
// // Load profile
// async function loadProfile() {
//     if (!currentUser) return;
//
//     const profileContent = document.getElementById('profileContent');
//
//     if (currentUser.rol && currentUser.rol.id === 2) { // Doctor
//         await loadDoctorProfile();
//     } else {
//         // Patient profile
//         profileContent.innerHTML = `
//             <div class="profile-card">
//                 <div class="profile-photo">
//                     ${currentUser.nombre.charAt(0).toUpperCase()}
//                 </div>
//                 <h2>${currentUser.nombre}</h2>
//                 <p><strong>Email:</strong> ${currentUser.email}</p>
//                 <p><strong>Rol:</strong> ${currentUser.rol.nombre}</p>
//             </div>
//         `;
//     }
// }
//
// // Load doctor profile
// async function loadDoctorProfile() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/medicos/usuario/${currentUser.id}`, {
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             const doctorData = await response.json();
//             await loadDoctorSchedules(doctorData.id);
//             displayDoctorProfile(doctorData);
//         } else {
//             console.error('Error loading doctor profile');
//         }
//     } catch (error) {
//         console.error('Error loading doctor profile:', error);
//     }
// }
//
// // Load doctor schedules
// async function loadDoctorSchedules(doctorId) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/medicos/${doctorId}/horarios`, {
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             const schedules = await response.json();
//             currentUser.schedules = schedules;
//         } else {
//             console.error('Error loading doctor schedules');
//         }
//     } catch (error) {
//         console.error('Error loading doctor schedules:', error);
//     }
// }
//
// // Display doctor profile
// function displayDoctorProfile(doctorData) {
//     const profileContent = document.getElementById('profileContent');
//
//     const schedulesHTML = currentUser.schedules ? currentUser.schedules.map(schedule => `
//         <tr>
//             <td>${schedule.dia}</td>
//             <td>${schedule.horaInicio}</td>
//             <td>${schedule.horaFin}</td>
//             <td>
//                 <button onclick="deleteSchedule('${schedule.id}')" class="btn btn-danger">
//                     Eliminar
//                 </button>
//             </td>
//         </tr>
//     `).join('') : '';
//
//     profileContent.innerHTML = `
//         <div class="profile-card">
//             <div class="profile-photo">
//                 ${currentUser.nombre.charAt(0).toUpperCase()}
//             </div>
//             <h2>${currentUser.nombre}</h2>
//
//             <form id="profileForm">
//                 <div class="form-group">
//                     <label for="especialidad">Especialidad:</label>
//                     <input type="text" id="especialidad" name="especialidad" value="${doctorData.especialidad}" required>
//                 </div>
//
//                 <div class="form-group">
//                     <label for="costo">Costo:</label>
//                     <input type="number" id="costo" name="costo" value="${doctorData.costo}" required>
//                 </div>
//
//                 <div class="form-group">
//                     <label for="localidad">Localidad:</label>
//                     <input type="text" id="localidad" name="localidad" value="${doctorData.localidad}" required>
//                 </div>
//
//                 <div class="form-group">
//                     <label for="frecuencia">Frecuencia (minutos):</label>
//                     <input type="number" id="frecuencia" name="frecuencia" value="${doctorData.frecuenciaCitas}" required>
//                 </div>
//
//                 <button type="submit" class="btn">Actualizar Perfil</button>
//             </form>
//
//             <h3>Horarios de Atención</h3>
//             <table class="table">
//                 <thead>
//                     <tr>
//                         <th>Día</th>
//                         <th>Hora Inicio</th>
//                         <th>Hora Fin</th>
//                         <th>Acción</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${schedulesHTML}
//                 </tbody>
//             </table>
//
//             <h3>Agregar Nuevo Horario</h3>
//             <form id="scheduleForm">
//                 <div class="form-group">
//                     <label for="dia">Día:</label>
//                     <select id="dia" name="dia" required>
//                         <option value="">Seleccionar día</option>
//                         <option value="Lunes">Lunes</option>
//                         <option value="Martes">Martes</option>
//                         <option value="Miércoles">Miércoles</option>
//                         <option value="Jueves">Jueves</option>
//                         <option value="Viernes">Viernes</option>
//                         <option value="Sábado">Sábado</option>
//                         <option value="Domingo">Domingo</option>
//                     </select>
//                 </div>
//
//                 <div class="form-group">
//                     <label for="horaInicio">Hora Inicio:</label>
//                     <input type="time" id="horaInicio" name="horaInicio" required>
//                 </div>
//
//                 <div class="form-group">
//                     <label for="horaFin">Hora Fin:</label>
//                     <input type="time" id="horaFin" name="horaFin" required>
//                 </div>
//
//                 <button type="submit" class="btn">Agregar Horario</button>
//             </form>
//         </div>
//     `;
//
//     // Re-setup event listeners for the new forms
//     setupEventListeners();
// }
//
// // Handle profile update
// async function handleProfileUpdate(e) {
//     e.preventDefault();
//
//     const profileData = {
//         especialidad: document.getElementById('especialidad').value,
//         costo: document.getElementById('costo').value,
//         localidad: document.getElementById('localidad').value,
//         frecuenciaCitas: document.getElementById('frecuencia').value
//     };
//
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/medicos/${currentUser.medico.id}`, {
//             method: 'PUT',
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(profileData)
//         });
//
//         if (response.ok) {
//             alert('Perfil actualizado exitosamente');
//         } else {
//             const error = await response.text();
//             alert('Error al actualizar perfil: ' + error);
//         }
//     } catch (error) {
//         console.error('Error updating profile:', error);
//         alert('Error de conexión');
//     }
// }
//
// // Handle schedule add
// async function handleScheduleAdd(e) {
//     e.preventDefault();
//
//     const scheduleData = {
//         medicoId: currentUser.medico.id,
//         dia: document.getElementById('dia').value,
//         horaInicio: document.getElementById('horaInicio').value,
//         horaFin: document.getElementById('horaFin').value
//     };
//
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/horarios`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(scheduleData)
//         });
//
//         if (response.ok) {
//             alert('Horario agregado exitosamente');
//             loadProfile(); // Reload profile to show new schedule
//         } else {
//             const error = await response.text();
//             alert('Error al agregar horario: ' + error);
//         }
//     } catch (error) {
//         console.error('Error adding schedule:', error);
//         alert('Error de conexión');
//     }
// }
//
// // Delete schedule
// async function deleteSchedule(scheduleId) {
//     if (!confirm('¿Está seguro de eliminar este horario?')) return;
//
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/horarios/${scheduleId}`, {
//             method: 'DELETE',
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             alert('Horario eliminado exitosamente');
//             loadProfile(); // Reload profile
//         } else {
//             const error = await response.text();
//             alert('Error al eliminar horario: ' + error);
//         }
//     } catch (error) {
//         console.error('Error deleting schedule:', error);
//         alert('Error de conexión');
//     }
// }
//
// // Load admin content
// async function loadAdminContent() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/medicos/pendientes`, {
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             const pendingDoctors = await response.json();
//             displayAdminContent(pendingDoctors);
//         } else {
//             console.error('Error loading pending doctors');
//         }
//     } catch (error) {
//         console.error('Error loading pending doctors:', error);
//     }
// }
//
// // Display admin content
// function displayAdminContent(pendingDoctors) {
//     const adminContent = document.getElementById('adminContent');
//
//     if (!pendingDoctors || pendingDoctors.length === 0) {
//         adminContent.innerHTML = '<p>No hay médicos pendientes de aprobación.</p>';
//         return;
//     }
//
//     const doctorsHTML = pendingDoctors.map(doctor => `
//         <tr>
//             <td>
//                 <div class="doctor-photo">
//                     ${doctor.usuario.nombre.charAt(0).toUpperCase()}
//                 </div>
//             </td>
//             <td>${doctor.usuario.nombre}</td>
//             <td>${doctor.especialidad}</td>
//             <td>${doctor.localidad}</td>
//             <td>$${doctor.costo}</td>
//             <td>
//                 <button onclick="approveDoctor('${doctor.id}')" class="btn btn-success">
//                     Aceptar
//                 </button>
//                 <button onclick="rejectDoctor('${doctor.id}')" class="btn btn-danger">
//                     Rechazar
//                 </button>
//             </td>
//         </tr>
//     `).join('');
//
//     adminContent.innerHTML = `
//         <h2>Médicos Pendientes de Aprobación</h2>
//         <table class="table">
//             <thead>
//                 <tr>
//                     <th>Foto</th>
//                     <th>Nombre</th>
//                     <th>Especialidad</th>
//                     <th>Localidad</th>
//                     <th>Costo</th>
//                     <th>Acción</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 ${doctorsHTML}
//             </tbody>
//         </table>
//     `;
// }
//
// // Approve doctor
// async function approveDoctor(doctorId) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/medicos/${doctorId}/aprobar`, {
//             method: 'PUT',
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             alert('Médico aprobado exitosamente');
//             loadAdminContent(); // Reload admin content
//         } else {
//             const error = await response.text();
//             alert('Error al aprobar médico: ' + error);
//         }
//     } catch (error) {
//         console.error('Error approving doctor:', error);
//         alert('Error de conexión');
//     }
// }
//
// // Reject doctor
// async function rejectDoctor(doctorId) {
//     if (!confirm('¿Está seguro de rechazar este médico?')) return;
//
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/medicos/${doctorId}/rechazar`, {
//             method: 'PUT',
//             headers: {
//                 'Authorization': `Bearer ${authToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         if (response.ok) {
//             alert('Médico rechazado');
//             loadAdminContent(); // Reload admin content
//         } else {
//             const error = await response.text();
//             alert('Error al rechazar médico: ' + error);
//         }
//     } catch (error) {
//         console.error('Error rejecting doctor:', error);
//         alert('Error de conexión');
//     }
// }
//
// // Logout function
// function logout() {
//     localStorage.removeItem('authToken');
//     authToken = null;
//     currentUser = null;
//     selectedDoctor = null;
//     showPage('loginPage');
//     setupNavigation();
// }
//
// // Show error message
// function showError(elementId, message) {
//     const errorElement = document.getElementById(elementId);
//     if (errorElement) {
//         errorElement.textContent = message;
//         errorElement.style.display = 'block';
//     }
// }
//
// // Hide error message
// function hideError(elementId) {
//     const errorElement = document.getElementById(elementId);
//     if (errorElement) {
//         errorElement.style.display = 'none';
//     }
// }
//
// // Utility function to format date
// function formatDate(dateString) {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('es-ES');
// }
//
// // Utility function to format time
// function formatTime(timeString) {
//     return timeString.slice(0, 5);
// }


/************************************************************************************/
// document.addEventListener("DOMContentLoaded", () => {
//     cargarHeader();
//     cargarFooter();
//     renderFormularioBusqueda();
//     cargarMedicos();
// });
//
// function cargarHeader() {
//     const header = document.createElement("header");
//     header.innerHTML = `
//     <div class="logo">
//       <img src="/images/imagen_Login.png" alt="Medical Appointments">
//       <span>Medical Appointments</span>
//     </div>
//     <div class="contact">
//       <span>📞 +506 5467 0937</span>
//     </div>
//     <nav>
//       <a href="#">About</a>
//       <a href="#">Login</a>
//     </nav>
//   `;
//     document.body.appendChild(header);
// }
//
// function renderFormularioBusqueda() {
//     const main = document.createElement("main");
//     main.innerHTML = `
//     <div class="search-container">
//       <input type="text" id="especialidad" placeholder="Speciality" class="search-input">
//       <input type="text" id="localidad" placeholder="City" class="search-input">
//       <button class="search-btn" onclick="buscarMedicos()">Search</button>
//     </div>
//     <div class="medico-list" id="medicoList"></div>
//   `;
//     document.body.appendChild(main);
// }
//
// function cargarFooter() {
//     const footer = document.createElement("footer");
//     footer.innerHTML = `
//     <div class="footer-content">
//       <p>Total Soft Inc.</p>
//       <p>©2019 Tsf, Inc.</p>
//       <div class="social-icons">
//         <img src="/images/image_socials.png" alt="socials">
//       </div>
//     </div>
//   `;
//     document.body.appendChild(footer);
// }
//
// function buscarMedicos() {
//     const especialidad = document.getElementById("especialidad").value;
//     const localidad = document.getElementById("localidad").value;
//
//     fetch('/api/medicos/filtrar', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ especialidad, localidad })
//     })
//         .then(response => response.json())
//         .then(medicos => renderMedicos(medicos))
//         .catch(err => console.error("Error filtrando médicos", err));
// }
//
// function cargarMedicos() {
//     fetch('/api/medicos/aprobados')
//         .then(res => res.json())
//         .then(data => renderMedicos(data))
//         .catch(err => console.error("Error al cargar médicos", err));
// }
//
// function renderMedicos(medicos) {
//     const container = document.getElementById("medicoList");
//     container.innerHTML = "";
//
//     medicos.forEach(medico => {
//         const card = document.createElement("div");
//         card.className = "medico-card";
//         card.innerHTML = `
//       <img src="/usuario/imagen/${medico.id}" alt="medico" class="medico-img">
//       <div class="medico-info">
//         <h3>${medico.usuario.nombre}</h3>
//         <p>${medico.especialidad}</p>
//         <p>${medico.localidad}</p>
//         <p>₡${medico.costo}</p>
//         <div class="appointment-dates" id="disp-${medico.id}"></div>
//         <div class="button-container">
//           <a href="/home/${medico.id}/schedule">
//             <button>Schedule</button>
//           </a>
//         </div>
//       </div>
//     `;
//         container.appendChild(card);
//         cargarDisponibilidad(medico.id);
//     });
// }
//
// function cargarDisponibilidad(medicoId) {
//     fetch(`/api/disponibilidad/${medicoId}`)
//         .then(res => res.json())
//         .then(fechas => {
//             const contenedor = document.getElementById(`disp-${medicoId}`);
//             Object.keys(fechas).forEach(dia => {
//                 const fecha = new Date(dia).toLocaleDateString("es-CR");
//                 const div = document.createElement("div");
//                 div.innerHTML = `
//           <span class="date">${fecha}</span>
//           <div class="times">
//             ${fechas[dia].map(hora => `<button class="time-btn">${hora}</button>`).join('')}
//           </div>
//         `;
//                 contenedor.appendChild(div);
//             });
//         })
//         .catch(err => console.error(`Error cargando disponibilidad de médico ${medicoId}`, err));
// }

// /js/home/home.js
function renderHome(container) {
    container.innerHTML = `
    <section class="home">
      <h1>Bienvenido al Sistema de Citas Médicas</h1>
      <p>Accede a tu perfil, gestiona tus citas, o consulta información del sistema.</p>

      <div class="acciones-home">
        <a href="#perfil" class="boton">Mi Perfil</a>
        <a href="#gestion" class="boton">Gestión de Citas</a>
        <a href="#historial" class="boton">Historial Médico</a>
      </div>
    </section>
  `;

    // Opcionalmente: proteger el acceso a esta vista
    const token = localStorage.getItem("token");
    if (!token) {
        container.innerHTML = `
      <section class="home">
        <h1>Bienvenido</h1>
        <p>Por favor, inicia sesión para continuar.</p>
        <a href="#login" class="boton">Ir al Login</a>
      </section>
    `;
    }
}

/*
Este componente SPA:

Muestra una vista de bienvenida al sistema.

Ofrece enlaces a otras secciones (#perfil, #gestion, #historial).

Verifica si el usuario ha iniciado sesión revisando el token.
*/
