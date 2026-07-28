import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout, AdminTable, AdminModal } from '../../components/Admin'
import { useAuthStore } from '../../store/auth'

interface Empresa {
  id: number
  nombre: string
  pais: string
  industria: string
  tamaño: string
  empleados: number
  facturacion_usd: number
}

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

const CAMPOS_FORMULARIO = [
  { key: 'nombre', label: 'Nombre', type: 'text' as const, required: true, placeholder: 'Nombre de la empresa' },
  { key: 'pais', label: 'País', type: 'text' as const, placeholder: 'País' },
  { key: 'industria', label: 'Industria', type: 'text' as const, placeholder: 'Industria principal' },
  { key: 'subindustria', label: 'Sub-industria', type: 'text' as const, placeholder: 'Sub-categoría' },
  {
    key: 'tamaño',
    label: 'Tamaño',
    type: 'select' as const,
    options: [
      { value: 'Pequeña', label: 'Pequeña (1-50)' },
      { value: 'Mediana', label: 'Mediana (51-500)' },
      { value: 'Grande', label: 'Grande (501+)' }
    ]
  },
  { key: 'empleados', label: 'Empleados', type: 'number' as const, placeholder: 'Número de empleados' },
  { key: 'facturacion_usd', label: 'Facturación USD', type: 'number' as const, placeholder: 'Facturación anual' },
  { key: 'sitio_web', label: 'Sitio Web', type: 'text' as const, placeholder: 'https://...' }
]

export default function AdminEmpresas() {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({ page: 1, limit: 20, total: 0, pages: 0 })
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL || '/api'
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!user || user.rol !== 'SuperAdmin') {
      navigate('/')
      return
    }

    fetchEmpresas()
  }, [user, token, pagination.page, search, navigate])

  const fetchEmpresas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search
      })

      const res = await fetch(`${apiUrl}/admin/empresas?${params}`, { headers })
      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()
      setEmpresas(data.data)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching empresas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData: any) => {
    try {
      setSubmitting(true)
      const res = await fetch(`${apiUrl}/admin/empresas`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to create')
      await fetchEmpresas()
    } catch (error) {
      console.error('Error creating empresa:', error)
      alert('Error al crear empresa')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (formData: any) => {
    try {
      setSubmitting(true)
      const res = await fetch(`${apiUrl}/admin/empresas/${editingId}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to update')
      await fetchEmpresas()
    } catch (error) {
      console.error('Error updating empresa:', error)
      alert('Error al actualizar empresa')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (empresa: Empresa) => {
    if (!confirm(`¿Eliminar empresa "${empresa.nombre}"?`)) return

    try {
      const res = await fetch(`${apiUrl}/admin/empresas/${empresa.id}`, {
        method: 'DELETE',
        headers
      })

      if (!res.ok) throw new Error('Failed to delete')
      await fetchEmpresas()
    } catch (error) {
      console.error('Error deleting empresa:', error)
      alert('Error al eliminar empresa')
    }
  }

  const handleEdit = (empresa: Empresa) => {
    setSelectedEmpresa(empresa)
    setEditingId(empresa.id)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setSelectedEmpresa(null)
  }

  const handleSubmit = async (formData: any) => {
    if (editingId) {
      await handleUpdate(formData)
    } else {
      await handleCreate(formData)
    }
    handleCloseModal()
  }

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'pais', label: 'País' },
    { key: 'industria', label: 'Industria' },
    {
      key: 'empleados',
      label: 'Empleados',
      render: (val: any) => val ? val.toLocaleString() : '-'
    },
    {
      key: 'facturacion_usd',
      label: 'Facturación (USD)',
      render: (val: any) => val ? `$${(val/1000000).toFixed(1)}M` : '-'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-aibo-navy">Gestión de Empresas</h2>
            <p className="text-aibo-slate">Administra todas las empresas registradas</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setSelectedEmpresa(null)
              setModalOpen(true)
            }}
            className="px-6 py-3 rounded-lg bg-aibo-blue text-white font-medium hover:bg-aibo-signal transition-all flex items-center gap-2 shadow-lg"
          >
            + Nueva Empresa
          </button>
        </div>

        {/* Table */}
        <AdminTable
          columns={columns}
          data={empresas}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Buscar empresa por nombre o país..."
        />

        {/* Modal */}
        <AdminModal
          title={editingId ? 'Editar Empresa' : 'Nueva Empresa'}
          fields={CAMPOS_FORMULARIO}
          initialData={selectedEmpresa || {}}
          isOpen={modalOpen}
          isLoading={submitting}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  )
}
