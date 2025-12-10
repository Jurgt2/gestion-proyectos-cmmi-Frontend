#!/bin/bash

# 🚀 Script para iniciar Backend + Frontend de Gestión de Proyectos CMMI

echo "🎯 Iniciando proyecto Gestión de Proyectos CMMI..."
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_DIR="/Users/jorgeynoelcurioso/Desktop/ProyectosAngular/gestion-proyectos-cmmi"

# ============================================
# 1. VERIFICAR PREREQUISITOS
# ============================================
echo "${YELLOW}📋 Verificando prerequisitos...${NC}"

# Java
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo "${GREEN}✅ Java instalado: $JAVA_VERSION${NC}"
else
    echo "${RED}❌ Java NO está instalado${NC}"
    echo "Instala Java 11 o superior: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

# Maven
if command -v mvn &> /dev/null; then
    MVN_VERSION=$(mvn -v | head -n 1)
    echo "${GREEN}✅ Maven instalado: $MVN_VERSION${NC}"
else
    echo "${RED}❌ Maven NO está instalado${NC}"
    echo "Instala Maven: brew install maven"
    exit 1
fi

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "${GREEN}✅ Node.js instalado: $NODE_VERSION${NC}"
else
    echo "${RED}❌ Node.js NO está instalado${NC}"
    exit 1
fi

# npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "${GREEN}✅ npm instalado: $NPM_VERSION${NC}"
else
    echo "${RED}❌ npm NO está instalado${NC}"
    exit 1
fi

echo ""

# ============================================
# 2. VERIFICAR SI LOS PUERTOS ESTÁN LIBRES
# ============================================
echo "${YELLOW}🔍 Verificando puertos...${NC}"

# Puerto 8080 (Backend)
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "${RED}❌ Puerto 8080 ya está en uso${NC}"
    echo "Matando proceso en puerto 8080..."
    kill -9 $(lsof -t -i:8080) 2>/dev/null
    sleep 2
fi

# Puerto 4200 (Frontend)
if lsof -Pi :4200 -sTCP:LISTEN -t >/dev/null ; then
    echo "${RED}❌ Puerto 4200 ya está en uso${NC}"
    echo "Matando proceso en puerto 4200..."
    kill -9 $(lsof -t -i:4200) 2>/dev/null
    sleep 2
fi

echo "${GREEN}✅ Puertos 8080 y 4200 están libres${NC}"
echo ""

# ============================================
# 3. INICIAR BACKEND (Spring Boot)
# ============================================
echo "${YELLOW}🔧 Iniciando Backend (Spring Boot)...${NC}"

cd "$PROJECT_DIR/gestion-proyectos-cmmi" || exit

# Verificar si existe pom.xml
if [ ! -f "pom.xml" ]; then
    echo "${RED}❌ No se encontró pom.xml en gestion-proyectos-cmmi/${NC}"
    echo "El backend no está configurado correctamente"
    exit 1
fi

# Iniciar backend en segundo plano
echo "Ejecutando: mvn spring-boot:run"
mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!

echo "${GREEN}✅ Backend iniciado con PID: $BACKEND_PID${NC}"
echo "📄 Logs del backend: $PROJECT_DIR/gestion-proyectos-cmmi/backend.log"
echo ""

# Esperar a que el backend esté listo
echo "${YELLOW}⏳ Esperando a que el backend esté listo...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1 || \
       curl -s http://localhost:8080/h2-console > /dev/null 2>&1; then
        echo "${GREEN}✅ Backend está listo!${NC}"
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

# ============================================
# 4. INICIAR FRONTEND (Angular)
# ============================================
echo "${YELLOW}🎨 Iniciando Frontend (Angular)...${NC}"

cd "$PROJECT_DIR" || exit

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias de npm..."
    npm install
fi

# Iniciar frontend en segundo plano
echo "Ejecutando: npm start"
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

echo "${GREEN}✅ Frontend iniciado con PID: $FRONTEND_PID${NC}"
echo "📄 Logs del frontend: $PROJECT_DIR/frontend.log"
echo ""

# Esperar a que el frontend esté listo
echo "${YELLOW}⏳ Esperando a que el frontend compile...${NC}"
sleep 15
echo "${GREEN}✅ Frontend debería estar listo!${NC}"
echo ""

# ============================================
# 5. RESUMEN
# ============================================
echo ""
echo "${GREEN}═══════════════════════════════════════════${NC}"
echo "${GREEN}  🎉 PROYECTO INICIADO EXITOSAMENTE 🎉${NC}"
echo "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo "📊 Backend (Spring Boot):"
echo "   URL: ${YELLOW}http://localhost:8080${NC}"
echo "   H2 Console: ${YELLOW}http://localhost:8080/h2-console${NC}"
echo "   PID: $BACKEND_PID"
echo ""
echo "🎨 Frontend (Angular):"
echo "   URL: ${YELLOW}http://localhost:4200${NC}"
echo "   PID: $FRONTEND_PID"
echo ""
echo "🗄️  Base de Datos H2:"
echo "   JDBC URL: ${YELLOW}jdbc:h2:mem:testdb${NC}"
echo "   Usuario: ${YELLOW}sa${NC}"
echo "   Password: ${YELLOW}(vacío)${NC}"
echo ""
echo "${YELLOW}📝 Para ver los logs:${NC}"
echo "   Backend:  tail -f $PROJECT_DIR/gestion-proyectos-cmmi/backend.log"
echo "   Frontend: tail -f $PROJECT_DIR/frontend.log"
echo ""
echo "${YELLOW}🛑 Para detener los servicios:${NC}"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "${GREEN}🚀 Abre tu navegador en: http://localhost:4200${NC}"
echo ""

# Guardar PIDs para poder detenerlos después
echo "$BACKEND_PID" > "$PROJECT_DIR/.backend.pid"
echo "$FRONTEND_PID" > "$PROJECT_DIR/.frontend.pid"

# Mantener el script corriendo
echo "${YELLOW}Presiona Ctrl+C para detener ambos servicios${NC}"
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '${RED}Servicios detenidos${NC}'; exit" INT TERM

# Esperar indefinidamente
wait
