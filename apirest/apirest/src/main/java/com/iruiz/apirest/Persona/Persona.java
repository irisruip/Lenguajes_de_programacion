package com.iruiz.apirest.Persona;

import jakarta.persistence.Basic;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data//getters y setters
@AllArgsConstructor//constructor
@NoArgsConstructor//constructor vacio
@Entity
public class Persona {
    @Id
    @GeneratedValue
    private Integer id;
    @Basic
    private String primerNombre;
    private String apellido;
    private String email;
}
