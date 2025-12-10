package com.gestionproyectoscmmi.web;

import com.gestionproyectoscmmi.model.RiskMatrix;
import com.gestionproyectoscmmi.repository.RiskMatrixRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*")
public class RiskMatrixController {

    @Autowired
    private RiskMatrixRepository riskMatrixRepository;

    // GET: Obtener todas las matrices
    @GetMapping
    public ResponseEntity<List<RiskMatrix>> getAllMatrices() {
        try {
            List<RiskMatrix> matrices = riskMatrixRepository.findAll();
            return new ResponseEntity<>(matrices, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET: Obtener la última matriz creada
    @GetMapping("/latest")
    public ResponseEntity<RiskMatrix> getLatestMatrix() {
        try {
            Optional<RiskMatrix> matrix = riskMatrixRepository.findLatest();
            if (matrix.isPresent()) {
                return new ResponseEntity<>(matrix.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET: Obtener matriz por ID
    @GetMapping("/{id}")
    public ResponseEntity<RiskMatrix> getMatrixById(@PathVariable Long id) {
        try {
            Optional<RiskMatrix> matrix = riskMatrixRepository.findById(id);
            if (matrix.isPresent()) {
                return new ResponseEntity<>(matrix.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // POST: Crear nueva matriz
    @PostMapping
    public ResponseEntity<RiskMatrix> createMatrix(@RequestBody RiskMatrix riskMatrix) {
        try {
            // 🔍 LOG: Ver qué datos llegan del frontend
            System.out.println("📥 BACKEND RECIBIÓ:");
            System.out.println("   nombreProyecto: " + riskMatrix.getNombreProyecto());
            System.out.println("   claveProyecto: " + riskMatrix.getClaveProyecto());
            System.out.println("   fechaCreacion: " + riskMatrix.getFechaCreacion());
            System.out.println("   ultimaActualizacion: " + riskMatrix.getUltimaActualizacion());
            
            RiskMatrix savedMatrix = riskMatrixRepository.save(riskMatrix);
            
            // 🔍 LOG: Ver qué se guardó en la BD
            System.out.println("💾 BACKEND GUARDÓ:");
            System.out.println("   ID: " + savedMatrix.getId());
            System.out.println("   nombreProyecto: " + savedMatrix.getNombreProyecto());
            System.out.println("   claveProyecto: " + savedMatrix.getClaveProyecto());
            System.out.println("   fechaCreacion: " + savedMatrix.getFechaCreacion());
            System.out.println("   ultimaActualizacion: " + savedMatrix.getUltimaActualizacion());
            
            return new ResponseEntity<>(savedMatrix, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("❌ ERROR al guardar proyecto:");
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // PUT: Actualizar matriz existente
    @PutMapping("/{id}")
    public ResponseEntity<RiskMatrix> updateMatrix(@PathVariable Long id, @RequestBody RiskMatrix riskMatrix) {
        try {
            Optional<RiskMatrix> existingMatrix = riskMatrixRepository.findById(id);
            if (existingMatrix.isPresent()) {
                RiskMatrix matrixToUpdate = existingMatrix.get();
                
                // Actualizar campos de la tabla proyectos
                matrixToUpdate.setNombreProyecto(riskMatrix.getNombreProyecto());
                matrixToUpdate.setClaveProyecto(riskMatrix.getClaveProyecto());
                matrixToUpdate.setFechaCreacion(riskMatrix.getFechaCreacion());
                matrixToUpdate.setUltimaActualizacion(riskMatrix.getUltimaActualizacion());
                
                RiskMatrix updatedMatrix = riskMatrixRepository.save(matrixToUpdate);
                return new ResponseEntity<>(updatedMatrix, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE: Eliminar matriz
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteMatrix(@PathVariable Long id) {
        try {
            riskMatrixRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
