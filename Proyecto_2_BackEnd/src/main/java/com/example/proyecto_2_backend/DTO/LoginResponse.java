package com.example.proyecto_2_backend.DTO;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class LoginResponse {
    private String token;
    private String userId;
    private String nombre;
    private List<String> roles;
}