# Sistema CRM Completo

Un sistema CRM moderno y completo construido con **React**, **Vite**, y **LocalStorage** para gestión de contactos, deals, tareas y reportes.

## 🚀 Características

- **Dashboard Interactivo**: KPIs en tiempo real, gráficos de ventas y feed de actividades
- **Gestión de Contactos**: CRUD completo con búsqueda y filtrado
- **Pipeline de Ventas**: Tablero Kanban visual para rastrear deals por etapas
- **Gestión de Tareas**: Organiza tareas por prioridad con fechas de vencimiento
- **Historial de Actividades**: Timeline completo de todas las acciones
- **Reportes y Analytics**: Visualización de datos con gráficos interactivos
- **Diseño Premium**: UI/UX moderno con animaciones y modo oscuro
- **Responsive**: Funciona perfectamente en desktop, tablet y móvil

## 📦 Tecnologías

- React 18
- Vite
- React Router DOM
- Recharts (gráficos)
- Lucide React (iconos)
- LocalStorage (persistencia de datos)
- Date-fns (manejo de fechas)

## 🛠️ Instalación

### Opción 1: Usando CMD (Recomendado si tienes problemas con PowerShell)

1. Abre **CMD** (no PowerShell) como administrador
2. Navega al directorio del proyecto:
   ```cmd
   cd C:\Users\Rey-Orozco\.gemini\antigravity\scratch\crm-system
   ```
3. Instala las dependencias:
   ```cmd
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```cmd
   npm run dev
   ```

### Opción 2: Habilitar PowerShell (Si prefieres usar PowerShell)

1. Abre **PowerShell** como administrador
2. Ejecuta este comando para habilitar la ejecución de scripts:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Confirma con "S" (Sí)
4. Luego ejecuta:
   ```powershell
   cd C:\Users\Rey-Orozco\.gemini\antigravity\scratch\crm-system
   npm install
   npm run dev
   ```

## 🎯 Uso

1. **Accede a la aplicación**: Una vez que el servidor esté corriendo, abre tu navegador en `http://localhost:5173`

2. **Credenciales de Demo**:
   - Email: `admin@crm.com`
   - Password: `admin123`

3. **O crea una nueva cuenta** usando el botón "Registrarse"

## 📱 Funcionalidades Principales

### Dashboard
- Visualiza KPIs principales (contactos, deals, tareas, revenue)
- Gráfico de ventas de los últimos 6 meses
- Feed de actividades recientes

### Contactos
- Agregar, editar y eliminar contactos
- Buscar contactos por nombre, email o empresa
- Vista de tarjetas con información detallada

### Deals (Pipeline de Ventas)
- Tablero Kanban con 6 etapas
- Mover deals entre etapas
- Seguimiento de valores y probabilidades

### Tareas
- Crear tareas con prioridades (Alta, Media, Baja)
- Marcar como completadas
- Fechas de vencimiento con indicadores

### Actividades
- Historial completo de todas las acciones
- Diferentes tipos de actividades con iconos

### Reportes
- Gráficos de distribución de deals
- Análisis de tareas por prioridad
- Estadísticas generales del CRM

## 🎨 Características de Diseño

- **Design System Completo**: Paleta de colores consistente, tipografía, espaciado
- **Dark Mode**: Alterna entre modo claro y oscuro
- **Animaciones Suaves**: Transiciones y micro-interacciones
- **Glassmorphism**: Efectos modernos de vidrio esmerilado
- **Responsive**: Adaptable a todos los tamaños de pantalla

## 📂 Estructura del Proyecto

```
crm-system/
├── src/
│   ├── components/
│   │   ├── Common/         # Componentes reutilizables
│   │   ├── Dashboard/      # Componentes del dashboard
│   │   └── Layout/         # Sidebar, Header, Layout
│   ├── contexts/           # Context API (Auth, Data)
│   ├── pages/              # Páginas principales
│   ├── utils/              # Utilidades y helpers
│   ├── App.jsx             # Componente principal con routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Design system global
├── index.html
├── package.json
└── vite.config.js
```

## 🔒 Persistencia de Datos

Todos los datos se guardan en **LocalStorage** del navegador:
- Usuarios
- Contactos
- Deals
- Tareas
- Actividades

Los datos persisten entre sesiones. Para limpiar los datos, abre la consola del navegador (F12) y ejecuta:
```javascript
localStorage.clear()
```

## 🚀 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea el build de producción
- `npm run preview` - Preview del build de producción

## 💡 Próximas Mejoras (Opcionales)

- Importar/Exportar contactos en CSV
- Notificaciones push
- Email tracking
- Integraciones con APIs externas
- Backend real con base de datos
- Multi-usuario con roles y permisos
- Calendario integrado
- Búsqueda global avanzada

## 📝 Notas

- Este es un sistema completamente funcional con LocalStorage
- Para un entorno de producción, considera implementar un backend real
- Los datos son locales al navegador (no sincronizados en la nube)

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y comercial.

---

Hecho con ❤️ usando React + Vite
