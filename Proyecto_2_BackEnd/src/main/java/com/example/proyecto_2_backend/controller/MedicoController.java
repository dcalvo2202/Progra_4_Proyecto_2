package com.example.proyecto_2_backend.controller;

import com.example.proyecto_2_backend.DTO.HorarioRequest;
import com.example.proyecto_2_backend.model.Horario;
import com.example.proyecto_2_backend.model.Medico;
import com.example.proyecto_2_backend.service.MedicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicoController {

    private final MedicoService medicoService;

    @PostMapping
    @PreAuthorize("hasAuthority('Administrador')")
    public ResponseEntity<?> registrarMedico(@RequestBody Medico medico) {
        try {
            medicoService.registrarMedico(medico);
            return ResponseEntity.ok("Médico registrado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al registrar médico: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Iterable<Medico>> obtenerTodosMedicos() {
        try {
            Iterable<Medico> medicos = medicoService.medicoFindAll();
            return ResponseEntity.ok(medicos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medico> obtenerMedicoPorId(@PathVariable String id) {
        try {
            Medico medico = medicoService.obtenerMedicoPorId(id);
            if (medico != null) {
                return ResponseEntity.ok(medico);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/filtrar")
    public ResponseEntity<List<Medico>> filtrarMedicos(
            @RequestParam(required = false) String especialidad,
            @RequestParam(required = false) String localidad) {
        try {
            List<Medico> medicos = medicoService.FiltradoMedicos(especialidad, localidad);
            return ResponseEntity.ok(medicos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/por-status")
    @PreAuthorize("hasAuthority('Administrador')")
    public ResponseEntity<List<Medico>> filtrarMedicosPorStatus(
            @RequestParam(required = false) String status) {
        try {
            List<Medico> medicos = medicoService.FiltradoMedicosPorStatus(status);
            return ResponseEntity.ok(medicos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping
    @PreAuthorize("hasAuthority('Medico') or hasAuthority('Administrador')")
    public ResponseEntity<?> actualizarMedico(@RequestBody Medico medico) {
        try {
            medicoService.actualizarMedico(medico);
            return ResponseEntity.ok("Médico actualizado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al actualizar médico: " + e.getMessage());
        }
    }

    @PutMapping("/aceptar/{id}")
    @PreAuthorize("hasAuthority('Administrador')")
    public ResponseEntity<?> aceptarMedico(@PathVariable String id) {
        try {
            medicoService.aceptarMedico(id);
            return ResponseEntity.ok("Médico aceptado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al aceptar médico: " + e.getMessage());
        }
    }

    // Gestión de Horarios
    @GetMapping("/{medicoId}/horarios")
    public ResponseEntity<List<Horario>> obtenerHorariosPorMedico(@PathVariable String medicoId) {
        try {
            List<Horario> horarios = medicoService.obtenerHorariosPorMedico(medicoId);
            return ResponseEntity.ok(horarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{medicoId}/horarios")
    @PreAuthorize("hasAuthority('Medico') or hasAuthority('Administrador')")
    public ResponseEntity<?> agregarHorario(
            @PathVariable String medicoId,
            @RequestBody HorarioRequest horarioRequest) {
        try {
            medicoService.agregarHorario(
                    medicoId,
                    horarioRequest.getDia(),
                    horarioRequest.getHoraInicio(),
                    horarioRequest.getHoraFin()
            );
            return ResponseEntity.ok("Horario agregado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al agregar horario: " + e.getMessage());
        }
    }

    @DeleteMapping("/{horarioId}/horarios/{dia}")
    @PreAuthorize("hasAuthority('Medico') or hasAuthority('Administrador')")
    public ResponseEntity<?> eliminarHorario(
            @PathVariable Integer horarioId,
            @PathVariable String dia) {
        try {
            medicoService.eliminarHorario(horarioId, dia);
            return ResponseEntity.ok("Horario eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al eliminar horario: " + e.getMessage());
        }
    }
}