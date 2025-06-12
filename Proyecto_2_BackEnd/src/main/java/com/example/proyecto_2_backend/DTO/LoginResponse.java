package com.example.proyecto_2_backend.DTO;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class LoginResponse {
    private String userId;
    private String nombre;
    private List<String> roles;
    private String message;

    // Constructor adicional para respuestas simples
    public static LoginResponse success(String userId, String nombre, List<String> roles) {
        return LoginResponse.builder()
                .userId(userId)
                .nombre(nombre)
                .roles(roles)
                .message("Login exitoso")
                .build();
    }

    public static LoginResponse error(String message) {
        return LoginResponse.builder()
                .message(message)
                .build();
    }
}