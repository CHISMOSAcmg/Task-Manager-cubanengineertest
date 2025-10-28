#!/bin/bash
# Build script para Render

echo "=== Instalando dependencias Python ==="
pip install -r requirements.txt

echo "=== Aplicando migraciones ==="
python manage.py migrate

echo "=== Colectando archivos estáticos ==="
python manage.py collectstatic --noinput

echo "=== Verificando que todo funciona ==="
python manage.py check

echo "=== Build completado ==="