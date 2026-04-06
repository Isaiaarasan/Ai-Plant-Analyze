package com.aiplantanalyze.repository;

import com.aiplantanalyze.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String> {
}
