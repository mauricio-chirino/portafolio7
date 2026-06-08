import {
  LUGARES,
  fetchClima,
  parsearActual,
  fetchPronostico,
  procesarPronostico,
  calcularEstadisticas,
  generarAlertas,
} from '../../services/weather.js'

// Módulo de Vuex para los datos del clima (lista de ciudades y lugar seleccionado).
export default {
  namespaced: true,

  state() {
    return {
      lugares: [],        // lista de ciudades con su clima actual (Home)
      seleccionado: null, // datos del lugar abierto en el Detalle
      cargando: false,
      error: false,
    }
  },

  mutations: {
    setLugares(state, lugares) {
      state.lugares = lugares
    },
    setSeleccionado(state, datos) {
      state.seleccionado = datos
    },
    setCargando(state, valor) {
      state.cargando = valor
    },
    setError(state, valor) {
      state.error = valor
    },
  },

  actions: {
    // Carga el clima actual de todas las ciudades para la Home
    async cargarLugares({ commit }) {
      commit('setCargando', true)
      commit('setError', false)
      try {
        const peticiones = LUGARES.map(async (lugar) => {
          try {
            const datos = await fetchClima(lugar.lat, lugar.lon)
            return { id: lugar.id, nombre: lugar.nombre, ...parsearActual(datos.current) }
          } catch {
            return null
          }
        })
        const resultados = await Promise.all(peticiones)
        commit('setLugares', resultados.filter(Boolean))
      } catch {
        commit('setError', true)
      } finally {
        commit('setCargando', false)
      }
    },

    // Carga el pronóstico completo de una ciudad para el Detalle
    async cargarDetalle({ commit }, id) {
      const lugar = LUGARES.find((l) => l.id === Number(id))
      if (!lugar) {
        commit('setSeleccionado', null)
        return
      }
      commit('setCargando', true)
      commit('setError', false)
      try {
        const datos = await fetchPronostico(lugar.lat, lugar.lon)
        const pronostico = procesarPronostico(datos.daily)
        const stats = calcularEstadisticas(pronostico)
        commit('setSeleccionado', {
          lugar,
          actual: parsearActual(datos.current),
          pronostico,
          stats,
          alertas: generarAlertas(stats, pronostico),
        })
      } catch {
        commit('setError', true)
      } finally {
        commit('setCargando', false)
      }
    },
  },
}
