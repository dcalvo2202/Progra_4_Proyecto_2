package com.example.proyecto_2_backend.DTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}