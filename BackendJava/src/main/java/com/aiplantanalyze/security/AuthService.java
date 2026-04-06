package com.aiplantanalyze.security;

import com.aiplantanalyze.model.User;
import com.aiplantanalyze.repository.UserRepository;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;

@Service
public class AuthService {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthService(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    public User getRequiredUser(HttpServletRequest request) {
        Optional<User> user = getUserFromRequest(request);
        return user.orElseThrow(() -> new IllegalArgumentException("No token, authorization denied"));
    }

    public Optional<User> getOptionalUser(HttpServletRequest request) {
        return getUserFromRequest(request);
    }

    private Optional<User> getUserFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return Optional.empty();
        }

        String token = authorizationHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            return Optional.empty();
        }

        String userId = jwtUtil.getUserIdFromJwt(token);
        return userRepository.findById(userId);
    }
}
