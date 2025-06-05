package com.example.proyecto_2_backend.DTO;

import lombok.Data;
import java.time.LocalTime;

@Data
public class HorarioRequest {
    private String dia;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}