package com.example.proyecto_2_backend.repository;

import com.example.proyecto_2_backend.model.Cita;
import com.example.proyecto_2_backend.model.Medico;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface CitaRepository extends CrudRepository<Cita, String> {
    List<Cita> findByUsuarioId(String usuarioId);

    Iterable<Cita> findByStatusContainingAndMedicoUsuarioNombreContainingIgnoreCase(String status, String doctor);

    Iterable<Cita> findByMedicoId(String id);

    Iterable<Cita> findByStatusAndMedicoId(String status, String id);

    Iterable<Cita> findByMedicoUsuarioNombreContainingIgnoreCaseAndMedicoId(String doctor, String id);

    Iterable<Cita> findByStatusAndUsuarioId(String status, String id);

    Iterable<Cita> findByUsuarioNombreContainingIgnoreCaseAndUsuarioId(String paciente, String id);

    Iterable<Cita> findByStatus(String status);

    @Query("SELECT c.hora FROM Cita c WHERE c.medico = :medico AND c.fecha = :fecha")
    List<LocalTime> findOcupadosByMedicoAndFecha(@Param("medico") Medico medico, @Param("fecha") LocalDate fecha);

    boolean existsByMedicoIdAndFechaAndHora(String medicoId, LocalDate fecha, LocalTime hora);
}
