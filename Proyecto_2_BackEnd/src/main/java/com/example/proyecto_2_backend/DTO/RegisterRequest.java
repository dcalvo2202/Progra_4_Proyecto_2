package com.example.proyecto_2_backend.DTO;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String rol;
}