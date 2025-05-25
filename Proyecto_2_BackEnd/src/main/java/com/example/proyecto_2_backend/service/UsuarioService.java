package com.example.proyecto_2_backend.service;

import com.example.proyecto_2_backend.model.Usuario;
import com.example.proyecto_2_backend.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Iterable<Usuario> usuarioFindAll(){
        return usuarioRepository.findAll();
    }

    @Transactional
    public void RegistrarUsuario(Usuario usuario){
        usuarioRepository.save(usuario);
    }

    public Usuario findUsuarioById(String id){
        return usuarioRepository.findById(id).get() ;
    }

    public boolean existeUsuarioPorId(String id){
        return usuarioRepository.existsById(id);
    }

    private boolean pacienteExisteEnBaseDeDatos(String paciente) {
        Usuario pacienteUsuario = usuarioRepository.findByNombreContainingIgnoreCase(paciente);
        return pacienteUsuario != null;
    }

    public Usuario encontrarUsuarioPorNombre(String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre);
    }
}
