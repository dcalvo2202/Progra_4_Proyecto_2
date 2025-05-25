CREATE DATABASE proyecto_2;
USE proyecto_2;

CREATE TABLE Rol (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Usuario (
id VARCHAR(100) PRIMARY KEY,
clave VARCHAR(255) NOT NULL,
rol_id INT NOT NULL,
nombre VARCHAR(100) NOT NULL,
imagen BLOB,
FOREIGN KEY (rol_id) REFERENCES Rol(id) ON DELETE RESTRICT
);

CREATE TABLE Medico (
id VARCHAR(100) PRIMARY KEY,
especialidad VARCHAR(100) NOT NULL,
costo DECIMAL(10,2) NOT NULL,
localidad VARCHAR(100) NOT NULL,
frecuencia_citas INT NOT NULL,
status ENUM('Pendiente', 'Aprobado') NOT NULL DEFAULT 'Pendiente',
FOREIGN KEY (id) REFERENCES Usuario(id) ON DELETE CASCADE
);

CREATE TABLE Horario (
id INT AUTO_INCREMENT PRIMARY KEY,
medico_id VARCHAR(100) NOT NULL,
dia ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
hora_inicio TIME NOT NULL,
hora_fin TIME NOT NULL,
FOREIGN KEY (medico_id) REFERENCES Medico(id) ON DELETE CASCADE
);

CREATE TABLE Cita (
id INT AUTO_INCREMENT PRIMARY KEY,
medico_id VARCHAR(100) NOT NULL,
usuario_id VARCHAR(100) NOT NULL,
fecha DATE NOT NULL,
hora TIME NOT NULL,
status ENUM('Pendiente', 'Cancelada', 'Completada') NOT NULL DEFAULT 'Pendiente',
notas TEXT,
FOREIGN KEY (medico_id) REFERENCES Medico(id) ON DELETE CASCADE,
FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE
);

CREATE TABLE Administrador (
    id VARCHAR(100) PRIMARY KEY,  
    FOREIGN KEY (id) REFERENCES Usuario(id) ON DELETE CASCADE
);

INSERT INTO Rol (nombre) VALUES ('Paciente'), ('Medico'), ('Administrador');

INSERT INTO Usuario (id, clave, rol_id, nombre) VALUES
('DAVCALV', 'D4v1d_c4lv02202*', 3, 'David Calvo');

update usuario set clave = '$2a$10$yLHbh5usc87QcKaU/rS0ieYEYzpr9/lqTRxJ1Iqsm9LL7qrUAiP4K' where id = 'DAVCALV';
INSERT INTO Administrador (id) VALUES ('DAVCALV');

INSERT INTO Usuario (id, clave, rol_id, nombre) VALUES
('PAC001', 'clave123', 1, 'Carlos Ramírez'),
('PAC002', 'clave123', 1, 'María López');

INSERT INTO Usuario (id, clave, rol_id, nombre) VALUES
('MED001', 'clave123', 2, 'Dra. Ana Quesada'),
('MED002', 'clave123', 2, 'Dr. Jorge Molina'),
('MED003', 'clave123', 2, 'Dr. Esteban Vargas');

UPDATE usuario set clave = '$2a$10$8oB6uBm//ZAJY.z2drrs9eWFFH67lbZ1jnX4a4trWms6JxR0CXtFu' where id = 'MED001';

INSERT INTO Medico (id, especialidad, costo, localidad, frecuencia_citas, status) VALUES
('MED001', 'Cardiología', 25000.00, 'Heredia Centro', 30, 'Aprobado'),
('MED002', 'Dermatología', 20000.00, 'San Francisco', 20, 'Aprobado'),
('MED003', 'Pediatría', 18000.00, 'Barva', 15, 'Pendiente'); -- Este aún no ha sido aprobado

-- Insertar horarios para los médicos
INSERT INTO Horario (medico_id, dia, hora_inicio, hora_fin) VALUES
('MED001', 'Lunes', '08:00:00', '12:00:00'),
('MED001', 'Miércoles', '14:00:00', '18:00:00'),
('MED002', 'Martes', '09:00:00', '13:00:00'),
('MED002', 'Jueves', '15:00:00', '19:00:00'),
('MED003', 'Viernes', '10:00:00', '12:00:00'),
('MED003', 'Sábado', '08:00:00', '11:00:00');

-- Insertar 5 citas
INSERT INTO Cita (medico_id, usuario_id, fecha, hora, status, notas) VALUES
('MED001', 'PAC001', '2025-04-04', '08:30:00', 'Pendiente', 'Chequeo de presión arterial'),
('MED001', 'PAC002', '2025-04-04', '09:00:00', 'Pendiente', 'Dolor en el pecho'),
('MED002', 'PAC001', '2025-04-05', '09:30:00', 'Pendiente', 'Revisión de lunares'),
('MED002', 'PAC002', '2025-04-05', '16:00:00', 'Pendiente', 'Irritación en la piel'),
('MED003', 'PAC001', '2025-04-06', '10:00:00', 'Pendiente', 'Consulta general para hijo');

select * from usuario;