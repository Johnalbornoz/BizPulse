# Módulo Admin - Guía Rápida

## Inicio Rápido

### 1. Credenciales Iniciales
Las credenciales se crean automáticamente en el primer inicio:

```
Email: admin@bizpulse.com
Contraseña: admin123
Rol: SuperAdmin
```

### 2. Acceder al Panel Admin
1. Inicia sesión en BizPulse
2. En la URL, ve a: `http://localhost:5175/admin`
3. Verás el dashboard con estadísticas

### 3. Estructura del Panel

```
Admin Panel
├── Dashboard
│   └── Estadísticas generales
├── Empresas
│   ├── Ver lista
│   ├── Crear nueva
│   ├── Editar
│   └── Eliminar
├── Usuarios
│   ├── Ver lista
│   ├── Crear nuevo
│   ├── Editar
│   ├── Cambiar rol
│   └── Eliminar
└── Segmentos
    ├── Ver lista
    ├── Crear nuevo
    ├── Editar
    └── Eliminar
```

## Tareas Comunes

### Crear Nueva Empresa
1. Click en "Gestión de Empresas"
2. Click en "+ Nueva Empresa"
3. Llenar formulario:
   - **Nombre** ✓ (requerido)
   - País
   - Industria
   - Sub-industria
   - Tamaño
   - Empleados
   - Facturación USD
   - Sitio Web
4. Click "Guardar"

### Crear Nuevo Usuario
1. Click en "Gestión de Usuarios"
2. Click en "+ Nuevo Usuario"
3. Llenar formulario:
   - **Email** ✓ (requerido, único)
   - **Nombre** ✓ (requerido)
   - **Rol** ✓ (SuperAdmin, Admin, Consultor)
4. Click "Guardar"
5. **Se genera contraseña temporal automáticamente**
   - El usuario debe cambiarla en primer login

### Crear Nuevo Segmento
1. Click en "Gestión de Segmentos"
2. Click en "+ Nuevo Segmento"
3. Llenar formulario:
   - **Nombre** ✓ (requerido)
   - Descripción
   - Industria Principal
   - Estado (Activo/Inactivo)
4. Click "Guardar"

## Búsqueda y Filtrado

Todas las tablas soportan:

### Búsqueda
- Campo en la parte superior de cada tabla
- Busca en múltiples campos
- Case-insensitive (mayúsculas/minúsculas no importan)

### Paginación
- 20 resultados por página
- Botones de navegación en la parte inferior
- Muestra total de registros

## Acciones en Tablas

Cada fila tiene dos botones:

| Botón | Acción |
|-------|--------|
| ✎ Editar | Abre modal para actualizar |
| 🗑️ Eliminar | Elimina con confirmación |

## Estadísticas

### Dashboard muestra:

**Empresas**
- Total de empresas
- Cantidad de países
- Cantidad de industrias
- Empleados promedio
- Facturación total USD

**Usuarios**
- Total de usuarios
- Cantidad de SuperAdmins
- Cantidad de Admins
- Cantidad de Consultores

**Segmentos**
- Total de segmentos activos
- Industrias únicas

## Roles y Permisos

### Acceso al Admin
✓ **SuperAdmin** - Acceso completo
✗ **Admin** - Sin acceso (configurable futura)
✗ **Consultor** - Sin acceso

### Cambiar Rol de Usuario
1. Ve a "Gestión de Usuarios"
2. Busca el usuario
3. Click "Editar"
4. Cambia el rol
5. Click "Guardar"

## Contraseñas

### Usuario Nuevo
- Se genera automáticamente
- Se muestra una sola vez
- Usuario debe cambiarla en primer login

### Seguridad
- Todas las contraseñas se hashean con bcrypt
- Nunca se almacenan en texto plano
- Las sesiones usan JWT tokens

## Troubleshooting

### No veo el panel admin
**Problema:** No tienes rol SuperAdmin
**Solución:** Pide a administrador que cambie tu rol en la BD

### Olvidé contraseña de admin
**Solución:** Contacta a administrador de BD

### Usuario nuevo no puede login
**Problema:** Contraseña temporal incorrecta
**Solución:** Crea el usuario de nuevo, se genera nueva contraseña

### Error "Only SuperAdmin can access"
**Problema:** Tu usuario no es SuperAdmin
**Solución:** Usa credenciales admin@bizpulse.com / admin123

## APIs Disponibles

Si trabajas con APIs directamente:

### Obtener token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bizpulse.com","password":"admin123"}'
```

### Listar empresas
```bash
curl -X GET http://localhost:3000/api/admin/empresas \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Crear empresa
```bash
curl -X POST http://localhost:3000/api/admin/empresas \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Mi Empresa",
    "pais":"México",
    "industria":"Tech"
  }'
```

## Datos de Ejemplo

Al iniciar, se crean automáticamente:

**Empresas:**
- TechCorp Solutions (Software/Fintech)
- Manufacturing Plus (Manufactura/Autopartes)
- Retail Global (Retail/E-commerce)

**Segmentos:**
- PyME Manufacturera
- Startups Fintech
- Retail Tradicional
- Empresas Grandes

## Próximas Acciones

1. Cambiar contraseña de admin (recomendado)
2. Crear usuarios para tu equipo
3. Crear empresas reales
4. Definir segmentos de negocio
5. Comenzar diagnósticos

## Soporte

- Consulta `ADMIN_MODULE.md` para documentación completa
- Revisa `ADMIN_INTEGRATION_CHECKLIST.md` para detalles técnicos
- Contacta al equipo técnico para problemas

---

**¡Admin de BizPulse listo para usar!** 🚀
