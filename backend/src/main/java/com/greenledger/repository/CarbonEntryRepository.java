package main.java.com.greenledger.repository;

import com.greenledger.model.CarbonEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarbonEntryRepository extends JpaRepository<CarbonEntry, Long> {
    
    List<CarbonEntry> findAllByOrderByTimestampDesc();
    
    @Query("SELECT c.category, SUM(c.carbonAmount) FROM CarbonEntry c GROUP BY c.category")
    List<Object[]> getCarbonByCategory();
    
    @Query("SELECT FUNCTION('DATE_FORMAT', c.timestamp, '%Y-%m'), SUM(c.carbonAmount) " +
           "FROM CarbonEntry c GROUP BY FUNCTION('DATE_FORMAT', c.timestamp, '%Y-%m') " +
           "ORDER BY FUNCTION('DATE_FORMAT', c.timestamp, '%Y-%m') DESC")
    List<Object[]> getMonthlyCarbonData();
}