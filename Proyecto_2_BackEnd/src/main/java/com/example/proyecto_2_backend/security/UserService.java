package com.example.proyecto_2_backend.security;

import com.example.proyecto_2_backend.model.Usuario;
import com.example.proyecto_2_backend.model.Rol;
import com.example.proyecto_2_backend.repository.RolRepository;
import com.example.proyecto_2_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public Usuario registrarUsuario(String id, String password, String name) {
        if (usuarioRepository.findById(id).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        Rol rol = rolRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + name));

        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setClave(passwordEncoder.encode(password));
        usuario.setRol(rol);

        return usuarioRepository.save(usuario);
    }
}
