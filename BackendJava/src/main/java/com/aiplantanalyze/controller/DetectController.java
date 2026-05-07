package com.aiplantanalyze.controller;

import com.aiplantanalyze.model.Scan;
import com.aiplantanalyze.model.ScanResult;
import com.aiplantanalyze.model.User;
import com.aiplantanalyze.repository.ScanRepository;
import com.aiplantanalyze.security.AuthService;
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
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;

@RestController
@RequestMapping("/api/detect")
public class DetectController {

    private final ScanRepository scanRepository;
    private final AuthService authService;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.model}")
    private String groqModel;

    public DetectController(ScanRepository scanRepository,
                            AuthService authService) {
        this.scanRepository = scanRepository;
        this.authService = authService;
    }

    // Groq AI Analysis using RestTemplate for custom endpoint compatibility
    private Map<String, Object> analyzeWithGroqAI(Path imagePath, Map<String, Object> localAnalysis) {
        try {
            System.out.println("Initializing Groq AI analysis for plant disease...");
            byte[] imageBytes = Files.readAllBytes(imagePath);
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String mimeType = Files.probeContentType(imagePath);
            if (mimeType == null) mimeType = "image/jpeg";

            // Prepare the prompt
            String promptText = "Act as an Expert Plant Pathologist. Analyze this plant image. " +
                    "Local pixel analysis suggests: " + localAnalysis.get("observations") + "\n" +
                    "Provide a scientific diagnosis with high accuracy including:\n" +
                    "1. Specific Disease/Pest name\n" +
                    "2. Confidence level (0-100%)\n" +
                    "3. Severity (low/medium/high)\n" +
                    "4. Health score (0-100)\n" +
                    "5. Organic and chemical treatment recommendations\n" +
                    "6. Long-term prevention strategy\n" +
                    "Format your response as a valid JSON with keys: disease, confidence, severity, healthScore, treatment, prevention";

            // Build request for Groq (OpenAI-compatible vision format)
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", groqModel);
            
            List<Map<String, Object>> messages = new ArrayList<>();
            Map<String, Object> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            
            List<Map<String, Object>> contents = new ArrayList<>();
            contents.add(Map.of("type", "text", "text", promptText));
            contents.add(Map.of("type", "image_url", "image_url", Map.of("url", "data:" + mimeType + ";base64," + base64Image)));
            
            userMessage.put("content", contents);
            messages.add(userMessage);
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.2);
            requestBody.put("max_tokens", 800);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + groqApiKey);

            org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(requestBody, headers);
            
            System.out.println("Sending request to Groq API at: " + groqApiUrl);
            org.springframework.http.ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    groqApiUrl + "/chat/completions",
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object choicesObject = response.getBody().get("choices");
                if (choicesObject instanceof List<?>) {
                    List<?> choices = (List<?>) choicesObject;
                    if (!choices.isEmpty() && choices.get(0) instanceof Map<?, ?>) {
                        Object messageObject = ((Map<?, ?>) choices.get(0)).get("message");
                        if (messageObject instanceof Map<?, ?>) {
                            Object contentObject = ((Map<?, ?>) messageObject).get("content");
                            if (contentObject instanceof String) {
                                String content = (String) contentObject;
                                if (content.contains("```json")) {
                                    content = content.substring(content.indexOf("```json") + 7, content.lastIndexOf("```")).trim();
                                } else if (content.contains("```")) {
                                    content = content.substring(content.indexOf("```") + 3, content.lastIndexOf("```")).trim();
                                }
                                System.out.println("Groq AI analysis successful");
                                return parseAnalysisResponse(content);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Groq AI Analysis failed: " + e.getMessage());
            e.printStackTrace();
        }
        return localAnalysis;
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

        // 1. Perform Local Heuristic Analysis (The "Local ML" layer)
        Map<String, Object> localAnalysis = analyzeImagePixels(imagePath);
        System.out.println("Local pre-analysis results: " + localAnalysis);

        // 2. Try Python ML Service (Primary)
        try {
            System.out.println("Attempting Python ML analysis...");
            Map<String, Object> mlResult = analyzeWithPythonML(imagePath);
            if (mlResult != null && !mlResult.containsKey("error")) {
                System.out.println("Python ML analysis successful: " + mlResult.get("disease"));
                return mlResult;
            }
        } catch (Exception e) {
            System.err.println("Python ML analysis failed or unavailable: " + e.getMessage());
        }

        // 3. Perform Groq AI-based Deep Analysis (Fallback/Complementary)
        if (groqApiKey == null || groqApiKey.isEmpty()) {
            System.out.println("Groq API key not configured, proceeding with local analysis only.");
            return localAnalysis;
        }

        return analyzeWithGroqAI(imagePath, localAnalysis);
    }

    /**
     * Local "ML Model" Simulation: Heuristic Image Feature Extraction.
     * Analyzes pixel distributions to detect plant health markers.
     */
    private Map<String, Object> analyzeImagePixels(Path imagePath) {
        Map<String, Object> analysis = new HashMap<>();
        
        try {
            java.awt.image.BufferedImage img = javax.imageio.ImageIO.read(imagePath.toFile());
            if (img == null) throw new Exception("Could not read image for pixel analysis");

            int width = img.getWidth();
            int height = img.getHeight();
            long totalPixels = (long) width * height;
            
            long greenPixels = 0;
            long brownPixels = 0;
            long yellowPixels = 0;
            long darkPixels = 0;

            // Sample pixels for performance (1 in every 5)
            for (int x = 0; x < width; x += 5) {
                for (int y = 0; y < height; y += 5) {
                    int rgb = img.getRGB(x, y);
                    int r = (rgb >> 16) & 0xFF;
                    int g = (rgb >> 8) & 0xFF;
                    int b = (rgb) & 0xFF;

                    // Green detection (Healthy)
                    if (g > 100 && g > r && g > b) greenPixels++;
                    // Brown/Rust detection (Fungus/Death)
                    else if (r > 80 && g < 150 && b < 80 && r > g) brownPixels++;
                    // Yellowing/Chlorosis
                    else if (r > 150 && g > 150 && b < 100) yellowPixels++;
                    // Dark/Blight/Necrosis
                    else if (r < 50 && g < 50 && b < 50) darkPixels++;
                }
            }

            // Approximate percentages (multiplying by 25 because we sampled 1/5 of each dimension)
            double greenRatio = (double) greenPixels / (totalPixels / 25.0);
            double brownRatio = (double) brownPixels / (totalPixels / 25.0);
            double yellowRatio = (double) yellowPixels / (totalPixels / 25.0);
            double darkRatio = (double) darkPixels / (totalPixels / 25.0);
            
            int healthScore = (int) (greenRatio * 100);
            healthScore = Math.min(100, Math.max(10, healthScore)); // normalize

            StringBuilder observations = new StringBuilder();
            String disease = "Healthy Plant";
            String severity = "low";
            
            if (brownRatio > 0.15) {
                disease = "Late Blight / Rust Detected";
                severity = "high";
                observations.append("Significant necrotic brown tissue detected. ");
            } else if (darkRatio > 0.1) {
                disease = "Possible Blight / Necrosis";
                severity = "high";
                observations.append("Dark necrotic patches detected, indicating blight or necrosis. ");
            } else if (yellowRatio > 0.2) {
                disease = "Chlorosis / Nutrient Deficiency";
                severity = "medium";
                observations.append("Widespread yellowing indicates potential chlorosis. ");
            } else {
                observations.append("Surface primarily shows healthy green chlorophyll patterns. ");
            }

            analysis.put("disease", disease);
            analysis.put("healthScore", healthScore);
            analysis.put("confidence", 70); // Local confidence
            analysis.put("severity", severity);
            analysis.put("treatment", "Initial local observation completed. Connect to Cloud AI for specialized diagnosis.");
            analysis.put("prevention", "Maintain consistent moisture and monitor specialized fertilizer levels.");
            analysis.put("observations", observations.toString());

        } catch (Exception e) {
            analysis.put("disease", "Unknown (Pre-analysis Failed)");
            analysis.put("healthScore", 50);
            analysis.put("severity", "medium");
            analysis.put("observations", "Image analysis error: " + e.getMessage());
        }

        return analysis;
    }

    private Map<String, Object> parseAnalysisResponse(String content) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Primitive JSON parsing for robustness
            result.put("disease", extractJsonValue(content, "disease", "Healthy Plant"));
            result.put("confidence", extractJsonInt(content, "confidence", 85));
            result.put("severity", extractJsonValue(content, "severity", "low"));
            result.put("healthScore", extractJsonInt(content, "healthScore", 80));
            result.put("treatment", extractJsonValue(content, "treatment", "No specific treatment required."));
            result.put("prevention", extractJsonValue(content, "prevention", "Monitor plant daily."));
        } catch (Exception e) {
            System.err.println("JSON Parsing failed: " + e.getMessage());
            result.put("disease", "Parsing Error");
            result.put("healthScore", 0);
        }

        return result;
    }

    /**
     * Calls the external Python ML service to analyze the plant image.
     */
    private Map<String, Object> analyzeWithPythonML(Path imagePath) {
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            org.springframework.core.io.Resource imageResource = new org.springframework.core.io.FileSystemResource(imagePath.toFile());

            org.springframework.util.MultiValueMap<String, Object> body = new org.springframework.util.LinkedMultiValueMap<>();
            body.add("image", imageResource);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.MULTIPART_FORM_DATA);

            org.springframework.http.HttpEntity<org.springframework.util.MultiValueMap<String, Object>> requestEntity = 
                    new org.springframework.http.HttpEntity<>(body, headers);

            org.springframework.http.ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    mlServiceUrl,
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Error calling Python ML service: " + e.getMessage());
        }
        return null;
    }

    private String extractJsonValue(String json, String key, String defaultValue) {
        String pattern = "\"" + key + "\":\\s*\"(.*?)\"";
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile(pattern).matcher(json);
        if (matcher.find()) return matcher.group(1);
        return defaultValue;
    }

    private int extractJsonInt(String json, String key, int defaultValue) {
        String pattern = "\"" + key + "\":\\s*(\\d+)";
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile(pattern).matcher(json);
        if (matcher.find()) return Integer.parseInt(matcher.group(1));
        return defaultValue;
    }
}
