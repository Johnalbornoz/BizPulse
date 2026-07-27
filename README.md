# BizPulse

Diagnóstico de excelencia empresarial en dos ejes (estado del arte vs. segmento/competencia) diseñado para originar consultoría de transformación.

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS (Vercel)
- **Backend**: Node.js + Express (Render)
- **Database**: PostgreSQL Neon
- **IA**: OpenAI GPT-4o (principal) / Gemini 2.5 Pro (alterno)
- **Auth**: JWT + bcryptjs

## Estructura

```
bizpulse/
├── apps/
│   ├── web/          # Frontend React
│   └── api/          # Backend Node.js
├── docs/             # Documentación
└── README.md
```

## Desarrollo

### Frontend

```bash
cd apps/web
npm install
npm run dev        # Inicia dev server en http://localhost:5173
npm run build      # Build para producción
```

### Backend

```bash
cd apps/api
npm install
npm run dev        # Inicia servidor en http://localhost:3000
npm run migrate    # Ejecuta migraciones de BD
```

## Fases del Diagnóstico

1. **Business Discovery** - Recopilación de contexto
2. **Business Classification** - Clasificación automática
3. **Framework Selection** - Construcción del cuestionario
4. **Adaptive Assessment** - Calificación IA en dos ejes
5. **Validación HITL** - Validación del consultor
6. **Financial Impact** - Cuantificación de impacto
7. **Dashboard** - Consolidación de resultados
8. **Proposal Engine** - Generación de propuesta SOW
9. **Reporte Final** - Descarga de documento ejecutivo

## Documentación

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Decisiones técnicas
- [DATA_MODEL.md](docs/DATA_MODEL.md) - Esquema de BD
- [AI_ENGINES.md](docs/AI_ENGINES.md) - Prompts y schemas
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Guía de deploy

## Deploy

- Frontend: Vercel (auto-deploy desde `main`)
- Backend: Render (auto-deploy desde `main`)
- BD: Neon PostgreSQL (serverless)
