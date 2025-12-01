# 🔍 CÓMO VERIFICAR QUE LOS CAMBIOS SE GUARDAN

## 1️⃣ CONSOLA DEL NAVEGADOR (F12)

### Paso 1: Abre la consola
1. En el navegador (Chrome/Safari/Firefox) presiona **F12** o **Cmd+Option+I** (Mac)
2. Ve a la pestaña **"Console"** (Consola)

### Paso 2: Modifica los datos
1. Cambia cualquier campo (por ejemplo, el nombre del proyecto)
2. Haz clic en el botón **"Guardar"** (💾)

### Paso 3: Observa los mensajes
Si ves esto:

✅ **ÉXITO - Backend funcionando:**
```
Guardando matriz de riesgos...
Matriz guardada exitosamente: {id: 1, proyecto: "SISTEMA QUALITY", ...}
```

❌ **ERROR - Backend NO disponible:**
```
Error al guardar matriz: Http failure response for http://localhost:8080/api/risk-matrix: 0 Unknown Error
```

---

## 2️⃣ PESTAÑA NETWORK (Red)

### En las DevTools (F12):
1. Ve a la pestaña **"Network"** (Red)
2. Haz clic en "Guardar"
3. Busca una petición llamada **"risk-matrix"** o **"latest"**

#### Si el backend funciona:
- **Status**: 200 OK (verde) o 201 Created
- **Response**: JSON con los datos guardados

#### Si el backend NO funciona:
- **Status**: (failed) en rojo
- **Error**: "Failed to load resource" o "net::ERR_CONNECTION_REFUSED"

---

## 3️⃣ MENSAJE EN LA INTERFAZ

Después de hacer clic en "Guardar", deberías ver:

✅ **Si funciona:** "✅ Guardado con éxito" (mensaje verde en la esquina superior derecha)

❌ **Si falla:** "❌ Error al guardar" (mensaje rojo)

> **NOTA:** Actualmente ves "Guardando..." en azul, lo que significa que está intentando conectarse al backend.

---

## 4️⃣ VERIFICAR PERSISTENCIA (Recargar Página)

### Prueba definitiva:
1. Modifica los datos
2. Haz clic en **"Guardar"**
3. Espera el mensaje de éxito
4. **Recarga la página** (F5 o Cmd+R)
5. Si los datos que modificaste siguen ahí → **¡Está guardando correctamente!** ✅
6. Si vuelven a los valores anteriores → **El backend no está guardando** ❌

---

## 5️⃣ VERIFICAR LA BASE DE DATOS (Si tienes acceso)

Si el backend está funcionando, puedes verificar directamente en la base de datos:

### MySQL:
```sql
USE gestion_proyectos;
SELECT * FROM risk_matrix ORDER BY created_at DESC LIMIT 1;
SELECT * FROM control_cambio WHERE risk_matrix_id = (SELECT id FROM risk_matrix ORDER BY created_at DESC LIMIT 1);
```

### PostgreSQL:
```sql
\c gestion_proyectos
SELECT * FROM risk_matrix ORDER BY created_at DESC LIMIT 1;
SELECT * FROM control_cambio WHERE risk_matrix_id = (SELECT id FROM risk_matrix ORDER BY created_at DESC LIMIT 1);
```

---

## 🚨 PROBLEMA ACTUAL

Veo en tu captura que dice **"Solución a error 403 CORS - Grok"** en la parte superior.

Esto significa que **el backend NO está respondiendo correctamente** porque:

### Error CORS 403:
- El backend no está en el puerto 8080, o
- CORS no está configurado correctamente, o
- El backend no está corriendo

---

## ✅ SOLUCIÓN RÁPIDA

### Opción 1: Verificar que el backend esté corriendo
```bash
# Verifica si hay algo en el puerto 8080
lsof -ti:8080
# Si NO devuelve nada, el backend NO está corriendo
```

### Opción 2: Probar con curl
```bash
curl http://localhost:8080/api/risk-matrix/latest
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "proyecto": "SISTEMA QUALITY",
  "clave": "PRJ-001",
  ...
}
```

**Si sale error:**
```
curl: (7) Failed to connect to localhost port 8080: Connection refused
```
→ El backend NO está corriendo

---

## 📋 RESUMEN - CHECKLIST

Para que los cambios se guarden correctamente:

- [ ] Backend Spring Boot corriendo en **http://localhost:8080**
- [ ] Base de datos MySQL/PostgreSQL configurada
- [ ] Tablas `risk_matrix` y `control_cambio` creadas
- [ ] CORS configurado para permitir `http://localhost:4200`
- [ ] Endpoint `/api/risk-matrix/latest` respondiendo con JSON
- [ ] Endpoint `/api/risk-matrix` (POST) aceptando datos

---

## 🎯 SIGUIENTE PASO

**Envía el archivo `PROMPT_PARA_BACKEND.md` a tu equipo de backend** y pídeles que:

1. Implementen el código
2. Levanten el servidor en puerto 808
3. Te confirmen cuando esté listo

Una vez que el backend responda, tu frontend automáticamente guardará y cargará los datos sin necesidad de cambios adicionales. 💪
