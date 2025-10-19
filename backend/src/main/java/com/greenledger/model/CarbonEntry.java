package com.greenledger.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_entries")
public class CarbonEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Activity is required")
    @Column(nullable = false)
    private String activity;
    
    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;
    
    @NotNull(message = "Carbon amount is required")
    @Positive(message = "Carbon amount must be positive")
    @Column(nullable = false)
    private Double carbonAmount;
    
    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;
    
    private Double latitude;
    
    private Double longitude;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    // Constructors
    public CarbonEntry() {
        this.timestamp = LocalDateTime.now();
    }
    
    public CarbonEntry(String activity, String category, Double carbonAmount, String location) {
        this();
        this.activity = activity;
        this.category = category;
        this.carbonAmount = carbonAmount;
        this.location = location;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Double getCarbonAmount() { return carbonAmount; }
    public void setCarbonAmount(Double carbonAmount) { this.carbonAmount = carbonAmount; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}