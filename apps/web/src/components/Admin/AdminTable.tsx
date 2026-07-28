import { useState } from 'react'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface TableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  onPageChange?: (page: number) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  placeholder?: string
}

export default function AdminTable({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  searchValue = '',
  onSearchChange,
  placeholder = 'Buscar...'
}: TableProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(data.map((_, i) => i))
    }
  }

  const toggleSelect = (index: number) => {
    setSelectedRows(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-aibo-mist p-6">
      {/* Search Bar */}
      {onSearchChange && (
        <div className="mb-6">
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-aibo-line focus:outline-none focus:ring-2 focus:ring-aibo-blue focus:border-transparent"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-aibo-mist">
              {onEdit && onDelete && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-aibo-line"
                  />
                </th>
              )}
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold text-aibo-navy">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3 text-left font-semibold text-aibo-navy">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-aibo-slate">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-aibo-blue border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-aibo-slate">
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-aibo-line hover:bg-aibo-cloud/30 transition-colors">
                  {onEdit && onDelete && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(rowIndex)}
                        onChange={() => toggleSelect(rowIndex)}
                        className="w-4 h-4 rounded border-aibo-line"
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-aibo-navy">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="px-3 py-1 text-xs font-medium text-aibo-blue bg-aibo-cloud rounded-lg hover:bg-aibo-line transition-colors"
                          >
                            ✎ Editar
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            🗑️ Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-aibo-slate">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg border border-aibo-line text-aibo-navy disabled:opacity-50 hover:bg-aibo-cloud transition-colors"
            >
              ← Anterior
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange?.(i + 1)}
                  className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                    pagination.page === i + 1
                      ? 'bg-aibo-blue text-white'
                      : 'border border-aibo-line text-aibo-navy hover:bg-aibo-cloud'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 rounded-lg border border-aibo-line text-aibo-navy disabled:opacity-50 hover:bg-aibo-cloud transition-colors"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
