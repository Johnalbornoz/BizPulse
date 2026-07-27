# Desarrollo Local — BizPulse

## Requisitos Previos

- Node.js 18+
- PostgreSQL 14+ (local o docker)
- OpenAI API Key (para IA features)

## Setup Inicial

### 1. Instalar Dependencias

```bash
# Frontend
cd apps/web
npm install

# Backend
cd ../api
npm install
```

### 2. Base de Datos PostgreSQL

**Opción A: PostgreSQL Local**
```bash
# macOS con Homebrew
brew install postgresql
brew services start postgresql

# Crear BD
createdb bizpulse
```

**Opción B: Docker**
```bash
docker run --name bizpulse-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bizpulse \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Configurar Variables de Entorno

Backend (`apps/api/.env.local`):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bizpulse
OPENAI_API_KEY=sk-proj-YOUR-KEY-HERE
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret-key
```

Frontend (`apps/web/.env.local`):
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=BizPulse
```

### 4. Ejecutar Migraciones

```bash
cd apps/api
npm run migrate
```

Esto:
- Crea todas las tablas
- Siembra los 11 pilares
- Siembra las 33 preguntas
- Crea usuario admin: `admin@bizpulse.local` / `admin123`

## Desarrollo

### Terminal 1: Backend

```bash
cd apps/api
npm run dev
# Corre en http://localhost:3000
```

### Terminal 2: Frontend

```bash
cd apps/web
npm run dev
# Corre en http://localhost:5173
```

### Terminal 3: Monitor Opcional

```bash
cd apps/api
npm run migrate  # Si cambias schema
```

## Flujo de Prueba End-to-End

1. **Login**: http://localhost:5173
   - Email: `admin@bizpulse.local`
   - Password: `admin123`

2. **Crear Empresa** (desde API o backend):
   ```bash
   curl -X POST http://localhost:3000/empresas \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "nombre": "Acme Corp",
       "pais": "Mexico",
       "industria": "BPO",
       "tamaño": "SMB",
       "empleados": 150,
       "facturacion_usd": 5000000
     }'
   ```

3. **Crear Diagnóstico**:
   ```bash
   curl -X POST http://localhost:3000/diagnosticos \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"nombre": "Diagnóstico Q1 2026"}'
   ```

4. **Flujo Completo**:
   - Discovery → upload documentos/entrevistas
   - Classify → IA clasifica industria
   - Framework → selecciona preguntas
   - Assessment → responde cuestionario
   - Scoring → IA sugiere calificaciones
   - HITL → validar/corregir scores
   - Financial → impacto en USD
   - Dashboard → ver resultados
   - Proposal → generar SOW
   - Report → descargar Word

## Endpoints Útiles

### Auth
- `POST /auth/login` — Login
- `GET /auth/me` — Perfil actual

### Diagnósticos
- `POST /diagnosticos` — Crear
- `GET /diagnosticos` — Listar
- `GET /diagnosticos/:id` — Obtener
- `POST /diagnosticos/:id/classify` — Clasificar
- `POST /diagnosticos/:id/framework` — Seleccionar framework

### Scoring & HITL
- `POST /scoring/:diagnosticoId/pilar/:pilarId/score` — Obtener sugerencias IA
- `POST /scoring/:validacionId/confirmar` — Validar calificación
- `GET /scoring/:diagnosticoId/progress` — Ver progreso

### Financiero
- `POST /financial/:diagnosticoId/pilar/:pilarId` — Calcular impacto
- `GET /financial/:diagnosticoId/summary` — Resumen financiero

### Propuestas
- `POST /proposals/:diagnosticoId/generate` — Generar SOW
- `GET /proposals/:propuestaId` — Obtener propuesta
- `PUT /proposals/:propuestaId` — Editar propuesta
- `POST /proposals/:diagnosticoId/report` — Generar Word

## Debugging

### Logs del Backend
```bash
# Con NODE_ENV=development, logs detallados en stdout
tail -f stdout.log
```

### Logs del Frontend
```bash
# Abre DevTools (F12) en el navegador
# Console tab muestra errores
```

### Reset BD Local
```bash
# Esto borra TODO
dropdb bizpulse
createdb bizpulse

# Luego
npm run migrate
```

## Stack Verificado

- ✅ React 18 + Vite + Tailwind
- ✅ Node.js + Express
- ✅ PostgreSQL + Neon driver
- ✅ OpenAI API (JSON schema)
- ✅ JWT authentication
- ✅ AiBo branding

## Próximos Pasos

1. Obtén OpenAI API Key en https://platform.openai.com/
2. Reemplaza `OPENAI_API_KEY` en `.env.local`
3. Ejecuta los servidores
4. Accede a http://localhost:5173

¡Listo para desarrollar! 🚀
