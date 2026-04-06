package com.aiplantanalyze.repository;

import com.aiplantanalyze.model.Disease;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DiseaseRepository extends MongoRepository<Disease, String> {
    Optional<Disease> findByNameIgnoreCase(String name);
}
