package com.example.proyecto_2_backend.security;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service

public class UserDetailsServiceImpl implements UserDetailsService {
//    private final UsuarioRepository usuarioRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        User user = usuarioRepository.findByNombreContainingIgnoreCase(username)
//                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
//
//        return new org.springframework.security.core.userdetails.User(
//                user.getUsername(),
//                user.getPassword(),
//                user.getRoles().stream()
//                        .map(role -> new SimpleGrantedAuthority(role.getName()))
//                        .collect(Collectors.toList())
//        );
//    }
}
