package com.aiplantanalyze.controller;

import com.aiplantanalyze.model.User;
import com.aiplantanalyze.repository.UserRepository;
import com.aiplantanalyze.security.AuthService;
import com.aiplantanalyze.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthService authService;

    public AuthController(UserRepository userRepository,
                          BCryptPasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          AuthService authService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authService = authService;
    }

    @PostMapping({"/register", "/signup"})
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");

            if (username == null || email == null || password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Username, email, and password are required"));
            }

            Optional<User> existing = userRepository.findByEmailOrUsername(email, username);
            if (existing.isPresent()) {
                User user = existing.get();
                if (email.equals(user.getEmail())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("message", "Email already in use"));
                }
                if (username.equals(user.getUsername())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("message", "Username already taken"));
                }
            }

            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode(password));
            newUser = userRepository.save(newUser);

            Map<String, Object> response = buildUserResponse(newUser);
            response.put("token", jwtUtil.generateToken(newUser.getId()));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            if (email == null || password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email and password are required"));
            }

            Optional<User> optionalUser = userRepository.findByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }

            User user = optionalUser.get();
            if (!passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }

            Map<String, Object> response = buildUserResponse(user);
            response.put("token", jwtUtil.generateToken(user.getId()));
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        try {
            User user = authService.getRequiredUser(request);
            return ResponseEntity.ok(buildUserResponse(user));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(HttpServletRequest request,
                                           @RequestBody Map<String, Object> updates) {
        try {
            User user = authService.getRequiredUser(request);
            if (updates.containsKey("username")) {
                user.setUsername((String) updates.get("username"));
            }
            if (updates.containsKey("email")) {
                user.setEmail((String) updates.get("email"));
            }
            if (updates.containsKey("location")) {
                user.setLocation((String) updates.get("location"));
            }
            if (updates.containsKey("bio")) {
                user.setBio((String) updates.get("bio"));
            }
            if (updates.containsKey("preferences")) {
                Object preferencesValue = updates.get("preferences");
                if (preferencesValue instanceof Map<?, ?> preferences) {
                    if (preferences.containsKey("notifications")) {
                        Object notificationsValue = preferences.get("notifications");
                        if (notificationsValue instanceof Boolean boolValue) {
                            user.getPreferences().setNotifications(boolValue);
                        }
                    }
                    if (preferences.containsKey("darkMode")) {
                        Object darkModeValue = preferences.get("darkMode");
                        if (darkModeValue instanceof Boolean boolValue) {
                            user.getPreferences().setDarkMode(boolValue);
                        }
                    }
                    if (preferences.containsKey("language")) {
                        Object languageValue = preferences.get("language");
                        if (languageValue instanceof String language) {
                            user.getPreferences().setLanguage(language);
                        }
                    }
                }
            }
            if (updates.containsKey("stats")) {
                Object statsValue = updates.get("stats");
                if (statsValue instanceof Map<?, ?> stats) {
                    if (stats.containsKey("scans")) {
                        Object scansValue = stats.get("scans");
                        if (scansValue instanceof Number scansNumber) {
                            user.getStats().setScans(scansNumber.intValue());
                        }
                    }
                    if (stats.containsKey("plants")) {
                        Object plantsValue = stats.get("plants");
                        if (plantsValue instanceof Number plantsNumber) {
                            user.getStats().setPlants(plantsNumber.intValue());
                        }
                    }
                    if (stats.containsKey("badges")) {
                        Object badgesValue = stats.get("badges");
                        if (badgesValue instanceof Number badgesNumber) {
                            user.getStats().setBadges(badgesNumber.intValue());
                        }
                    }
                }
            }
            if (updates.containsKey("password")) {
                user.setPassword(passwordEncoder.encode((String) updates.get("password")));
            }
            user.setUpdatedAt(new java.util.Date());
            User updatedUser = userRepository.save(user);
            Map<String, Object> response = buildUserResponse(updatedUser);
            response.put("token", jwtUtil.generateToken(updatedUser.getId()));
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    private Map<String, Object> buildUserResponse(User user) {
        Map<String, Object> userData = new HashMap<>();
        userData.put("_id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("location", user.getLocation());
        userData.put("bio", user.getBio());
        userData.put("joinDate", user.getJoinDate());
        userData.put("preferences", user.getPreferences());
        userData.put("stats", user.getStats());
        userData.put("createdAt", user.getCreatedAt());
        userData.put("updatedAt", user.getUpdatedAt());
        return userData;
    }
}
