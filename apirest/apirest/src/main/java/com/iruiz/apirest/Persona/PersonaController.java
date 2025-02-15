package com.iruiz.apirest.Persona;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/persona")
@RequiredArgsConstructor
public class PersonaController {

    private final PersonaServicio personaServicio;

    @PostMapping
    public void createPersona(@RequestBody Persona persona) {
        personaServicio.createPersona(persona);
    }
}
