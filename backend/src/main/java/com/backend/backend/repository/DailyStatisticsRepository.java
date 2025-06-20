package com.backend.backend.repository;

import com.backend.backend.entity.DailyStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyStatisticsRepository extends JpaRepository<DailyStatistics, Long> {
    
    Optional<DailyStatistics> findByDate(LocalDate date);
    
    List<DailyStatistics> findByDateBetweenOrderByDate(LocalDate start, LocalDate end);
    
    @Query(value = "SELECT * FROM daily_statistics WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) ORDER BY date", nativeQuery = true)
    List<DailyStatistics> findLast30Days();
    
    @Query(value = "SELECT * FROM daily_statistics WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) ORDER BY date", nativeQuery = true)
    List<DailyStatistics> findLast7Days();
}