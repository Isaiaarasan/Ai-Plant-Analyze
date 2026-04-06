package com.aiplantanalyze.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "diseases")
public class Disease {
    @Id
    private String id;
    private String name;
    private String description;
    private List<String> symptoms;
    private String causes;
    private String treatment;
    private String prevention;
    private List<String> plantTypes;
    private String severity;
    private String imageUrl;
    private Date createdAt = new Date();

    public Disease() {
    }

    public Disease(String name, String description, List<String> symptoms, String causes, String treatment,
                   String prevention, List<String> plantTypes, String severity, String imageUrl) {
        this.name = name;
        this.description = description;
        this.symptoms = symptoms;
        this.causes = causes;
        this.treatment = treatment;
        this.prevention = prevention;
        this.plantTypes = plantTypes;
        this.severity = severity;
        this.imageUrl = imageUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    public String getCauses() {
        return causes;
    }

    public void setCauses(String causes) {
        this.causes = causes;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public String getPrevention() {
        return prevention;
    }

    public void setPrevention(String prevention) {
        this.prevention = prevention;
    }

    public List<String> getPlantTypes() {
        return plantTypes;
    }

    public void setPlantTypes(List<String> plantTypes) {
        this.plantTypes = plantTypes;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
