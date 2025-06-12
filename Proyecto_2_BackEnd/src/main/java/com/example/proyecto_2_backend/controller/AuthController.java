package com.example.proyecto_2_backend.controller;

import com.example.proyecto_2_backend.DTO.LoginRequest;
import com.example.proyecto_2_backend.DTO.LoginResponse;
import com.example.proyecto_2_backend.DTO.RegisterRequest;
import com.example.proyecto_2_backend.model.Usuario;
import com.example.proyecto_2_backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;

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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // Aquí necesitarás implementar el método registrarUsuario en UsuarioService
            // que tome username, password y rol como parámetros
            usuarioService.RegistrarUsuario(
                    registerRequest.getUsername(),
                    registerRequest.getPassword(),
                    registerRequest.getRol()
            );

            return ResponseEntity.ok("Usuario registrado exitosamente");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al registrar usuario: " + e.getMessage());
        }
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