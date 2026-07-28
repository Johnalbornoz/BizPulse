import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout, AdminTable, AdminModal } from '../../components/Admin'
import { useAuthStore } from '../../store/auth'

interface Segmento {
  id: number
  nombre: string
  descripcion: string
  industria_principal: string
  estado: string
  created_at: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

const CAMPOS_FORMULARIO = [
  { key: 'nombre', label: 'Nombre', type: 'text' as const, required: true, placeholder: 'Nombre del segmento' },
  { key: 'descripcion', label: 'Descripción', type: 'textarea' as const, placeholder: 'Descripción del segmento' },
  { key: 'industria_principal', label: 'Industria Principal', type: 'text' as const, placeholder: 'Industria principal' },
  {
    key: 'estado',
    label: 'Estado',
    type: 'select' as const,
    options: [
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' }
    ]
  }
]

export default function AdminSegmentos() {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const [segmentos, setSegmentos] = useState<Segmento[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({ page: 1, limit: 20, total: 0, pages: 0 })
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [selectedSegmento, setSelectedSegmento] = useState<Segmento | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL || '/api'
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!user || user.rol !== 'SuperAdmin') {
      navigate('/')
      return
    }

    fetchSegmentos()
  }, [user, token, pagination.page, search, navigate])

  const fetchSegmentos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search
      })

      const res = await fetch(`${apiUrl}/admin/segmentos?${params}`, { headers })
      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()
      setSegmentos(data.data)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching segmentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData: any) => {
    try {
      setSubmitting(true)
      const res = await fetch(`${apiUrl}/admin/segmentos`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to create')
      await fetchSegmentos()
    } catch (error) {
      console.error('Error creating segmento:', error)
      alert('Error al crear segmento')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (formData: any) => {
    try {
      setSubmitting(true)
      const res = await fetch(`${apiUrl}/admin/segmentos/${editingId}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to update')
      await fetchSegmentos()
    } catch (error) {
      console.error('Error updating segmento:', error)
      alert('Error al actualizar segmento')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (segmento: Segmento) => {
    if (!confirm(`¿Eliminar segmento "${segmento.nombre}"?`)) return

    try {
      const res = await fetch(`${apiUrl}/admin/segmentos/${segmento.id}`, {
        method: 'DELETE',
        headers
      })

      if (!res.ok) throw new Error('Failed to delete')
      await fetchSegmentos()
    } catch (error) {
      console.error('Error deleting segmento:', error)
      alert('Error al eliminar segmento')
    }
  }

  const handleEdit = (segmento: Segmento) => {
    setSelectedSegmento(segmento)
    setEditingId(segmento.id)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setSelectedSegmento(null)
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
    { key: 'industria_principal', label: 'Industria' },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (val: any) => (
        <div className="max-w-xs truncate text-sm text-aibo-slate">
          {val || '-'}
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val: any) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          val === 'activo'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {val}
        </span>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-aibo-navy">Gestión de Segmentos</h2>
            <p className="text-aibo-slate">Define y administra segmentos de negocio</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setSelectedSegmento(null)
              setModalOpen(true)
            }}
            className="px-6 py-3 rounded-lg bg-aibo-blue text-white font-medium hover:bg-aibo-signal transition-all flex items-center gap-2 shadow-lg"
          >
            + Nuevo Segmento
          </button>
        </div>

        {/* Table */}
        <AdminTable
          columns={columns}
          data={segmentos}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Buscar segmento..."
        />

        {/* Modal */}
        <AdminModal
          title={editingId ? 'Editar Segmento' : 'Nuevo Segmento'}
          fields={CAMPOS_FORMULARIO}
          initialData={selectedSegmento || {}}
          isOpen={modalOpen}
          isLoading={submitting}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  )
}
