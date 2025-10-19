package com.greenledger.controller;

import com.greenledger.model.CarbonEntry;
import com.greenledger.repository.CarbonEntryRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/carbon-entries")
@CrossOrigin(origins = "*")
public class CarbonEntryController {
    
    @Autowired
    private CarbonEntryRepository carbonEntryRepository;
    
    @GetMapping
    public List<CarbonEntry> getAllEntries() {
        return carbonEntryRepository.findAllByOrderByTimestampDesc();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CarbonEntry> getEntryById(@PathVariable Long id) {
        Optional<CarbonEntry> entry = carbonEntryRepository.findById(id);
        return entry.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public CarbonEntry createEntry(@Valid @RequestBody CarbonEntry entry) {
        return carbonEntryRepository.save(entry);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CarbonEntry> updateEntry(@PathVariable Long id, @Valid @RequestBody CarbonEntry entryDetails) {
        Optional<CarbonEntry> optionalEntry = carbonEntryRepository.findById(id);
        if (optionalEntry.isPresent()) {
            CarbonEntry entry = optionalEntry.get();
            entry.setActivity(entryDetails.getActivity());
            entry.setCategory(entryDetails.getCategory());
            entry.setCarbonAmount(entryDetails.getCarbonAmount());
            entry.setLocation(entryDetails.getLocation());
            entry.setLatitude(entryDetails.getLatitude());
            entry.setLongitude(entryDetails.getLongitude());
            return ResponseEntity.ok(carbonEntryRepository.save(entry));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntry(@PathVariable Long id) {
        if (carbonEntryRepository.existsById(id)) {
            carbonEntryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        // Total carbon
        List<CarbonEntry> allEntries = carbonEntryRepository.findAll();
        Double totalCarbon = allEntries.stream()
                .mapToDouble(CarbonEntry::getCarbonAmount)
                .sum();
        summary.put("totalCarbon", totalCarbon);
        
        // Category breakdown
        Map<String, Double> categoryBreakdown = new HashMap<>();
        List<Object[]> categoryData = carbonEntryRepository.getCarbonByCategory();
        for (Object[] data : categoryData) {
            categoryBreakdown.put((String) data[0], (Double) data[1]);
        }
        summary.put("categoryBreakdown", categoryBreakdown);
        
        // Monthly data
        List<Object[]> monthlyData = carbonEntryRepository.getMonthlyCarbonData();
        List<Map<String, Object>> monthlySummary = monthlyData.stream()
                .map(data -> {
                    Map<String, Object> monthData = new HashMap<>();
                    monthData.put("month", data[0]);
                    monthData.put("carbonAmount", data[1]);
                    return monthData;
                })
                .toList();
        summary.put("monthlyData", monthlySummary);
        
        return summary;
    }
}