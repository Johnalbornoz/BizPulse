import { create } from 'zustand'

interface Diagnostico {
  id: string
  nombre: string
  estado: string
  clasificacion_industria?: string
  clasificacion_modelo?: string
  snapshot_preguntas?: any[]
}

interface DiagnosticoStore {
  current: Diagnostico | null
  setCurrent: (diagnostico: Diagnostico | null) => void
  updateState: (estado: string) => void
}

export const useDiagnosticoStore = create<DiagnosticoStore>((set) => ({
  current: null,

  setCurrent: (diagnostico: Diagnostico | null) => {
    set({ current: diagnostico })
  },

  updateState: (estado: string) => {
    set((state) => {
      if (state.current) {
        return {
          current: { ...state.current, estado }
        }
      }
      return state
    })
  }
}))
