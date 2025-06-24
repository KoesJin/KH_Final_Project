package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Long save(Report report);
}
