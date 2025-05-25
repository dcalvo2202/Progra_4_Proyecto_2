package com.example.proyecto_2_backend.service;

import com.example.proyecto_2_backend.model.Horario;
import com.example.proyecto_2_backend.model.Medico;
import com.example.proyecto_2_backend.repository.HorarioRepository;
import com.example.proyecto_2_backend.repository.MedicoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class MedicoService {
    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Transactional
    public void registrarMedico(Medico medico){
        medicoRepository.save(medico);
    }

    public Iterable<Medico> medicoFindAll(){
        return medicoRepository.findAll();
    }

    public Medico obtenerMedicoPorId(String id) {
        return medicoRepository.findById(id).orElse(null);
    }

    public List<Medico> FiltradoMedicos(String especialidad, String localidad) {
        if ((especialidad == null || especialidad.isEmpty()) && (localidad == null || localidad.isEmpty())) {
            return (List<Medico>) medicoRepository.findAll();
        }
        if (especialidad == null) especialidad = "";
        if (localidad == null) localidad = "";

        return medicoRepository.findByEspecialidadContainingIgnoreCaseAndLocalidadContainingIgnoreCase(especialidad, localidad);
    }

    public List<Medico> FiltradoMedicosPorStatus(String status) {
        if (status == null || status.isEmpty()) {
            return (List<Medico>) medicoRepository.findAll();
        }
        return medicoRepository.findByStatusContainingIgnoreCase(status);
    }

    public void actualizarMedico(Medico medico) {
        Medico medicoExistente = medicoRepository.findById(medico.getId())
                .orElseThrow(() -> new RuntimeException("Médico no encontrado con ID: " + medico.getId()));
        double costoDouble = medico.getCosto().doubleValue();
        medicoExistente.setCosto(costoDouble);
        medicoExistente.setLocalidad(medico.getLocalidad());

        medicoRepository.save(medicoExistente);
    }

    @Transactional
    public void aceptarMedico(String id) {
        Medico medico = medicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado con ID: " + id));
        medico.setStatus("Aprobado");
        medicoRepository.save(medico);
    }

    public List<Horario> obtenerHorariosPorMedico(String medicoId) { return horarioRepository.findByMedicoId(medicoId); }

    public void agregarHorario(String medicoId, String dia, LocalTime horaInicio, LocalTime horaFin) {
        Medico medico = medicoRepository.findById(medicoId)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

        if (horaFin.isBefore(horaInicio) || horaFin.equals(horaInicio)) {
            throw new IllegalArgumentException("La hora de finalización debe ser mayor a la de inicio.");
        }

        List<Horario> horariosExistentes = horarioRepository.findByMedicoIdAndDia(medicoId, dia);
        if (!horariosExistentes.isEmpty()) {
            throw new IllegalArgumentException("El médico ya tiene un horario asignado para el día " + dia);
        }
        Horario nuevoHorario = new Horario();
        nuevoHorario.setMedico(medico);
        nuevoHorario.setDia(dia);
        nuevoHorario.setHoraInicio(horaInicio);
        nuevoHorario.setHoraFin(horaFin);

        horarioRepository.save(nuevoHorario);
    }

    public void eliminarHorario(String id, String dia) {
        Optional<Horario> horario = horarioRepository.findById(id);
        if (horario.isPresent() && horario.get().getDia().equalsIgnoreCase(dia)) {
            horarioRepository.delete(horario.get());
        }
    }
}
