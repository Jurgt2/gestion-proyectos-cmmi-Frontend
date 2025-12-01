# 🔴 SOLUCIÓN ERROR 403 - BACKEND CORRIENDO PERO NO RESPONDE

## ✅ BUENAS NOTICIAS
El backend **SÍ está corriendo** en `http://localhost:8080`

## ❌ PROBLEMA DETECTADO
Está respondiendo con **HTTP 403 Forbidden** en lugar de devolver los datos.

---

## 🔍 CAUSA DEL ERROR 403

El error 403 puede deberse a **3 causas principales**:

### 1️⃣ **Spring Security está activo** (más probable)
Si el proyecto tiene Spring Security configurado, está bloqueando las peticiones.

### 2️⃣ **CORS mal configurado**
El backend no está permitiendo peticiones desde `http://localhost:4200`

### 3️⃣ **Autenticación requerida**
El endpoint requiere un token JWT o credenciales

---

## 🛠️ SOLUCIONES

### SOLUCIÓN 1: Deshabilitar Spring Security (temporal para desarrollo)

Si el proyecto tiene Spring Security, agrégale esta configuración:

**SecurityConfig.java:**
```java
package com.tuempresa.gestionproyectos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Deshabilitar CSRF para desarrollo
            .cors(cors -> cors.disable())   // O configurar CORS correctamente
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll()  // Permitir todos los endpoints /api
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

---

### SOLUCIÓN 2: Verificar y corregir CORS

Asegúrate de que el archivo **WebConfig.java** esté correctamente configurado:

```java
package com.tuempresa.gestionproyectos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
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
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

---

### SOLUCIÓN 3: Agregar @CrossOrigin en el Controller

Si las anteriores no funcionan, agrega esta anotación en el **RiskMatrixController.java**:

```java
@RestController
@RequestMapping("/api/risk-matrix")
@CrossOrigin(origins = "*", allowedHeaders = "*")  // ← Permitir todos los orígenes (solo desarrollo)
public class RiskMatrixController {
    // ... resto del código
}
```

---

### SOLUCIÓN 4: Deshabilitar CSRF en application.properties

Agrega esto al **application.properties**:

```properties
# Deshabilitar CSRF (solo para desarrollo)
spring.security.csrf.enabled=false

# Permitir todos los orígenes CORS
spring.web.cors.allowed-origins=http://localhost:4200
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

---

## 🧪 PRUEBA RÁPIDA

Después de aplicar cualquiera de las soluciones, **reinicia el backend** y prueba:

```bash
curl http://localhost:8080/api/risk-matrix/latest
```

**Respuesta esperada (200 OK):**
```json
{
  "id": 1,
  "proyecto": "SISTEMA QUALITY",
  "clave": "PRJ-001",
  "responsable": "Juan Pérez",
  ...
}
```

**Si aún sale 403:**
```
{"timestamp":"...","status":403,"error":"Forbidden",...}
```

---

## 📋 QUÉ PEDIR AL BACKEND

**Envíale esto a tu equipo de backend:**

> Hola, el backend está corriendo en puerto 8080 pero responde con **Error 403 Forbidden** cuando intento acceder a `/api/risk-matrix/latest`. 
> 
> Necesito que:
> 
> 1. **Verifiquen si tienen Spring Security activo** y configuren para permitir acceso a `/api/**` sin autenticación (al menos para desarrollo)
> 
> 2. **Configuren CORS correctamente** para permitir peticiones desde `http://localhost:4200`
> 
> 3. **Desactiven CSRF** para desarrollo
> 
> Adjunto archivo `SOLUCION_ERROR_403.md` con el código necesario. Una vez corregido, prueben con:
> ```bash
> curl http://localhost:8080/api/risk-matrix/latest
> ```
> Debe responder con **200 OK** y datos JSON, no con 403.

---

## ✅ VERIFICACIÓN FINAL

Una vez que el backend responda correctamente:

1. ✅ `curl http://localhost:8080/api/risk-matrix/latest` → responde **200 OK** con JSON
2. ✅ Abre tu frontend `http://localhost:4200/riesgos`
3. ✅ Modifica cualquier campo
4. ✅ Haz clic en **"Guardar"**
5. ✅ Deberías ver **"✅ Guardado con éxito"**
6. ✅ Recarga la página (F5)
7. ✅ Los datos deben persistir

---

## 🎯 CAUSA RAÍZ

El error 403 indica que el backend tiene **Spring Security configurado** y está bloqueando las peticiones porque:
- No hay token de autenticación, o
- Las peticiones vienen de un origen no permitido (CORS)

La solución es configurar Spring Security para permitir acceso público a `/api/risk-matrix` o configurar correctamente las reglas de CORS.
