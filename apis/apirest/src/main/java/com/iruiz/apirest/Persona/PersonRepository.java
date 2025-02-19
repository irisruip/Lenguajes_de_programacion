package com.iruiz.apirest.Persona;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface PersonRepository extends JpaRepository <Persona, Integer> {

}
