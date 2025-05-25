package com.example.proyecto_2_backend.repository;

import com.example.proyecto_2_backend.model.Medico;
import org.springframework.data.repository.CrudRepository;
 import java.util.List;

public interface MedicoRepository extends CrudRepository<Medico, String> {
    List<Medico> findByEspecialidadContainingIgnoreCaseAndLocalidadContainingIgnoreCase(String especialidad, String localidad);
    List<Medico> findByStatusContainingIgnoreCase(String status);
    Medico findByUsuarioNombreContainingIgnoreCase(String doctor);
}
