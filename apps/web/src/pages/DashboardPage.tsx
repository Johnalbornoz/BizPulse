import { useState } from 'react'

export default function DashboardPage() {
  const [diagnosticos, setDiagnosticos] = useState([])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Bienvenido a BizPulse</h2>
        <p className="text-lg opacity-90">
          Diagnóstico de excelencia empresarial en dos ejes: estado del arte vs. segmento/competencia
        </p>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Crear Diagnóstico</h3>
          </div>
          <p className="text-neutral-600 text-sm">
            Iniciar un nuevo diagnóstico de excelencia empresarial
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-secondary/10 p-3 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Ver Diagnósticos</h3>
          </div>
          <p className="text-neutral-600 text-sm">
            Revisar diagnósticos previos y sus resultados
          </p>
        </div>
      </div>

      {/* Diagnósticos List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">Diagnósticos Recientes</h3>
        </div>
        <div className="p-6">
          {diagnosticos.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">
              No hay diagnósticos aún. Crea uno nuevo para comenzar.
            </p>
          ) : (
            <div className="space-y-4">
              {/* Diagnósticos will be listed here */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
