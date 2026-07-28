# Módulo de Administración - BizPulse

## Descripción General

Módulo de administración profesional para BizPulse que permite gestionar empresas, usuarios y segmentos de negocio desde una interfaz intuitiva tipo Typeform.

## Características

### 1. Dashboard Administrativo
- Estadísticas en tiempo real de empresas, usuarios y segmentos
- Accesos rápidos a módulos de gestión
- Información de actividad reciente

### 2. Gestión de Empresas
- CRUD completo de empresas
- Búsqueda y filtrado por país e industria
- Campos: nombre, país, industria, tamaño, empleados, facturación, sitio web
- Paginación

### 3. Gestión de Usuarios
- CRUD de usuarios
- Asignación de roles (SuperAdmin, Admin, Consultor)
- Generación automática de contraseñas temporales
- Filtrado por rol y estado
- Control de acceso basado en roles (RBAC)

### 4. Gestión de Segmentos
- CRUD de segmentos de negocio
- Campos: nombre, descripción, industria principal
- Estado activo/inactivo
- Búsqueda y filtrado

## Estructura del Backend

### Modelos
```
/apps/api/src/models/
├── usuario.js           # Modelo de usuarios mejorado
├── empresa.js           # Modelo de empresas mejorado
└── segmentoNegocio.js   # Modelo de segmentos
```

### Controladores Admin
```
/apps/api/src/controllers/
├── adminEmpresasController.js
├── adminUsuariosController.js
└── adminSegmentosController.js
```

### Middleware
```
/apps/api/src/middleware/
├── auth.js              # Verificación de token JWT
└── authorize.js         # RBAC - verificación de roles
```

### Rutas
```
/apps/api/src/routes/
└── admin.js             # Rutas del módulo admin
```

### Servicios
```
/apps/api/src/services/
└── passwordService.js   # Generación de contraseñas seguras
```

## Estructura del Frontend

### Componentes Admin
```
/apps/web/src/components/Admin/
├── AdminLayout.tsx      # Layout con sidebar
├── AdminTable.tsx       # Tabla reutilizable con acciones
├── AdminModal.tsx       # Modal para crear/editar
└── index.ts             # Exportaciones
```

### Páginas Admin
```
/apps/web/src/pages/admin/
├── AdminDashboard.tsx   # Dashboard con estadísticas
├── AdminEmpresas.tsx    # CRUD de empresas
├── AdminUsuarios.tsx    # CRUD de usuarios
└── AdminSegmentos.tsx   # CRUD de segmentos
```

## Base de Datos

### Cambios en Schema

#### 1. Tabla usuarios - Mejoras
- Agregado: `empresa_id` (foreign key a empresas)

#### 2. Nueva tabla: segmentos_negocio
```sql
CREATE TABLE segmentos_negocio (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenants(id),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  industria_principal VARCHAR(100),
  estado VARCHAR(50) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

#### 3. Tabla benchmarks_segmento - Mejoras
- Agregado: `segmento_id` (foreign key a segmentos_negocio)

## Endpoints API

### Empresas
```
GET    /api/admin/empresas              # Listar empresas (con paginación)
GET    /api/admin/empresas/stats        # Estadísticas
GET    /api/admin/empresas/:id          # Obtener empresa
POST   /api/admin/empresas              # Crear empresa
PUT    /api/admin/empresas/:id          # Actualizar empresa
DELETE /api/admin/empresas/:id          # Eliminar empresa
```

### Usuarios
```
GET    /api/admin/usuarios              # Listar usuarios
GET    /api/admin/usuarios/stats        # Estadísticas
GET    /api/admin/usuarios/:id          # Obtener usuario
POST   /api/admin/usuarios              # Crear usuario
PUT    /api/admin/usuarios/:id          # Actualizar usuario
POST   /api/admin/usuarios/:id/cambiar-rol  # Cambiar rol
DELETE /api/admin/usuarios/:id          # Eliminar usuario
```

### Segmentos
```
GET    /api/admin/segmentos             # Listar segmentos
GET    /api/admin/segmentos/stats       # Estadísticas
GET    /api/admin/segmentos/:id         # Obtener segmento
POST   /api/admin/segmentos             # Crear segmento
PUT    /api/admin/segmentos/:id         # Actualizar segmento
DELETE /api/admin/segmentos/:id         # Eliminar segmento
```

## Autenticación y Autorización

### Roles Definidos
- **SuperAdmin**: Acceso completo al módulo admin
- **Admin**: Acceso limitado (configurable)
- **Consultor**: Sin acceso al admin

### Validaciones

#### Empresas
- Nombre requerido
- Email único (si tiene)
- Números: empleados y facturación

#### Usuarios
- Email único
- Email válido
- Nombre requerido
- Rol válido
- No puede eliminarse a sí mismo

#### Segmentos
- Nombre requerido
- Estado válido

## Credenciales Iniciales

Al ejecutar `npm run dev` en el backend, se crean automáticamente:

**SuperAdmin**
```
Email: admin@bizpulse.com
Contraseña: admin123
Rol: SuperAdmin
```

**Datos de Prueba**
- 3 empresas de ejemplo
- 4 segmentos de negocio

## Uso del Módulo

### Acceder al Admin
1. Inicia sesión con credenciales SuperAdmin
2. Navega a `/admin` en el navegador
3. Verás el dashboard con estadísticas

### Crear Empresa
1. Ve a "Gestión de Empresas"
2. Click en "+ Nueva Empresa"
3. Completa el formulario
4. Click en "Guardar"

### Crear Usuario
1. Ve a "Gestión de Usuarios"
2. Click en "+ Nuevo Usuario"
3. Ingresa email, nombre y rol
4. Se genera contraseña temporal automáticamente
5. Usuario debe cambiarla en primer login

### Crear Segmento
1. Ve a "Gestión de Segmentos"
2. Click en "+ Nuevo Segmento"
3. Completa nombre, descripción e industria
4. Click en "Guardar"

## Características Técnicas

### Frontend
- React 18 + TypeScript
- React Router v6
- Zustand para state management
- Tailwind CSS + AiBo Design System
- Componentes reutilizables Typeform

### Backend
- Express.js
- PostgreSQL
- JWT para autenticación
- bcryptjs para contraseñas
- RBAC middleware

### Seguridad
- JWT token-based auth
- Password hashing con bcrypt
- Foreign keys en BD
- Validaciones de entrada
- SQL injection prevention (parameterized queries)
- CORS configurado

## Próximas Mejoras

- [ ] Auditoría de cambios
- [ ] Export a CSV/Excel
- [ ] Bulk operations
- [ ] Two-factor authentication
- [ ] Logs de acceso
- [ ] Restricciones por tenant más granulares
- [ ] Integración con benchmarks

## Troubleshooting

### Error "Only SuperAdmin can access this resource"
Verifica que tu usuario tenga rol "SuperAdmin" en la BD:
```sql
SELECT id, email, rol FROM usuarios;
```

### Error de conexión a API
Verifica que:
1. El backend esté corriendo en el puerto correcto
2. La variable `VITE_API_URL` esté configurada
3. CORS esté habilitado en servidor

### Contraseña temporal no funciona
Las contraseñas temporales son válidas una vez. El usuario debe usar la mostrada al crear.

## Variables de Entorno

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5175
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

## Estadísticas Disponibles

### Empresas
- Total de empresas
- Países representados
- Industrias únicas
- Empleados promedio
- Facturación total (USD)

### Usuarios
- Total de usuarios
- SuperAdmins
- Admins
- Consultores

### Segmentos
- Total de segmentos activos
- Industrias principales

## API Response Examples

### Crear Usuario
**Request:**
```json
{
  "email": "consultor@example.com",
  "nombre": "Juan Consultor",
  "rol": "Consultor"
}
```

**Response (201):**
```json
{
  "id": 5,
  "email": "consultor@example.com",
  "nombre": "Juan Consultor",
  "rol": "Consultor",
  "estado": "activo",
  "tempPassword": "xK9$mL2@pQ7"
}
```

### Listar Empresas
**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "TechCorp",
      "pais": "México",
      "industria": "Software"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

## Notas Importantes

1. Solo SuperAdmin puede acceder al módulo admin
2. Los cambios se guardan en BD en tiempo real
3. Las contraseñas se hashean con bcrypt
4. Los tokens JWT expiran después del tiempo configurado
5. Se validan todos los emails en creación
6. No se puede eliminar el propio usuario
7. Las búsquedas son case-insensitive

## Soporte

Para reportar problemas o sugerencias sobre el módulo admin, contacta al equipo de desarrollo.
