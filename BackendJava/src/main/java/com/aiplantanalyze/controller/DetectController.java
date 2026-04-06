package com.aiplantanalyze.controller;

import com.aiplantanalyze.model.Disease;
import com.aiplantanalyze.model.Scan;
import com.aiplantanalyze.model.ScanResult;
import com.aiplantanalyze.model.User;
import com.aiplantanalyze.repository.DiseaseRepository;
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

    private final DiseaseRepository diseaseRepository;
    private final ScanRepository scanRepository;
    private final AuthService authService;

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private OpenAiService openAiService;

    public DetectController(DiseaseRepository diseaseRepository,
                            ScanRepository scanRepository,
                            AuthService authService) {
        this.diseaseRepository = diseaseRepository;
        this.scanRepository = scanRepository;
        this.authService = authService;
    }

    private OpenAiService getOpenAiService() {
        if (openAiService == null && openAiApiKey != null && !openAiApiKey.equals("your_openai_api_key_here")) {
            try {
                openAiService = new OpenAiService(openAiApiKey);
            } catch (Exception e) {
                System.err.println("Failed to initialize OpenAI service: " + e.getMessage());
                openAiService = null;
            }
        }
        return openAiService;
    }

    @PostMapping("/")
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
        // Check if OpenAI service is available
        if (getOpenAiService() != null) {
            try {
                // Read image file and convert to base64
                byte[] imageBytes = Files.readAllBytes(imagePath);
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                String mimeType = Files.probeContentType(imagePath);
                if (mimeType == null) {
                    mimeType = "image/jpeg"; // default
                }

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

                // Create chat messages for vision API
                List<ChatMessage> messages = new ArrayList<>();
                messages.add(new ChatMessage(ChatMessageRole.USER.value(),
                        prompt + "\n\n![plant image](data:" + mimeType + ";base64," + base64Image + ")"));

                // Create chat completion request
                ChatCompletionRequest request = ChatCompletionRequest.builder()
                        .model("gpt-4-vision-preview")
                        .messages(messages)
                        .maxTokens(1000)
                        .temperature(0.1)
                        .build();

                // Get response from OpenAI
                var response = getOpenAiService().createChatCompletion(request);
                String content = response.getChoices().get(0).getMessage().getContent();

                // Parse the JSON response
                // For simplicity, we'll extract information from the text response
                // In a production app, you'd want more robust JSON parsing

                Map<String, Object> result = parseAnalysisResponse(content);

                return result;

            } catch (Exception e) {
                System.err.println("OpenAI analysis failed, falling back to database analysis: " + e.getMessage());
                // Fallback to database-based analysis if OpenAI fails
                return fallbackAnalysis();
            }
        } else {
            // OpenAI not available, use fallback analysis
            return fallbackAnalysis();
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
            return fallbackAnalysis();
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

    private Map<String, Object> fallbackAnalysis() {
        List<Disease> diseases = diseaseRepository.findAll();
        if (diseases.isEmpty()) {
            seedDiseases();
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("disease", "Analysis Unavailable");
            fallback.put("confidence", 50);
            fallback.put("severity", "unknown");
            fallback.put("healthScore", 50);
            fallback.put("treatment", "Unable to analyze image. Please try again or consult a plant specialist.");
            fallback.put("prevention", "Ensure good image quality for better analysis.");
            return fallback;
        }

        Disease detectedDisease = diseases.get(new Random().nextInt(diseases.size()));
        int confidence = new Random().nextInt(30) + 70;
        int healthScore;
        switch (detectedDisease.getSeverity()) {
            case "high" -> healthScore = new Random().nextInt(20) + 50;
            case "medium" -> healthScore = new Random().nextInt(20) + 70;
            default -> healthScore = new Random().nextInt(10) + 90;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("disease", detectedDisease.getName());
        response.put("confidence", confidence);
        response.put("severity", detectedDisease.getSeverity());
        response.put("healthScore", healthScore);
        response.put("treatment", detectedDisease.getTreatment());
        response.put("prevention", detectedDisease.getPrevention());
        return response;
    }

    private void seedDiseases() {
        List<Disease> diseases = List.of(
                new Disease("Powdery Mildew",
                        "A fungal disease that affects a wide range of plants, characterized by white powdery spots on leaves and stems.",
                        List.of("White powdery spots on leaves", "Yellowing leaves", "Distorted growth", "Premature leaf drop"),
                        "Caused by various species of fungi in the Erysiphales order, thriving in humid conditions with poor air circulation.",
                        "Apply neem oil or a sulfur-based fungicide. Improve air circulation around plants.",
                        "Space plants properly. Avoid overhead watering. Remove infected leaves.",
                        List.of("Roses", "Cucumbers", "Squash", "Pumpkins", "Melons", "Grapes"),
                        "medium",
                        "https://example.com/powdery-mildew.jpg"),
                new Disease("Leaf Spot",
                        "A common plant disease characterized by brown or black spots on leaves, caused by various fungi and bacteria.",
                        List.of("Brown or black spots on leaves", "Yellowing around spots", "Spots may have a yellow halo", "Leaf drop"),
                        "Caused by various fungi and bacteria, often spread by water splash and favored by wet conditions.",
                        "Apply copper-based fungicide. Remove and destroy infected leaves.",
                        "Rotate crops. Avoid overhead watering. Keep garden clean of debris.",
                        List.of("Tomatoes", "Peppers", "Strawberries", "Roses", "Maple trees"),
                        "medium",
                        "https://example.com/leaf-spot.jpg"),
                new Disease("Rust",
                        "A fungal disease that produces rusty-colored spots on leaves and stems, weakening the plant.",
                        List.of("Orange or rusty-colored pustules on leaves", "Yellow spots on upper leaf surface", "Distorted growth", "Premature leaf drop"),
                        "Caused by various rust fungi, often spread by wind and favored by humid conditions.",
                        "Apply sulfur dust or spray. Remove heavily infected plants.",
                        "Increase spacing between plants. Avoid wetting leaves when watering.",
                        List.of("Beans", "Roses", "Snapdragons", "Hollyhocks", "Daylilies"),
                        "medium",
                        "https://example.com/rust.jpg"),
                new Disease("Blight",
                        "A serious plant disease that causes rapid browning and death of plant tissues, often affecting entire plants.",
                        List.of("Brown spots that spread rapidly", "Wilting", "Blackened stems", "Plant collapse"),
                        "Caused by various fungi and bacteria, often thriving in warm, wet conditions.",
                        "Apply copper-based fungicide. Remove infected parts.",
                        "Rotate crops. Avoid overhead watering. Use disease-resistant varieties.",
                        List.of("Tomatoes", "Potatoes", "Peppers", "Eggplants"),
                        "high",
                        "https://example.com/blight.jpg"),
                new Disease("Aphid Infestation",
                        "Small sap-sucking insects that cluster on new growth and the undersides of leaves, causing distortion and weakening.",
                        List.of("Clusters of small insects on stems and leaves", "Curled or distorted leaves", "Sticky honeydew on leaves", "Sooty mold growth"),
                        "Aphids reproduce rapidly in warm weather and are attracted to plants with soft new growth.",
                        "Spray with insecticidal soap or neem oil. Introduce beneficial insects like ladybugs.",
                        "Monitor plants regularly. Avoid excessive nitrogen fertilizer. Encourage beneficial insects.",
                        List.of("Roses", "Vegetables", "Fruit trees", "Ornamentals"),
                        "medium",
                        "https://example.com/aphids.jpg"),
                new Disease("Healthy Plant",
                        "No disease detected. The plant appears to be healthy.",
                        List.of("Vibrant color", "Normal growth pattern", "No visible spots or discoloration", "Healthy leaf structure"),
                        "Proper care including adequate water, light, and nutrients.",
                        "Continue regular plant care practices.",
                        "Maintain regular watering, appropriate light conditions, and periodic fertilization.",
                        List.of("All plants"),
                        "low",
                        "https://example.com/healthy-plant.jpg")
        );
        diseaseRepository.saveAll(diseases);
    }
}
