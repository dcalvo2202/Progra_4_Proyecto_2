package com.example.proyecto_2_backend.repository;

import com.example.proyecto_2_backend.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario, Integer> {
    List<Horario> findByMedicoId(@Param("medicoId") String medicoId);

    List<Horario> findByMedicoIdAndDia(String medicoId, String dia);

    @Query("SELECT h FROM Horario h WHERE h.medico.id = :medicoId")
    List<Horario> obtenerHorariosPorMedico(@Param("medicoId") String medicoId);
}
