package com.example.proyecto_2_backend.controller;

import com.example.proyecto_2_backend.model.Rol;
import com.example.proyecto_2_backend.service.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RolController {

    private final RolService rolService;

    @GetMapping
    @PreAuthorize("hasAuthority('Administrador')")
    public ResponseEntity<Iterable<Rol>> obtenerTodosRoles() {
        try {
            Iterable<Rol> roles = rolService.rolFindAll();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('Administrador')")
    public ResponseEntity<Rol> obtenerRolPorId(@PathVariable Integer id) {
        try {
            Rol rol = rolService.rolFindById(id);
            if (rol != null) {
                return ResponseEntity.ok(rol);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}