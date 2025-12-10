package com.gestionproyectoscmmi.repository;

import com.gestionproyectoscmmi.model.RiskMatrix;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RiskMatrixRepository extends JpaRepository<RiskMatrix, Long> {
    
    @Query("SELECT r FROM RiskMatrix r ORDER BY r.id DESC LIMIT 1")
    Optional<RiskMatrix> findLatest();
}
