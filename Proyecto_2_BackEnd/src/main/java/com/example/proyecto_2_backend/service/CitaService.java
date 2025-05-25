package com.example.proyecto_2_backend.service;

import com.example.proyecto_2_backend.model.Medico;
import com.example.proyecto_2_backend.model.Cita;
import com.example.proyecto_2_backend.repository.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class CitaService {
    @Autowired
    private CitaRepository citaRepository;

    public CitaService(CitaRepository citaRepository) {
        this.citaRepository = citaRepository;
    }

    public void agendarCita(Cita cita){
        citaRepository.save(cita);
    }

    public List<Cita> obtenerCitasPorUsuario(String usuarioId) {
        return citaRepository.findByUsuarioId(usuarioId);
    }

    public Cita obtenerCitaPorId(String id){
        return citaRepository.findById(id).get();
    }

    public void actualizarCita(Cita cita) {
        Cita citaExistente = citaRepository.findById(String.valueOf(cita.getId()))
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con ID: " + cita.getId()));
        citaExistente.setStatus(cita.getStatus());
        citaExistente.setMedico(cita.getMedico());
        citaExistente.setUsuario(cita.getUsuario());
        citaExistente.setFecha(cita.getFecha());
        citaExistente.setHora(cita.getHora());

        citaRepository.save(citaExistente);
    }

    public Iterable<Cita> obtenerCitasPorMedico(String id) {
        return citaRepository.findByMedicoId(id);
    }

    public List<LocalTime> obtenerHorariosOcupados(Medico medico, LocalDate fecha) {
        return citaRepository.findOcupadosByMedicoAndFecha(medico, fecha);
    }

    public Iterable<Cita> filtroHistorialPaciente(String status, String id, String idpaciente) {
        if (id != null && !id.isEmpty()) {
            if (status != null && !status.isEmpty()) {
                return citaRepository.findByStatusAndMedicoId(status, id);
            }
            return citaRepository.findByMedicoId(id);
        }

        if (status != null && !status.isEmpty()) {
            return citaRepository.findByStatus(status);
        }

        return citaRepository.findByUsuarioId(idpaciente);
    }

    public Iterable<Cita> filtroHistorialMedico(String status, String userid, String idDoctor) {

        if (userid != null && !userid.isEmpty()) {
            if (status != null && !status.isEmpty()) {
                return citaRepository.findByStatusAndUsuarioId(status, userid);
            }
            return citaRepository.findByUsuarioId(userid);
        }

        if (status != null && !status.isEmpty()) {
            return citaRepository.findByStatus(status);
        }

        return citaRepository.findByMedicoId(idDoctor);
    }
}
