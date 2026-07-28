import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout, AdminTable, AdminModal } from '../../components/Admin'
import { useAuthStore } from '../../store/auth'

interface Usuario {
  id: number
  email: string
  nombre: string
  rol: string
  empresa_id?: number
  estado: string
  created_at: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

const CAMPOS_CREAR = [
  { key: 'email', label: 'Email', type: 'email' as const, required: true, placeholder: 'usuario@example.com' },
  { key: 'nombre', label: 'Nombre', type: 'text' as const, required: true, placeholder: 'Nombre completo' },
  {
    key: 'rol',
    label: 'Rol',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'SuperAdmin', label: 'SuperAdmin' },
      { value: 'Admin', label: 'Admin' },
      { value: 'Consultor', label: 'Consultor' }
    ]
  }
]

const CAMPOS_EDITAR = [
  { key: 'nombre', label: 'Nombre', type: 'text' as const, required: true, placeholder: 'Nombre completo' },
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

export default function AdminUsuarios() {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({ page: 1, limit: 20, total: 0, pages: 0 })
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const [tempPassword, setTempPassword] = useState<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL || '/api'
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!user || user.rol !== 'SuperAdmin') {
      navigate('/')
      return
    }

    fetchUsuarios()
  }, [user, token, pagination.page, search, navigate])

  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search
      })

      const res = await fetch(`${apiUrl}/admin/usuarios?${params}`, { headers })
      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()
      setUsuarios(data.data)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData: any) => {
    try {
      setSubmitting(true)
      const res = await fetch(`${apiUrl}/admin/usuarios`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to create')
      const result = await res.json()
      setTempPassword(result.tempPassword)
      setTimeout(() => {
        setTempPassword(null)
        fetchUsuarios()
      }, 3000)
    } catch (error) {
      console.error('Error creating usuario:', error)
      alert('Error al crear usuario')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (formData: any) => {
    try {
      setSubmitting(true)
      const res = await fetch(`${apiUrl}/admin/usuarios/${editingId}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to update')
      await fetchUsuarios()
    } catch (error) {
      console.error('Error updating usuario:', error)
      alert('Error al actualizar usuario')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (usuario: Usuario) => {
    if (!confirm(`¿Eliminar usuario "${usuario.nombre}"?`)) return

    try {
      const res = await fetch(`${apiUrl}/admin/usuarios/${usuario.id}`, {
        method: 'DELETE',
        headers
      })

      if (!res.ok) throw new Error('Failed to delete')
      await fetchUsuarios()
    } catch (error) {
      console.error('Error deleting usuario:', error)
      alert('Error al eliminar usuario')
    }
  }

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario)
    setEditingId(usuario.id)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setSelectedUsuario(null)
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
    { key: 'email', label: 'Email' },
    {
      key: 'rol',
      label: 'Rol',
      render: (val: any) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-aibo-cloud text-aibo-navy">
          {val}
        </span>
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
            <h2 className="text-2xl font-bold text-aibo-navy">Gestión de Usuarios</h2>
            <p className="text-aibo-slate">Administra usuarios y roles</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setSelectedUsuario(null)
              setModalOpen(true)
            }}
            className="px-6 py-3 rounded-lg bg-aibo-blue text-white font-medium hover:bg-aibo-signal transition-all flex items-center gap-2 shadow-lg"
          >
            + Nuevo Usuario
          </button>
        </div>

        {/* Temp Password Alert */}
        {tempPassword && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="font-semibold text-green-900">Usuario creado exitosamente</p>
            <p className="text-sm text-green-700 mt-2">
              Contraseña temporal: <code className="bg-green-100 px-2 py-1 rounded font-mono">{tempPassword}</code>
            </p>
          </div>
        )}

        {/* Table */}
        <AdminTable
          columns={columns}
          data={usuarios}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Buscar usuario por nombre o email..."
        />

        {/* Modal */}
        <AdminModal
          title={editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
          fields={editingId ? CAMPOS_EDITAR : CAMPOS_CREAR}
          initialData={selectedUsuario || {}}
          isOpen={modalOpen}
          isLoading={submitting}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  )
}
