package com.aiplantanalyze.controller;

import com.aiplantanalyze.model.Disease;
import com.aiplantanalyze.repository.DiseaseRepository;
import com.aiplantanalyze.security.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("/api/solutions")
public class SolutionsController {

    private final DiseaseRepository diseaseRepository;
    private final AuthService authService;

    public SolutionsController(DiseaseRepository diseaseRepository, AuthService authService) {
        this.diseaseRepository = diseaseRepository;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getAllDiseases(HttpServletRequest request) {
        try {
            authService.getRequiredUser(request);
            List<Disease> diseases = diseaseRepository.findAll();
            if (diseases.isEmpty()) {
                return ResponseEntity.ok(getMockDiseasesList());
            }
            List<Map<String, Object>> response = new ArrayList<>();
            for (Disease disease : diseases) {
                Map<String, Object> item = new HashMap<>();
                item.put("name", disease.getName());
                item.put("severity", disease.getSeverity());
                response.add(item);
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @GetMapping("/{diseaseName}")
    public ResponseEntity<?> getSolutionsByDisease(HttpServletRequest request,
                                                   @PathVariable String diseaseName) {
        try {
            authService.getRequiredUser(request);
            Optional<Disease> optionalDisease = diseaseRepository.findByNameIgnoreCase(diseaseName);
            if (optionalDisease.isPresent()) {
                return ResponseEntity.ok(optionalDisease.get());
            }
            return ResponseEntity.ok(getMockSolutions(diseaseName));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    private Map<String, Object> getMockSolutions(String diseaseName) {
        String lowerCaseName = diseaseName.toLowerCase(Locale.ROOT);
        Map<String, Object> defaultSolution = Map.of(
                "name", diseaseName,
                "scientificName", "Unknown",
                "description", "We don't have specific information about this plant condition in our database.",
                "symptoms", List.of("Symptoms may vary"),
                "causes", "Various factors could contribute to this condition.",
                "treatment", "Consult with a local plant expert or extension service for specific advice. In general, remove affected parts and improve plant care practices.",
                "prevention", "Maintain good plant health through proper watering, fertilization, and pest management.",
                "severity", "unknown"
        );

        Map<String, Map<String, Object>> mockDiseases = new HashMap<>();
        mockDiseases.put("powdery mildew", Map.of(
                "name", "Powdery Mildew",
                "scientificName", "Erysiphales",
                "description", "Powdery mildew is a fungal disease that affects a wide range of plants. It appears as a white to gray powdery growth on leaf surfaces, stems, and sometimes fruit.",
                "symptoms", List.of("White or gray powdery spots on leaves and stems", "Distorted or stunted growth", "Yellowing leaves that may die prematurely", "Reduced yield and quality of fruits or flowers"),
                "causes", "Powdery mildew fungi thrive in environments with high humidity and moderate temperatures. Unlike many fungal pathogens, they don't require standing water to germinate and infect plants.",
                "treatment", "Apply fungicides containing sulfur, neem oil, or potassium bicarbonate. For organic options, try a mixture of baking soda, liquid soap, and water as a spray. Remove and destroy heavily infected plant parts.",
                "prevention", "Plant resistant varieties when available. Ensure good air circulation by proper spacing and pruning. Avoid overhead watering and water in the morning so plants can dry during the day. Keep the growing area clean of plant debris.",
                "severity", "medium"
        ));
        mockDiseases.put("leaf spot", Map.of(
                "name", "Leaf Spot",
                "scientificName", "Various fungi and bacteria",
                "description", "Leaf spot is a common term for a group of diseases affecting plants, characterized by spots on foliage. The diseases are caused by various fungi and bacteria.",
                "symptoms", List.of("Spots on leaves that may be brown, black, tan, or red", "Spots may have a yellow halo", "Severely affected leaves may yellow and drop prematurely", "In severe cases, the plant may be defoliated"),
                "causes", "Leaf spot diseases are typically caused by fungi or bacteria that thrive in wet, humid conditions. Spores are spread by wind, water, insects, or gardening tools.",
                "treatment", "Remove and destroy infected leaves. Apply appropriate fungicides or bactericides depending on the specific pathogen. Copper-based products can be effective for many leaf spot diseases.",
                "prevention", "Avoid overhead watering. Ensure adequate spacing between plants for good air circulation. Practice crop rotation. Keep the garden clean of debris. Use disease-free seeds and plants.",
                "severity", "medium"
        ));
        mockDiseases.put("rust", Map.of(
                "name", "Rust",
                "scientificName", "Pucciniales",
                "description", "Rust is a fungal disease that affects many plants, characterized by rusty-colored spots on leaves and stems.",
                "symptoms", List.of("Orange, yellow, or brown pustules on leaves, stems, or fruit", "Pustules release powdery spores when touched", "Distorted growth or withering of affected parts", "Premature leaf drop in severe infections"),
                "causes", "Rust fungi require living plant tissue to grow. They thrive in humid conditions and moderate temperatures.",
                "treatment", "Remove and destroy infected plant parts. Apply fungicides containing sulfur, copper, or specific synthetic fungicides labeled for rust control. Begin treatment at the first sign of disease.",
                "prevention", "Choose resistant varieties when available. Avoid wetting the foliage when watering. Ensure good air circulation. Remove alternate host plants if applicable. Practice crop rotation.",
                "severity", "medium"
        ));
        mockDiseases.put("blight", Map.of(
                "name", "Blight",
                "scientificName", "Various fungi and bacteria",
                "description", "Blight is a general term for a rapid and severe disease that affects plants, typically causing sudden wilting and death of foliage, flowers, and stems.",
                "symptoms", List.of("Rapid browning and death of leaves, stems, or flowers", "Water-soaked spots that enlarge quickly", "Wilting despite adequate soil moisture", "Dark, sunken cankers on stems or fruit"),
                "causes", "Blight can be caused by various fungi and bacteria. Many blight pathogens thrive in cool, wet conditions and can spread rapidly during rainy periods.",
                "treatment", "Remove and destroy infected plant parts. Apply appropriate fungicides or bactericides depending on the specific pathogen. Copper-based products can help prevent bacterial blights.",
                "prevention", "Use disease-resistant varieties when available. Ensure good air circulation. Avoid overhead watering. Practice crop rotation. Remove plant debris at the end of the growing season.",
                "severity", "high"
        ));
        mockDiseases.put("aphids", Map.of(
                "name", "Aphids",
                "scientificName", "Aphidoidea",
                "description", "Aphids are small sap-sucking insects that can cause significant damage to plants. They often cluster on new growth and the undersides of leaves.",
                "symptoms", List.of("Curled, stunted, or yellowing leaves", "Sticky honeydew on leaves or ground", "Black sooty mold growing on honeydew", "Presence of small, pear-shaped insects on plants"),
                "causes", "Aphids reproduce rapidly in warm weather. They are often attracted to plants with soft new growth or those stressed by drought or improper fertilization.",
                "treatment", "Spray plants with strong water jets to dislodge aphids. Apply insecticidal soap, neem oil, or horticultural oil. For severe infestations, consider systemic insecticides.",
                "prevention", "Encourage beneficial insects like ladybugs and lacewings. Avoid excessive nitrogen fertilization which promotes soft, attractive growth. Use reflective mulches to confuse aphids.",
                "severity", "medium"
        ));
        mockDiseases.put("healthy", Map.of(
                "name", "Healthy Plant",
                "scientificName", "N/A",
                "description", "Your plant appears to be healthy with no signs of disease or pest infestation.",
                "symptoms", List.of("No symptoms of disease or pest damage detected"),
                "causes", "N/A",
                "treatment", "No treatment needed. Continue with regular plant care practices.",
                "prevention", "Maintain good gardening practices: proper watering, appropriate fertilization, adequate spacing, and regular monitoring for early detection of any issues.",
                "severity", "low"
        ));

        for (Map.Entry<String, Map<String, Object>> entry : mockDiseases.entrySet()) {
            if (entry.getKey().contains(lowerCaseName) || lowerCaseName.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return defaultSolution;
    }

    private List<Map<String, Object>> getMockDiseasesList() {
        return List.of(
                Map.of("name", "Powdery Mildew", "severity", "medium"),
                Map.of("name", "Leaf Spot", "severity", "medium"),
                Map.of("name", "Rust", "severity", "medium"),
                Map.of("name", "Blight", "severity", "high"),
                Map.of("name", "Aphids", "severity", "medium"),
                Map.of("name", "Spider Mites", "severity", "medium"),
                Map.of("name", "Root Rot", "severity", "high"),
                Map.of("name", "Downy Mildew", "severity", "medium"),
                Map.of("name", "Bacterial Wilt", "severity", "high"),
                Map.of("name", "Mosaic Virus", "severity", "high")
        );
    }
}
