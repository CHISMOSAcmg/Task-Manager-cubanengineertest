# Task Manager App 🚀

Una aplicación completa de gestión de tareas con sistema de colores en tiempo real, construida con Django REST Framework y React.

## ✨ Características Principales

### 🎨 Sistema de Colores en Tiempo Real
- **@Menciones** → Color naranja `#fdcb6e`
- **#Hashtags** → Color rojo `#d63031`  
- **Emails** → Color azul `#3498db`
- **Links** → Color verde `#27ae60`
- **Detección automática** mientras escribes

### 📱 Experiencia de Usuario
- **Interfaz responsive** para todos los dispositivos
- **Textarea auto-expandible** con texto largo
- **Sincronización perfecta** entre cursor y colores
- **Botón inteligente** que cambia según el contexto (+, 💾, X)

### 🔧 Funcionalidades Técnicas
- **API REST completa** con Django REST Framework
- **Frontend React** con Vite para desarrollo rápido
- **CI/CD automático** con GitHub Actions
- **Despliegue en Render.com** 

## 🏗️ Arquitectura del Proyecto

```
task-manager-app/
├── backend/                 # Django REST API
│   ├── taskmanager/         # Configuración del proyecto
│   ├── tasks/               # App de tareas
│   ├── requirements.txt     # Dependencias Python
│   └── manage.py
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # API calls
│   │   └── App.jsx
│   ├── package.json         # Dependencias Node.js
│   └── vite.config.js
└── .github/workflows/       # GitHub Actions CI/CD
```

## 🚀 Despliegue Rápido

### Prerrequisitos
- Python 3.11+
- Node.js 18+
- Git

### Desarrollo Local

#### Backend (Django)
```bash
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
python manage.py migrate

# Ejecutar servidor
python manage.py runserver
```
**API disponible en:** `http://localhost:8000/api/`

#### Frontend (React)
```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```
**App disponible en:** `http://localhost:3000`

### Producción
La aplicación se despliega automáticamente en:
- **Frontend:** https://taskmanager-frontend.onrender.com
- **Backend:** https://taskmanager-backend.onrender.com/api/

## 📚 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks/` | Listar todas las tareas |
| POST | `/api/tasks/` | Crear nueva tarea |
| GET | `/api/tasks/{id}/` | Obtener tarea específica |
| PUT | `/api/tasks/{id}/` | Actualizar tarea |
| DELETE | `/api/tasks/{id}/` | Eliminar tarea |

### Ejemplo de Tarea
```json
{
  "id": 1,
  "title": "Revisar PR @team #urgent email@example.com https://github.com",
  "status": "open",
  "priority": "high",
  "is_public": false,
  "mentions": ["team"],
  "hashtags": ["urgent"],
  "emails": ["email@example.com"],
  "links": ["https://github.com"]
}
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Django 5.2.1** - Framework web Python
- **Django REST Framework** - API REST
- **Django CORS Headers** - Configuración CORS
- **SQLite** - Base de datos (desarrollo)
- **Gunicorn** - Servidor WSGI

### Frontend
- **React 19** - Biblioteca de interfaz de usuario
- **Vite** - Herramientas de build y desarrollo
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Vitest** - Framework de testing

### DevOps
- **GitHub Actions** - CI/CD pipelines
- **Render.com** - Plataforma de despliegue

## 🔧 Configuración de Desarrollo

### Variables de Entorno

#### Backend (.env)
```env
DEBUG=True
SECRET_KEY=tu-clave-secreta
ALLOWED_HOSTS=localhost,127.0.0.1,.onrender.com
DATABASE_URL=sqlite:///db.sqlite3
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

### Comandos Útiles

#### Backend
```bash
# Crear superusuario
python manage.py createsuperuser

# Ejecutar tests
python manage.py test

# Aplicar migraciones
python manage.py migrate

# Colectar archivos estáticos
python manage.py collectstatic
```

#### Frontend
```bash
# Ejecutar tests
npm test

# Ejecutar linter
npm run lint

# Build de producción
npm run build

# Preview de build
npm run preview
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Flujo CI/CD

### GitHub Actions Workflows

#### CI - Tests Automáticos
- Se ejecuta en cada push a `main` y `develop`
- Tests de backend (Django)
- Tests de frontend (React + Vitest)
- Build verification

#### CD - Deploy Automático
- Se ejecuta solo en push a `main`
- Deploy automático a Render.com
- Configuración de variables de entorno
- Migraciones automáticas


**¿Te gusta el proyecto?** ¡Dale una ⭐ en GitHub!
