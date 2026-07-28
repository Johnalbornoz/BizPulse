import pool from '../config/database.js'

export async function createTables() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Tenants
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        sistema_prompt TEXT,
        estado VARCHAR(50) DEFAULT 'activo',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        rol VARCHAR(50) DEFAULT 'Consultor',
        tenant_id INTEGER REFERENCES tenants(id),
        empresa_id INTEGER REFERENCES empresas(id),
        estado VARCHAR(50) DEFAULT 'activo',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Empresas
    await client.query(`
      CREATE TABLE IF NOT EXISTS empresas (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id),
        nombre VARCHAR(255) NOT NULL,
        pais VARCHAR(100),
        industria VARCHAR(100),
        subindustria VARCHAR(100),
        tamaño VARCHAR(50),
        empleados INTEGER,
        facturacion_usd DECIMAL(15, 2),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Unidades de Negocio
    await client.query(`
      CREATE TABLE IF NOT EXISTS unidades_negocio (
        id SERIAL PRIMARY KEY,
        empresa_id INTEGER REFERENCES empresas(id),
        nombre VARCHAR(255) NOT NULL,
        pais VARCHAR(100),
        tipo VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Pilares
    await client.query(`
      CREATE TABLE IF NOT EXISTS pilares (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        orden INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Preguntas
    await client.query(`
      CREATE TABLE IF NOT EXISTS preguntas (
        id SERIAL PRIMARY KEY,
        pilar_id INTEGER REFERENCES pilares(id),
        texto TEXT NOT NULL,
        descripcion_eje1 TEXT,
        descripcion_eje2 TEXT,
        tipo VARCHAR(50),
        opciones JSONB,
        orden INTEGER,
        activa BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Diagnósticos
    await client.query(`
      CREATE TABLE IF NOT EXISTS diagnosticos (
        id SERIAL PRIMARY KEY,
        empresa_id INTEGER REFERENCES empresas(id),
        nombre VARCHAR(255) NOT NULL,
        estado VARCHAR(50) DEFAULT 'discovery',
        fecha_inicio TIMESTAMP DEFAULT NOW(),
        fecha_estimada_cierre TIMESTAMP,
        clasificacion_industria VARCHAR(255),
        clasificacion_modelo VARCHAR(255),
        snapshot_preguntas JSONB,
        resultado_final JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Diagnóstico Documentos
    await client.query(`
      CREATE TABLE IF NOT EXISTS diagnostico_documentos (
        id SERIAL PRIMARY KEY,
        diagnostico_id INTEGER REFERENCES diagnosticos(id),
        tipo VARCHAR(50),
        nombre VARCHAR(255),
        url_s3 VARCHAR(500),
        contenido_extractado TEXT,
        analisis_ia JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Diagnóstico Entrevistas
    await client.query(`
      CREATE TABLE IF NOT EXISTS diagnostico_entrevistas (
        id SERIAL PRIMARY KEY,
        diagnostico_id INTEGER REFERENCES diagnosticos(id),
        tipo VARCHAR(50),
        audio_url_s3 VARCHAR(500),
        transcript TEXT,
        analisis_ia JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Diagnóstico Validaciones HITL
    await client.query(`
      CREATE TABLE IF NOT EXISTS diagnostico_validaciones_hitl (
        id SERIAL PRIMARY KEY,
        diagnostico_id INTEGER REFERENCES diagnosticos(id),
        pilar_id INTEGER REFERENCES pilares(id),
        pregunta_id INTEGER REFERENCES preguntas(id),
        sugerencia_ia_eje1 INTEGER,
        sugerencia_ia_eje2 INTEGER,
        argumentacion_ia_eje1 TEXT,
        argumentacion_ia_eje2 TEXT,
        calificacion_final_eje1 INTEGER,
        calificacion_final_eje2 INTEGER,
        argumentacion_experto_eje1 TEXT,
        argumentacion_experto_eje2 TEXT,
        validado_por INTEGER REFERENCES usuarios(id),
        validado_en TIMESTAMP,
        impacto_financiero_eje1 JSONB,
        impacto_financiero_eje2 JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Segmentos de Negocio
    await client.query(`
      CREATE TABLE IF NOT EXISTS segmentos_negocio (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id),
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        industria_principal VARCHAR(100),
        estado VARCHAR(50) DEFAULT 'activo',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Benchmarks Segmento
    await client.query(`
      CREATE TABLE IF NOT EXISTS benchmarks_segmento (
        id SERIAL PRIMARY KEY,
        segmento_id INTEGER REFERENCES segmentos_negocio(id),
        pilar_id INTEGER REFERENCES pilares(id),
        industria VARCHAR(100),
        subindustria VARCHAR(100),
        metrica_nombre VARCHAR(255),
        score_promedio INTEGER,
        rango_min INTEGER,
        rango_max INTEGER,
        fuente VARCHAR(255),
        anio INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Roadmap Items
    await client.query(`
      CREATE TABLE IF NOT EXISTS roadmap_items (
        id SERIAL PRIMARY KEY,
        diagnostico_id INTEGER REFERENCES diagnosticos(id),
        pilar_id INTEGER REFERENCES pilares(id),
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        fase_propuesta VARCHAR(50),
        alcance_estimado TEXT,
        esfuerzo_horas INTEGER,
        impacto_estimado_usd DECIMAL(15, 2),
        prioridad INTEGER,
        estado VARCHAR(50),
        dueño VARCHAR(255),
        fecha_vencimiento DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Propuestas Preliminares
    await client.query(`
      CREATE TABLE IF NOT EXISTS propuestas_preliminares (
        id SERIAL PRIMARY KEY,
        diagnostico_id INTEGER REFERENCES diagnosticos(id),
        titulo VARCHAR(255),
        contenido_propuesta TEXT,
        fases JSONB,
        roi_estimado DECIMAL(10, 2),
        generada_en TIMESTAMP,
        editada_por INTEGER REFERENCES usuarios(id),
        editada_en TIMESTAMP,
        estado VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Reportes Finales
    await client.query(`
      CREATE TABLE IF NOT EXISTS reportes_finales (
        id SERIAL PRIMARY KEY,
        diagnostico_id INTEGER REFERENCES diagnosticos(id),
        tipo VARCHAR(50),
        url_generada VARCHAR(500),
        contenido_json JSONB,
        generada_en TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
