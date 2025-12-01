# Backend API - Matriz de Riesgos

## Endpoints Requeridos

El frontend necesita los siguientes endpoints en el backend Spring Boot:

### Base URL
```
http://localhost:8080/api/risk-matrix
```

### 1. Obtener todas las matrices
```
GET /api/risk-matrix
Response: RiskMatrix[]
```

### 2. Obtener matriz por ID
```
GET /api/risk-matrix/{id}
Response: RiskMatrix
```

### 3. Obtener la última matriz creada
```
GET /api/risk-matrix/latest
Response: RiskMatrix
```

### 4. Crear nueva matriz
```
POST /api/risk-matrix
Body: RiskMatrix (sin id)
Response: RiskMatrix (con id generado)
```

### 5. Actualizar matriz existente
```
PUT /api/risk-matrix/{id}
Body: RiskMatrix
Response: RiskMatrix
```

### 6. Eliminar matriz
```
DELETE /api/risk-matrix/{id}
Response: 200 OK
```

## Modelo de Datos

### RiskMatrix Entity
```java
@Entity
@Table(name = "risk_matrix")
public class RiskMatrix {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String proyecto;
    private String clave;
    private String responsable;
    private String fechaInicio;
    private String fechaFin;
    private Integer totalRiesgos;
    private Integer criticos;
    private Integer mitigados;
    private Integer cambiosRecientes;
    
    @OneToMany(mappedBy = "riskMatrix", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ControlCambio> controlCambios = new ArrayList<>();
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Getters y Setters
}
```

### ControlCambio Entity
```java
@Entity
@Table(name = "control_cambio")
public class ControlCambio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String version;
    private String fecha;
    private String descripcion;
    private String autor;
    private String aprobo;
    
    @ManyToOne
    @JoinColumn(name = "risk_matrix_id")
    @JsonBackReference
    private RiskMatrix riskMatrix;
    
    // Getters y Setters
}
```

## Controller Ejemplo

```java
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
                .orElse(ResponseEntity.notFound().build());
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

## Service Ejemplo

```java
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
    
    public RiskMatrix save(RiskMatrix matrix) {
        // Establecer la relación bidireccional
        if (matrix.getControlCambios() != null) {
            matrix.getControlCambios().forEach(cc -> cc.setRiskMatrix(matrix));
        }
        return repository.save(matrix);
    }
    
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

## Repository

```java
@Repository
public interface RiskMatrixRepository extends JpaRepository<RiskMatrix, Long> {
    Optional<RiskMatrix> findTopByOrderByCreatedAtDesc();
}
```

## SQL Schema

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
    created_at TIMESTAMP,
    updated_at TIMESTAMP
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

## Configuración CORS

Asegúrate de tener configurado CORS en tu aplicación:

```java
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
