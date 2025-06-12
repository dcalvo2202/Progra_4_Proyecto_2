package com.example.proyecto_2_backend.security;

import com.example.proyecto_2_backend.model.Usuario;
import com.example.proyecto_2_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(usuario.getRol().getNombre());

        return new org.springframework.security.core.userdetails.User(
                usuario.getId(),
                usuario.getClave(),
                Collections.singleton(authority)
        );
    }
}