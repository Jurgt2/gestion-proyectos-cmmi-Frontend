# PROMPT PARA BACKEND - MATRIZ DE RIESGOS

Hola, necesito que implementes un backend en Spring Boot para gestionar una Matriz de Riesgos. El frontend Angular ya está listo y se conectará a `http://localhost:8080`.

## 📋 REQUERIMIENTOS

### 1. Base de Datos - SQL Schema

Primero, crea estas dos tablas en tu base de datos:

```sql
CREATE TABLE risk_matrix (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    proyecto VARCHAR(255),
    clave VARCHAR(100),
    responsable VARCHAR(255),
    fecha_inicio VARCHAR(20),
    fecha_fin VARCHAR(20),
    total_riesgos INT,
    criticos INT,
    mitigados INT,
    cambios_recientes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE control_cambio (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(50),
    fecha VARCHAR(20),
    descripcion TEXT,
    autor VARCHAR(255),
    aprobo VARCHAR(255),
    risk_matrix_id BIGINT,
    FOREIGN KEY (risk_matrix_id) REFERENCES risk_matrix(id) ON DELETE CASCADE
);
```

### 2. Entities (Modelos JPA)

**RiskMatrix.java:**
```java
package com.tuempresa.gestionproyectos.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "risk_matrix")
@Data
public class RiskMatrix {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String proyecto;
    private String clave;
    private String responsable;
    
    @Column(name = "fecha_inicio")
    private String fechaInicio;
    
    @Column(name = "fecha_fin")
    private String fechaFin;
    
    @Column(name = "total_riesgos")
    private Integer totalRiesgos;
    
    private Integer criticos;
    private Integer mitigados;
    
    @Column(name = "cambios_recientes")
    private Integer cambiosRecientes;
    
    @OneToMany(mappedBy = "riskMatrix", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ControlCambio> controlCambios = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

**ControlCambio.java:**
```java
package com.tuempresa.gestionproyectos.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "control_cambio")
@Data
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
    @JsonBackReference
    private RiskMatrix riskMatrix;
}
```

### 3. Repository

**RiskMatrixRepository.java:**
```java
package com.tuempresa.gestionproyectos.repository;

import com.tuempresa.gestionproyectos.model.RiskMatrix;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RiskMatrixRepository extends JpaRepository<RiskMatrix, Long> {
    Optional<RiskMatrix> findTopByOrderByCreatedAtDesc();
}
```

### 4. Service

**RiskMatrixService.java:**
```java
package com.tuempresa.gestionproyectos.service;

import com.tuempresa.gestionproyectos.model.RiskMatrix;
import com.tuempresa.gestionproyectos.repository.RiskMatrixRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RiskMatrixService {
    
    @Autowired
    private RiskMatrixRepository repository;
    
    public List<RiskMatrix> findAll() {
        return repository.findAll();
    }
    
    public Optional<RiskMatrix> findById(Long id) {
        return repository.findById(id);
    }
    
    public Optional<RiskMatrix> findLatest() {
        return repository.findTopByOrderByCreatedAtDesc();
    }
    
    @Transactional
    public RiskMatrix save(RiskMatrix matrix) {
        // Establecer la relación bidireccional
        if (matrix.getControlCambios() != null) {
            matrix.getControlCambios().forEach(cc -> cc.setRiskMatrix(matrix));
        }
        return repository.save(matrix);
    }
    
    @Transactional
    public Optional<RiskMatrix> update(Long id, RiskMatrix matrix) {
        return repository.findById(id).map(existing -> {
            existing.setProyecto(matrix.getProyecto());
            existing.setClave(matrix.getClave());
            existing.setResponsable(matrix.getResponsable());
            existing.setFechaInicio(matrix.getFechaInicio());
            existing.setFechaFin(matrix.getFechaFin());
            existing.setTotalRiesgos(matrix.getTotalRiesgos());
            existing.setCriticos(matrix.getCriticos());
            existing.setMitigados(matrix.getMitigados());
            existing.setCambiosRecientes(matrix.getCambiosRecientes());
            
            // Actualizar control de cambios
            existing.getControlCambios().clear();
            if (matrix.getControlCambios() != null) {
                matrix.getControlCambios().forEach(cc -> {
                    cc.setRiskMatrix(existing);
                    existing.getControlCambios().add(cc);
                });
            }
            
            return repository.save(existing);
        });
    }
    
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
```

### 5. Controller

**RiskMatrixController.java:**
```java
package com.tuempresa.gestionproyectos.controller;

import com.tuempresa.gestionproyectos.model.RiskMatrix;
import com.tuempresa.gestionproyectos.service.RiskMatrixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/risk-matrix")
@CrossOrigin(origins = "http://localhost:4200")
public class RiskMatrixController {
    
    @Autowired
    private RiskMatrixService service;
    
    @GetMapping
    public ResponseEntity<List<RiskMatrix>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RiskMatrix> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/latest")
    public ResponseEntity<RiskMatrix> getLatest() {
        return service.findLatest()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(new RiskMatrix())); // Retorna objeto vacío si no hay datos
    }
    
    @PostMapping
    public ResponseEntity<RiskMatrix> create(@RequestBody RiskMatrix matrix) {
        RiskMatrix saved = service.save(matrix);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RiskMatrix> update(@PathVariable Long id, @RequestBody RiskMatrix matrix) {
        return service.update(id, matrix)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
```

### 6. Configuración CORS (Importante!)

**WebConfig.java:**
```java
package com.tuempresa.gestionproyectos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 7. Application Properties

**application.properties:**
```properties
# Puerto del servidor
server.port=8080

# Configuración de la base de datos (ajusta según tu DB)
spring.datasource.url=jdbc:mysql://localhost:3306/gestion_proyectos
spring.datasource.username=root
spring.datasource.password=tu_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Logging
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

## 🧪 PRUEBAS

Una vez implementado, prueba con estos comandos curl:

### Crear una matriz de prueba:
```bash
curl -X POST http://localhost:8080/api/risk-matrix \
  -H "Content-Type: application/json" \
  -d '{
    "proyecto": "Proyecto Test",
    "clave": "TEST-001",
    "responsable": "Admin",
    "fechaInicio": "2025-11-05",
    "fechaFin": "2025-12-31",
    "totalRiesgos": 150,
    "criticos": 10,
    "mitigados": 100,
    "cambiosRecientes": 5,
    "controlCambios": [
      {
        "version": "1.0",
        "fecha": "05/11/2025",
        "descripcion": "Versión inicial",
        "autor": "Jorge",
        "aprobo": "QA Team"
      }
    ]
  }'
```

### Obtener la última matriz:
```bash
curl http://localhost:8080/api/risk-matrix/latest
```

### Obtener todas las matrices:
```bash
curl http://localhost:8080/api/risk-matrix
```

## ✅ CHECKLIST

- [ ] Base de datos creada con las dos tablas
- [ ] Todas las clases Java creadas (Entity, Repository, Service, Controller, Config)
- [ ] Servidor corriendo en puerto 8080
- [ ] CORS configurado para permitir peticiones desde localhost:4200
- [ ] Endpoints probados con curl y funcionando
- [ ] Respuesta JSON correcta en `/api/risk-matrix/latest`

## 📝 NOTAS IMPORTANTES

1. **Si usas PostgreSQL en vez de MySQL**, cambia el dialecto:
   ```properties
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   spring.datasource.url=jdbc:postgresql://localhost:5432/gestion_proyectos
   ```

2. **Lombok**: Asegúrate de tener Lombok en tu `pom.xml`:
   ```xml
   <dependency>
       <groupId>org.projectlombok</groupId>
       <artifactId>lombok</artifactId>
       <optional>true</optional>
   </dependency>
   ```

3. **Jackson**: Para las anotaciones JSON (`@JsonManagedReference`, `@JsonBackReference`)

4. El frontend ya está listo y esperando estas respuestas. Una vez que el backend funcione, todo se conectará automáticamente.

¿Alguna duda? El endpoint más importante es `/api/risk-matrix/latest` porque es el primero que llama el frontend al cargar la página.
