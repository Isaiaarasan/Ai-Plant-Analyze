package com.aiplantanalyze.config;

import com.aiplantanalyze.model.Disease;
import com.aiplantanalyze.repository.DiseaseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final DiseaseRepository diseaseRepository;

    public DataSeeder(DiseaseRepository diseaseRepository) {
        this.diseaseRepository = diseaseRepository;
    }

    @Override
    public void run(String... args) {
        if (diseaseRepository.count() == 0) {
            List<Disease> diseases = Arrays.asList(
                    new Disease("Powdery Mildew",
                            "A fungal disease that affects a wide range of plants, characterized by white powdery spots on leaves and stems.",
                            Arrays.asList("White powdery spots on leaves", "Yellowing leaves", "Distorted growth", "Premature leaf drop"),
                            "Caused by various species of fungi in the Erysiphales order, thriving in humid conditions with poor air circulation.",
                            "Apply neem oil or a sulfur-based fungicide. Improve air circulation around plants.",
                            "Space plants properly. Avoid overhead watering. Remove infected leaves.",
                            Arrays.asList("Roses", "Cucumbers", "Squash", "Pumpkins", "Melons", "Grapes"),
                            "medium",
                            "https://example.com/powdery-mildew.jpg"),
                    new Disease("Leaf Spot",
                            "A common plant disease characterized by brown or black spots on leaves, caused by various fungi and bacteria.",
                            Arrays.asList("Brown or black spots on leaves", "Yellowing around spots", "Spots may have a yellow halo", "Leaf drop"),
                            "Caused by various fungi and bacteria, often spread by water splash and favored by wet conditions.",
                            "Apply copper-based fungicide. Remove and destroy infected leaves.",
                            "Rotate crops. Avoid overhead watering. Keep garden clean of debris.",
                            Arrays.asList("Tomatoes", "Peppers", "Strawberries", "Roses", "Maple trees"),
                            "medium",
                            "https://example.com/leaf-spot.jpg"),
                    new Disease("Rust",
                            "A fungal disease that produces rusty-colored spots on leaves and stems, weakening the plant.",
                            Arrays.asList("Orange or rusty-colored pustules on leaves", "Yellow spots on upper leaf surface", "Distorted growth", "Premature leaf drop"),
                            "Caused by various rust fungi, often spread by wind and favored by humid conditions.",
                            "Apply sulfur dust or spray. Remove heavily infected plants.",
                            "Increase spacing between plants. Avoid wetting leaves when watering.",
                            Arrays.asList("Beans", "Roses", "Snapdragons", "Hollyhocks", "Daylilies"),
                            "medium",
                            "https://example.com/rust.jpg"),
                    new Disease("Blight",
                            "A serious plant disease that causes rapid browning and death of plant tissues, often affecting entire plants.",
                            Arrays.asList("Brown spots that spread rapidly", "Wilting", "Blackened stems", "Plant collapse"),
                            "Caused by various fungi and bacteria, often thriving in warm, wet conditions.",
                            "Apply copper-based fungicide. Remove infected parts.",
                            "Rotate crops. Avoid overhead watering. Use disease-resistant varieties.",
                            Arrays.asList("Tomatoes", "Potatoes", "Peppers", "Eggplants"),
                            "high",
                            "https://example.com/blight.jpg"),
                    new Disease("Aphid Infestation",
                            "Small sap-sucking insects that cluster on new growth and the undersides of leaves, causing distortion and weakening.",
                            Arrays.asList("Clusters of small insects on stems and leaves", "Curled or distorted leaves", "Sticky honeydew on leaves", "Sooty mold growth"),
                            "Aphids reproduce rapidly in warm weather and are attracted to plants with soft new growth.",
                            "Spray with insecticidal soap or neem oil. Introduce beneficial insects like ladybugs.",
                            "Monitor plants regularly. Avoid excessive nitrogen fertilizer. Encourage beneficial insects.",
                            Arrays.asList("Roses", "Vegetables", "Fruit trees", "Ornamentals"),
                            "medium",
                            "https://example.com/aphids.jpg"),
                    new Disease("Healthy Plant",
                            "No disease detected. The plant appears to be healthy.",
                            Arrays.asList("Vibrant color", "Normal growth pattern", "No visible spots or discoloration", "Healthy leaf structure"),
                            "Proper care including adequate water, light, and nutrients.",
                            "Continue regular plant care practices.",
                            "Maintain regular watering, appropriate light conditions, and periodic fertilization.",
                            Arrays.asList("All plants"),
                            "low",
                            "https://example.com/healthy-plant.jpg")
            );
            diseaseRepository.saveAll(diseases);
        }
    }
}
