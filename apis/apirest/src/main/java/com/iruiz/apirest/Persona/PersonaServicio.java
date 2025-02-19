package com.iruiz.apirest.Persona;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PersonaServicio {

    private final PersonRepository personRepo;
    
    public void createPersona(Persona persona) {
        personRepo.save(persona);
    }
}
