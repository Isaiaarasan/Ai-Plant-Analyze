package com.aiplantanalyze.controller;

import com.aiplantanalyze.model.Scan;
import com.aiplantanalyze.model.ScanResult;
import com.aiplantanalyze.model.User;
import com.aiplantanalyze.repository.ScanRepository;
import com.aiplantanalyze.security.AuthService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.image.ImageResult;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.Base64;

@RestController
@RequestMapping("/api/detect")
public class DetectController {

    private final ScanRepository scanRepository;
    private final AuthService authService;

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private OpenAiService openAiService;

    public DetectController(ScanRepository scanRepository,
                            AuthService authService) {
        this.scanRepository = scanRepository;
        this.authService = authService;
    }

    private OpenAiService getOpenAiService() {
        if (openAiService == null && openAiApiKey != null && !openAiApiKey.equals("your_openai_api_key_here")) {
            try {
                System.out.println("Initializing OpenAI service with API key: " + openAiApiKey.substring(0, 10) + "...");
                openAiService = new OpenAiService(openAiApiKey);
                System.out.println("OpenAI service initialized successfully");
            } catch (Exception e) {
                System.err.println("Failed to initialize OpenAI service: " + e.getMessage());
                e.printStackTrace();
                openAiService = null;
            }
        }
        return openAiService;
    }

    @PostMapping
    public ResponseEntity<?> detectDisease(HttpServletRequest request,
                                           @RequestParam("image") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "No image file provided"));
            }

            User user = authService.getOptionalUser(request).orElse(null);
            Path uploadDir = Paths.get("uploads");
            Files.createDirectories(uploadDir);
            String extension = Optional.ofNullable(file.getOriginalFilename())
                    .filter(name -> name.contains("."))
                    .map(name -> name.substring(name.lastIndexOf('.')))
                    .orElse(".jpg");
            String filename = "image-" + System.currentTimeMillis() + "-" + UUID.randomUUID() + extension;
            Path filePath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            String imageUrl = "/uploads/" + filename;

            Map<String, Object> result = identifyDisease(filePath);
            Scan scan = new Scan();
            scan.setUserId(user != null ? user.getId() : null);
            scan.setImageUrl(imageUrl);
            ScanResult scanResult = new ScanResult();
            scanResult.setDisease((String) result.get("disease"));
            scanResult.setConfidence((Integer) result.get("confidence"));
            scanResult.setSeverity((String) result.get("severity"));
            scanResult.setHealthScore((Integer) result.get("healthScore"));
            scanResult.setTreatment((String) result.get("treatment"));
            scanResult.setPrevention((String) result.get("prevention"));
            scan.setResult(scanResult);
            scan.setDate(new Date());
            scanRepository.save(scan);

            Map<String, Object> response = new HashMap<>(result);
            response.put("id", scan.getId());
            response.put("date", scan.getDate());
            response.put("imageUrl", scan.getImageUrl());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error detecting plant disease", "error", ex.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getScanHistory(HttpServletRequest request) {
        try {
            User user = authService.getRequiredUser(request);
            List<Scan> scans = scanRepository.findByUserIdOrderByDateDesc(user.getId());
            List<Map<String, Object>> result = new ArrayList<>();
            for (Scan scan : scans) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", scan.getId());
                item.put("date", scan.getDate());
                item.put("imageUrl", scan.getImageUrl());
                item.put("disease", scan.getResult().getDisease());
                item.put("confidence", scan.getResult().getConfidence());
                item.put("severity", scan.getResult().getSeverity());
                item.put("healthScore", scan.getResult().getHealthScore());
                item.put("treatment", scan.getResult().getTreatment());
                item.put("prevention", scan.getResult().getPrevention());
                result.add(item);
            }
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching scan history", "error", ex.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getScanById(HttpServletRequest request, @PathVariable String id) {
        try {
            User user = authService.getRequiredUser(request);
            Optional<Scan> scanOptional = scanRepository.findById(id);
            if (scanOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Scan not found"));
            }
            Scan scan = scanOptional.get();
            if (scan.getUserId() != null && !scan.getUserId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Unauthorized access to this scan"));
            }
            Map<String, Object> response = new HashMap<>();
            response.put("id", scan.getId());
            response.put("date", scan.getDate());
            response.put("imageUrl", scan.getImageUrl());
            response.put("disease", scan.getResult().getDisease());
            response.put("confidence", scan.getResult().getConfidence());
            response.put("severity", scan.getResult().getSeverity());
            response.put("healthScore", scan.getResult().getHealthScore());
            response.put("treatment", scan.getResult().getTreatment());
            response.put("prevention", scan.getResult().getPrevention());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching scan details", "error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteScan(HttpServletRequest request, @PathVariable String id) {
        try {
            User user = authService.getRequiredUser(request);
            Optional<Scan> scanOptional = scanRepository.findById(id);
            if (scanOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Scan not found"));
            }
            Scan scan = scanOptional.get();
            if (scan.getUserId() != null && !scan.getUserId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Unauthorized access to delete this scan"));
            }
            if (scan.getImageUrl() != null && scan.getImageUrl().startsWith("/uploads/")) {
                Path filePath = Paths.get("uploads", scan.getImageUrl().replaceFirst("/uploads/", ""));
                Files.deleteIfExists(filePath);
            }
            scanRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Scan deleted successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting scan", "error", ex.getMessage()));
        }
    }

    private Map<String, Object> identifyDisease(Path imagePath) throws IOException {
        System.out.println("Starting image analysis for file: " + imagePath.toString());

        // Check if OpenAI service is available
        if (getOpenAiService() == null) {
            throw new RuntimeException("OpenAI service is not available. Please check your API key configuration.");
        }

        try {
            System.out.println("Reading image file...");
            // Read image file and convert to base64
            byte[] imageBytes = Files.readAllBytes(imagePath);
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String mimeType = Files.probeContentType(imagePath);
            if (mimeType == null) {
                mimeType = "image/jpeg"; // default
            }

            System.out.println("Image converted to base64, size: " + base64Image.length() + " characters, MIME type: " + mimeType);

            // Create the prompt for plant disease analysis
            String prompt = "Analyze this plant image and identify any diseases, pests, or health issues. " +
                    "Provide a detailed analysis including:\n" +
                    "1. Disease/Pest name (if any)\n" +
                    "2. Confidence level (0-100%)\n" +
                    "3. Severity level (low/medium/high)\n" +
                    "4. Health score (0-100, where 100 is perfectly healthy)\n" +
                    "5. Treatment recommendations\n" +
                    "6. Prevention measures\n" +
                    "If the plant appears healthy, indicate that clearly.\n" +
                    "Format your response as JSON with keys: disease, confidence, severity, healthScore, treatment, prevention";

            System.out.println("Creating OpenAI chat request...");
            // Create chat messages for vision API
            List<ChatMessage> messages = new ArrayList<>();
            messages.add(new ChatMessage(ChatMessageRole.USER.value(),
                    prompt + "\n\n![plant image](data:" + mimeType + ";base64," + base64Image + ")"));

            // Create chat completion request
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model("gpt-4o")
                    .messages(messages)
                    .maxTokens(1000)
                    .temperature(0.1)
                    .build();

            System.out.println("Sending request to OpenAI...");
            // Get response from OpenAI
            var response = getOpenAiService().createChatCompletion(request);
            String content = response.getChoices().get(0).getMessage().getContent();

            System.out.println("Received response from OpenAI: " + content.substring(0, Math.min(200, content.length())) + "...");

            // Parse the JSON response
            Map<String, Object> result = parseAnalysisResponse(content);

            System.out.println("Analysis completed successfully");
            return result;

        } catch (Exception e) {
            System.err.println("Failed to analyze image with OpenAI: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to analyze image with OpenAI: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> parseAnalysisResponse(String content) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Simple parsing - in production, use a JSON parser
            String lowerContent = content.toLowerCase();

            // Extract disease name
            if (lowerContent.contains("healthy") && !lowerContent.contains("disease")) {
                result.put("disease", "Healthy Plant");
                result.put("confidence", 95);
                result.put("severity", "low");
                result.put("healthScore", 95);
                result.put("treatment", "No treatment needed. Continue proper care.");
                result.put("prevention", "Maintain proper watering, sunlight, and soil conditions.");
            } else {
                // Try to extract disease information
                String disease = extractValue(content, "disease", "Unknown Disease");
                int confidence = extractConfidence(content);
                String severity = extractSeverity(content);
                int healthScore = extractHealthScore(content);
                String treatment = extractValue(content, "treatment", "Consult a plant specialist for treatment options.");
                String prevention = extractValue(content, "prevention", "Practice good plant care and monitoring.");

                result.put("disease", disease);
                result.put("confidence", confidence);
                result.put("severity", severity);
                result.put("healthScore", healthScore);
                result.put("treatment", treatment);
                result.put("prevention", prevention);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse OpenAI response: " + e.getMessage(), e);
        }

        return result;
    }

    private String extractValue(String content, String key, String defaultValue) {
        try {
            String lowerContent = content.toLowerCase();
            int keyIndex = lowerContent.indexOf(key.toLowerCase());
            if (keyIndex == -1) return defaultValue;

            int colonIndex = content.indexOf(":", keyIndex);
            if (colonIndex == -1) return defaultValue;

            int endIndex = content.indexOf("\n", colonIndex);
            if (endIndex == -1) endIndex = content.length();

            String value = content.substring(colonIndex + 1, endIndex).trim();
            return value.isEmpty() ? defaultValue : value;
        } catch (Exception e) {
            return defaultValue;
        }
    }

    private int extractConfidence(String content) {
        try {
            // Look for percentage patterns
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(\\d+)%");
            java.util.regex.Matcher matcher = pattern.matcher(content);
            if (matcher.find()) {
                return Integer.parseInt(matcher.group(1));
            }
            return 80; // default
        } catch (Exception e) {
            return 80;
        }
    }

    private String extractSeverity(String content) {
        String lowerContent = content.toLowerCase();
        if (lowerContent.contains("high") || lowerContent.contains("severe")) return "high";
        if (lowerContent.contains("medium") || lowerContent.contains("moderate")) return "medium";
        return "low";
    }

    private int extractHealthScore(String content) {
        try {
            // Look for health score patterns
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("health score.*?(\\d+)", java.util.regex.Pattern.CASE_INSENSITIVE);
            java.util.regex.Matcher matcher = pattern.matcher(content);
            if (matcher.find()) {
                return Integer.parseInt(matcher.group(1));
            }
            // Estimate based on severity
            String severity = extractSeverity(content);
            switch (severity) {
                case "high": return 60;
                case "medium": return 75;
                default: return 90;
            }
        } catch (Exception e) {
            return 80;
        }
    }
}
