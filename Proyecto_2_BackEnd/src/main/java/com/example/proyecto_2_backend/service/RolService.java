package com.example.proyecto_2_backend.service;

import com.example.proyecto_2_backend.repository.RolRepository;
import com.example.proyecto_2_backend.model.Rol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RolService {
    @Autowired
    private RolRepository rolRepository;

    public Iterable<Rol> rolFindAll() {
        return rolRepository.findAll();
    }

    public Rol rolFindById(Integer id) {
        Optional<Rol> rol = rolRepository.findById(id);
        return rol.orElse(null);
    }
}
