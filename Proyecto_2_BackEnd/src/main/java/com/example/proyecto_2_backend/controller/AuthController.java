package com.example.proyecto_2_backend.controller;


import com.example.proyecto_2_backend.DTO.LoginRequest;
import com.example.proyecto_2_backend.DTO.LoginResponse;
import com.example.proyecto_2_backend.DTO.RegisterRequest;
import com.example.proyecto_2_backend.model.Usuario;
import com.example.proyecto_2_backend.security.UserService;
import com.example.proyecto_2_backend.service.UsuarioService;
import com.example.proyecto_2_backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            // Obtener información adicional del usuario
            Usuario usuario = usuarioService.findUsuarioById(userDetails.getUsername());

            return ResponseEntity.ok(LoginResponse.builder()
                    .token(token)
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
            Usuario usuario = userService.registrarUsuario(
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

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = jwtUtil.extractUsername(token);

                if (username != null) {
                    Usuario usuario = usuarioService.findUsuarioById(username);
                    return ResponseEntity.ok(true);
                }
            }
            return ResponseEntity.ok(false);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
}

