package com.aiplantanalyze.repository;

import com.aiplantanalyze.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
}
