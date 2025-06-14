# Orbitecs Compliance

Sistema de Gestión de Cumplimiento (GRC) desarrollado con tecnologías modernas para la gestión eficiente de procesos de cumplimiento normativo.

## 🚀 Características

- **Gestión de Cumplimiento**: Control y seguimiento de procesos de cumplimiento normativo
- **Asistente IA**: Chatbot inteligente para asistencia en tiempo real
- **Notificaciones**: Sistema de alertas y notificaciones en tiempo real
- **Gestión de Usuarios**: Control de acceso basado en roles (RBAC)
- **Interfaz Moderna**: Diseño responsive con efectos de cristal y animaciones suaves
- **Tema Oscuro/Claro**: Soporte para modo oscuro y claro

## 🛠️ Tecnologías

- **Frontend**:
  - Next.js 14
  - React 18
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui
  - Framer Motion

- **Backend**:
  - Node.js
  - Express
  - PostgreSQL
  - Prisma ORM

## 📋 Prerrequisitos

- Node.js 18.x o superior
- PostgreSQL 14.x o superior
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/orbitecs-compliance-webapp.git
   cd orbitecs-compliance-webapp
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env.local
   ```
   Editar `.env.local` con tus configuraciones locales.

4. **Configurar la base de datos**:
   ```bash
   # Crear la base de datos
   createdb orbitecs_compliance

   # Ejecutar migraciones
   npx prisma migrate dev
   ```

## 🚀 Ejecución

1. **Modo desarrollo**:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

2. **Modo producción**:
   ```bash
   npm run build
   npm start
   # o
   yarn build
   yarn start
   ```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
orbitecs-compliance-webapp/
├── app/                    # Directorio principal de la aplicación
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuraciones
├── public/               # Archivos estáticos
├── styles/              # Estilos globales
└── prisma/             # Esquema y migraciones de la base de datos
```

## 🔐 Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/orbitecs_compliance"

# Autenticación
NEXTAUTH_SECRET="tu-secreto"
NEXTAUTH_URL="http://localhost:3000"

# API
API_URL="http://localhost:3000/api"
```

## 👥 Roles de Usuario

- **Administrador**: Acceso completo al sistema
- **Gestor**: Gestión de procesos y cumplimiento
- **Usuario**: Acceso básico a funcionalidades

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 📧 Contacto

Orbitecs - [contacto@orbitecs.com](mailto:contacto@orbitecs.com)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/) 