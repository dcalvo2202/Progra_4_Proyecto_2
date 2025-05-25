package com.example.proyecto_2_backend.repository;

import com.example.proyecto_2_backend.model.Rol;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RolRepository extends CrudRepository<Rol, Integer> {
    Optional<Rol> findByName(String name);
}
