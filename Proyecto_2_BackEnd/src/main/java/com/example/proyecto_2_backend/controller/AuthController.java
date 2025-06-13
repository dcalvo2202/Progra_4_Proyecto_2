package com.example.proyecto_2_backend.controller;

import com.example.proyecto_2_backend.DTO.LoginRequest;
import com.example.proyecto_2_backend.DTO.LoginResponse;
import com.example.proyecto_2_backend.DTO.RegisterMedicoRequest;
import com.example.proyecto_2_backend.DTO.RegisterRequest;
import com.example.proyecto_2_backend.model.Medico;
import com.example.proyecto_2_backend.model.Rol;
import com.example.proyecto_2_backend.model.Usuario;
import com.example.proyecto_2_backend.repository.RolRepository;
import com.example.proyecto_2_backend.service.MedicoService;
import com.example.proyecto_2_backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final MedicoService medicoService;
    private final RolRepository rolRepository;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try {
            // Verificar que el usuario existe antes de autenticar
            if (!usuarioService.existeUsuarioPorId(loginRequest.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Usuario no encontrado"));
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Establecer la autenticación en el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Obtener usuario desde la base de datos
            Usuario usuario = usuarioService.findUsuarioById(userDetails.getUsername());

            // Guardar información del usuario en la sesión
            session.setAttribute("userId", usuario.getId());
            session.setAttribute("username", usuario.getId());
            session.setAttribute("nombre", usuario.getNombre());
            session.setAttribute("roles", userDetails.getAuthorities());

            return ResponseEntity.ok(LoginResponse.builder()
                    .userId(usuario.getId())
                    .nombre(usuario.getNombre())
                    .roles(userDetails.getAuthorities().stream()
                            .map(auth -> auth.getAuthority())
                            .toList())
                    .build());

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Credenciales inválidas", "message", e.getMessage()));
        }
    }

    @PostMapping("/register/paciente")
    public ResponseEntity<?> registerPaciente(@RequestBody RegisterRequest req) {
        try {
            // Verificar que el usuario no existe
            if (usuarioService.existeUsuarioPorId(req.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "El usuario ya existe"));
            }

            Rol rol = rolRepository.findByName("Paciente")
                    .orElseThrow(() -> new IllegalArgumentException("Rol Paciente no existe"));

            Usuario usuario = new Usuario();
            usuario.setId(req.getUsername());
            usuario.setNombre(req.getUsername());
            usuario.setClave(passwordEncoder.encode(req.getPassword()));
            usuario.setRol(rol);

            usuarioService.register(usuario);

            return ResponseEntity.ok(Map.of("message", "Paciente registrado exitosamente"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al registrar paciente", "message", e.getMessage()));
        }
    }

    @PostMapping("/register/medico")
    public ResponseEntity<?> registerMedico(@RequestBody RegisterMedicoRequest req) {
        try {
            // Verificar que el usuario no existe
            if (usuarioService.existeUsuarioPorId(req.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "El usuario ya existe"));
            }

            // CORREGIDO: Buscar rol "Medico" en lugar de "Paciente"
            Rol rol = rolRepository.findByName("Medico")
                    .orElseThrow(() -> new IllegalArgumentException("Rol Medico no existe"));

            Usuario usuario = new Usuario();
            usuario.setId(req.getUsername());
            usuario.setNombre(req.getUsername());
            usuario.setClave(passwordEncoder.encode(req.getPassword()));
            usuario.setRol(rol);
            usuarioService.register(usuario);

            Medico medico = new Medico();
            medico.setUsuario(usuario);
            medico.setEspecialidad(req.getEspecialidad());
            medico.setCosto(req.getCosto());
            medico.setLocalidad(req.getLocalidad());
            medico.setFrecuenciaCitas(req.getFrecuenciaCitas());
            medico.setStatus("Pendiente");
            medicoService.registrarMedico(medico);

            return ResponseEntity.ok(Map.of("message", "Médico registrado exitosamente. Pendiente de aprobación"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al registrar médico", "message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        try {
            // Limpiar el contexto de seguridad
            SecurityContextHolder.clearContext();

            // Invalidar la sesión
            if (session != null) {
                session.invalidate();
            }

            return ResponseEntity.ok(Map.of("message", "Sesión cerrada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al cerrar sesión", "message", e.getMessage()));
        }
    }

    @GetMapping("/session-info")
    public ResponseEntity<?> getSessionInfo(HttpSession session) {
        try {
            if (session == null) {
                return ResponseEntity.ok(Map.of("authenticated", false));
            }

            String userId = (String) session.getAttribute("userId");
            String nombre = (String) session.getAttribute("nombre");

            if (userId != null) {
                return ResponseEntity.ok(Map.of(
                        "userId", userId,
                        "nombre", nombre != null ? nombre : "",
                        "authenticated", true
                ));
            }

            return ResponseEntity.ok(Map.of("authenticated", false));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
    }
}

/*package com.example.proyecto_2_backend.controller;

import com.example.proyecto_2_backend.DTO.LoginRequest;
import com.example.proyecto_2_backend.DTO.LoginResponse;
import com.example.proyecto_2_backend.DTO.RegisterMedicoRequest;
import com.example.proyecto_2_backend.DTO.RegisterRequest;
import com.example.proyecto_2_backend.model.Medico;
import com.example.proyecto_2_backend.model.Rol;
import com.example.proyecto_2_backend.model.Usuario;
import com.example.proyecto_2_backend.repository.RolRepository;
import com.example.proyecto_2_backend.service.MedicoService;
import com.example.proyecto_2_backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final MedicoService medicoService;
    private final RolRepository rolRepository;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Establecer la autenticación en el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Guardar información del usuario en la sesión
            Usuario usuario = usuarioService.findUsuarioById(userDetails.getUsername());
            session.setAttribute("userId", usuario.getId());
            session.setAttribute("username", usuario.getId());
            session.setAttribute("nombre", usuario.getNombre());
            session.setAttribute("roles", userDetails.getAuthorities());

            return ResponseEntity.ok(LoginResponse.builder()
                    .userId(usuario.getId())
                    .nombre(usuario.getNombre())
                    .roles(userDetails.getAuthorities().stream()
                            .map(auth -> auth.getAuthority())
                            .toList())
                    .build());

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Credenciales inválidas: " + e.getMessage());
        }
    }

    @PostMapping("/register/paciente")
    public ResponseEntity<?> registerPaciente(@RequestBody RegisterRequest req) {
        Rol rol = rolRepository.findByName("Paciente")
                .orElseThrow(() -> new IllegalArgumentException("Rol Paciente no existe"));

        Usuario usuario = new Usuario();
        usuario.setId(req.getUsername());
        usuario.setNombre(req.getUsername());
        usuario.setClave(passwordEncoder.encode(req.getPassword()));
        usuario.setRol(rol);

        usuarioService.register(usuario);

        return ResponseEntity.ok("Paciente registrado exitosamente");
    }

    @PostMapping("/register/medico")
    public ResponseEntity<?> registerMedico(@RequestBody RegisterMedicoRequest req) {
        Rol rol = rolRepository.findByName("Medico")
                .orElseThrow(() -> new IllegalArgumentException("Rol Paciente no existe"));

        Usuario usuario = new Usuario();
        usuario.setId(req.getUsername());
        usuario.setNombre(req.getUsername());
        usuario.setClave(passwordEncoder.encode(req.getPassword()));
        usuario.setRol(rol);
        usuarioService.register(usuario);

        Medico medico = new Medico();
        medico.setUsuario(usuario);
        medico.setEspecialidad(req.getEspecialidad());
        medico.setCosto(req.getCosto());
        medico.setLocalidad(req.getLocalidad());
        medico.setFrecuenciaCitas(req.getFrecuenciaCitas());
        medico.setStatus("Pendiente");
        medicoService.registrarMedico(medico);

        return ResponseEntity.ok("Médico registrado exitosamente. Pendiente de aprobación");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        try {
            // Limpiar el contexto de seguridad
            SecurityContextHolder.clearContext();

            // Invalidar la sesión
            session.invalidate();

            return ResponseEntity.ok("Sesión cerrada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al cerrar sesión: " + e.getMessage());
        }
    }

    @GetMapping("/session-info")
    public ResponseEntity<?> getSessionInfo(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            String nombre = (String) session.getAttribute("nombre");

            if (userId != null) {
                return ResponseEntity.ok(Map.of(
                        "userId", userId,
                        "nombre", nombre != null ? nombre : "",
                        "authenticated", true
                ));
            }

            return ResponseEntity.ok(Map.of("authenticated", false));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
    }
}
*/