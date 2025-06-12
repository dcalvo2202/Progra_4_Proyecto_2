package com.example.proyecto_2_backend.service;

import com.example.proyecto_2_backend.model.Rol;
import com.example.proyecto_2_backend.model.Usuario;
import com.example.proyecto_2_backend.repository.RolRepository;
import com.example.proyecto_2_backend.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;


    @Transactional
    public Iterable<Usuario> usuarioFindAll(){
        return usuarioRepository.findAll();
    }

    @Transactional
    public Usuario RegistrarUsuario(String id, String password, String name) {
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

    public void register(Usuario usuario){
        usuarioRepository.save(usuario);
    }


    public Usuario findUsuarioById(String id){
        return usuarioRepository.findById(id).get() ;
    }

    public boolean existeUsuarioPorId(String id){
        return usuarioRepository.existsById(id);
    }

    private boolean pacienteExisteEnBaseDeDatos(String paciente) {
        Optional<Usuario> pacienteUsuario = usuarioRepository.findByNombreContainingIgnoreCase(paciente);
        return pacienteUsuario != null;
    }

    public Optional<Usuario> encontrarUsuarioPorNombre(String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre);
    }
}
