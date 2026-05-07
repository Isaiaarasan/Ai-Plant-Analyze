package com.aiplantanalyze.repository;

import com.aiplantanalyze.model.Scan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ScanRepository extends MongoRepository<Scan, String> {
    List<Scan> findByUserIdOrderByDateDesc(String userId);
    void deleteByUserId(String userId);
}
