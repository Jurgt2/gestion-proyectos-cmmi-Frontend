#!/bin/bash

# Script para iniciar el backend de Spring Boot

echo "🚀 Iniciando Backend Spring Boot..."
echo "📦 Compilando proyecto..."

cd /Users/jorgeynoelcurioso/Desktop/ProyectosAngular/gestion-proyectos-cmmi/gestion-proyectos-cmmi

# Compilar el proyecto
mvn clean package -DskipTests > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Compilación exitosa"
    echo "🔥 Iniciando servidor en puerto 8080..."
    
    # Iniciar el backend
    java -jar target/gestion-proyectos-cmmi-backend-1.0.0.jar
else
    echo "❌ Error en la compilación"
    exit 1
fi
