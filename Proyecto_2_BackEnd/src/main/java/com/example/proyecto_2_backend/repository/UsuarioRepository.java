package com.example.proyecto_2_backend.repository;

import com.example.proyecto_2_backend.model.Usuario;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UsuarioRepository extends CrudRepository<Usuario, String> {
    Optional<Usuario> findByNombreContainingIgnoreCase(String paciente);
    // Optional<Usuario> findById(String id);
}
