package com.example.proyecto_2_backend.controller;

import com.example.proyecto_2_backend.model.Usuario;
import com.example.proyecto_2_backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Iterable<Usuario>> obtenerTodosUsuarios() {
        try {
            Iterable<Usuario> usuarios = usuarioService.usuarioFindAll();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            usuarioService.RegistrarUsuario(usuario);
            return ResponseEntity.ok("Usuario registrado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al registrar usuario: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable String id) {
        try {
            if (usuarioService.existeUsuarioPorId(id)) {
                Usuario usuario = usuarioService.findUsuarioById(id);
                return ResponseEntity.ok(usuario);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/existe/{id}")
    public ResponseEntity<Boolean> existeUsuario(@PathVariable String id) {
        try {
            boolean existe = usuarioService.existeUsuarioPorId(id);
            return ResponseEntity.ok(existe);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<Usuario> buscarUsuarioPorNombre(@RequestParam String nombre) {
        try {
            Optional<Usuario> usuario = usuarioService.encontrarUsuarioPorNombre(nombre);
            if (usuario.isPresent()) {
                return ResponseEntity.ok(usuario.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}