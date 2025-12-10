package com.gestionproyectoscmmi.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "control_cambios")
public class ControlCambio {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String version;
    private String fecha;
    private String descripcion;
    private String autor;
    private String aprobo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "risk_matrix_id")
    @JsonIgnore
    private RiskMatrix riskMatrix;
    
    // Constructors
    public ControlCambio() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getVersion() {
        return version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }
    
    public String getFecha() {
        return fecha;
    }
    
    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getAutor() {
        return autor;
    }
    
    public void setAutor(String autor) {
        this.autor = autor;
    }
    
    public String getAprobo() {
        return aprobo;
    }
    
    public void setAprobo(String aprobo) {
        this.aprobo = aprobo;
    }
    
    public RiskMatrix getRiskMatrix() {
        return riskMatrix;
    }
    
    public void setRiskMatrix(RiskMatrix riskMatrix) {
        this.riskMatrix = riskMatrix;
    }
}
