package com.example.proyecto_2_backend.DTO;

import lombok.Data;

@Data
public class RegisterMedicoRequest {
    private String username;
    private String password;
    private String especialidad;
    private double costo;
    private String localidad;
    private Integer frecuenciaCitas;
}
