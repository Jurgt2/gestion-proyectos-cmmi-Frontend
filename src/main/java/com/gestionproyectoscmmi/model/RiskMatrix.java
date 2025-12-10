package com.gestionproyectoscmmi.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "proyectos")
public class RiskMatrix {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre")
    private String nombreProyecto;
    
    @Column(name = "clave")
    private String claveProyecto;
    
    @Column(name = "fechaCreacion")
    private String fechaCreacion;
    
    @Column(name = "ultimaActualizacion")
    private String ultimaActualizacion;
    
    // Constructors
    public RiskMatrix() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNombreProyecto() {
        return nombreProyecto;
    }
    
    public void setNombreProyecto(String nombreProyecto) {
        this.nombreProyecto = nombreProyecto;
    }
    
    public String getClaveProyecto() {
        return claveProyecto;
    }
    
    public void setClaveProyecto(String claveProyecto) {
        this.claveProyecto = claveProyecto;
    }
    
    public String getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(String fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public String getUltimaActualizacion() {
        return ultimaActualizacion;
    }
    
    public void setUltimaActualizacion(String ultimaActualizacion) {
        this.ultimaActualizacion = ultimaActualizacion;
    }
}
