import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import DiagnosisFlowPage from './pages/DiagnosisFlowPage'
import BusinessDiscoveryPage from './pages/BusinessDiscoveryPage'
import ClassificationPage from './pages/ClassificationPage'
import FrameworkPage from './pages/FrameworkPage'
import AssessmentPage from './pages/AssessmentPage'
import ValidationHITLPage from './pages/ValidationHITLPage'
import RoadmapPage from './pages/RoadmapPage'
import FinancialImpactPage from './pages/FinancialImpactPage'
import ResultsDashboardPage from './pages/ResultsDashboardPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEmpresas from './pages/admin/AdminEmpresas'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminSegmentos from './pages/admin/AdminSegmentos'

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-aibo-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-aibo-slate mt-4">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <Route path="*" element={<LoginPage />} />
        ) : (
          <>
            {/* Admin Routes - Must come before DashboardLayout */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/empresas" element={<AdminEmpresas />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/segmentos" element={<AdminSegmentos />} />

            {/* Diagnosis Routes */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="diagnosis/:diagnosticoId" element={<DiagnosisFlowPage />} />
              <Route path="discovery/:diagnosticoId" element={<BusinessDiscoveryPage />} />
              <Route path="classification/:diagnosticoId" element={<ClassificationPage />} />
              <Route path="framework/:diagnosticoId" element={<FrameworkPage />} />
              <Route path="assessment/:diagnosticoId" element={<AssessmentPage />} />
              <Route path="validation/:diagnosticoId" element={<ValidationHITLPage />} />
              <Route path="financial/:diagnosticoId" element={<FinancialImpactPage />} />
              <Route path="roadmap/:diagnosticoId" element={<RoadmapPage />} />
              <Route path="proposal/:diagnosticoId" element={<ResultsDashboardPage />} />
              <Route path="results/:diagnosticoId" element={<ResultsDashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
