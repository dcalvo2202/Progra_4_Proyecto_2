package com.example.proyecto_2_backend.controller;

import com.example.proyecto_2_backend.model.Cita;
import com.example.proyecto_2_backend.model.Medico;
import com.example.proyecto_2_backend.service.CitaService;
import com.example.proyecto_2_backend.service.MedicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CitaController {

    private final CitaService citaService;
    private final MedicoService medicoService;

    @PostMapping
    @PreAuthorize("hasAuthority('PACIENTE') or hasAuthority('ADMIN')")
    public ResponseEntity<?> agendarCita(@RequestBody Cita cita) {
        try {
            citaService.agendarCita(cita);
            return ResponseEntity.ok("Cita agendada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al agendar cita: " + e.getMessage());
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasAuthority('PACIENTE') or hasAuthority('ADMIN')")
    public ResponseEntity<List<Cita>> obtenerCitasPorUsuario(@PathVariable String usuarioId) {
        try {
            List<Cita> citas = citaService.obtenerCitasPorUsuario(usuarioId);
            return ResponseEntity.ok(citas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/medico/{medicoId}")
    @PreAuthorize("hasAuthority('MEDICO') or hasAuthority('ADMIN')")
    public ResponseEntity<Iterable<Cita>> obtenerCitasPorMedico(@PathVariable String medicoId) {
        try {
            Iterable<Cita> citas = citaService.obtenerCitasPorMedico(medicoId);
            return ResponseEntity.ok(citas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cita> obtenerCitaPorId(@PathVariable String id) {
        try {
            Cita cita = citaService.obtenerCitaPorId(id);
            return ResponseEntity.ok(cita);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping
    @PreAuthorize("hasAuthority('MEDICO') or hasAuthority('ADMIN')")
    public ResponseEntity<?> actualizarCita(@RequestBody Cita cita) {
        try {
            citaService.actualizarCita(cita);
            return ResponseEntity.ok("Cita actualizada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al actualizar cita: " + e.getMessage());
        }
    }

    @GetMapping("/horarios-ocupados/{medicoId}")
    public ResponseEntity<List<LocalTime>> obtenerHorariosOcupados(
            @PathVariable String medicoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        try {
            Medico medico = medicoService.obtenerMedicoPorId(medicoId);
            List<LocalTime> horariosOcupados = citaService.obtenerHorariosOcupados(medico, fecha);
            return ResponseEntity.ok(horariosOcupados);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/historial-paciente")
    @PreAuthorize("hasAuthority('PACIENTE') or hasAuthority('ADMIN')")
    public ResponseEntity<Iterable<Cita>> filtroHistorialPaciente(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String medicoId,
            @RequestParam String pacienteId) {
        try {
            Iterable<Cita> citas = citaService.filtroHistorialPaciente(status, medicoId, pacienteId);
            return ResponseEntity.ok(citas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/historial-medico")
    @PreAuthorize("hasAuthority('MEDICO') or hasAuthority('ADMIN')")
    public ResponseEntity<Iterable<Cita>> filtroHistorialMedico(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String usuarioId,
            @RequestParam String medicoId) {
        try {
            Iterable<Cita> citas = citaService.filtroHistorialMedico(status, usuarioId, medicoId);
            return ResponseEntity.ok(citas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}