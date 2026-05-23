import { buscarUsuario, USUARIOS } from '../../services/usuarios.js'

// Módulo de Vuex para la sesión y la personalización del usuario.
export default {
  namespaced: true,

  state() {
    return {
      usuarioActual: null, // null = no hay sesión iniciada
      error: '',
    }
  },

  getters: {
    isAuthenticated: (state) => state.usuarioActual !== null,
    nombre: (state) => (state.usuarioActual ? state.usuarioActual.nombre : ''),
    favoritos: (state) =>
      state.usuarioActual ? state.usuarioActual.favoritos : [],
    // Devuelve una función para preguntar si una ciudad es favorita
    esFavorito: (state) => (id) =>
      state.usuarioActual ? state.usuarioActual.favoritos.includes(id) : false,
    unidad: (state) =>
      state.usuarioActual ? state.usuarioActual.preferencias.unidad : 'C',
    tema: (state) =>
      state.usuarioActual ? state.usuarioActual.preferencias.tema : 'claro',
  },

  // Las mutations son síncronas y son el único lugar donde cambia el state
  mutations: {
    setUsuario(state, usuario) {
      state.usuarioActual = usuario
    },
    limpiarUsuario(state) {
      state.usuarioActual = null
    },
    setError(state, mensaje) {
      state.error = mensaje
    },
    toggleFavorito(state, id) {
      if (!state.usuarioActual) return
      const favs = state.usuarioActual.favoritos
      if (favs.includes(id)) {
        state.usuarioActual.favoritos = favs.filter((f) => f !== id)
      } else {
        state.usuarioActual.favoritos = [...favs, id]
      }
    },
    setUnidad(state, unidad) {
      if (state.usuarioActual) state.usuarioActual.preferencias.unidad = unidad
    },
    setTema(state, tema) {
      if (state.usuarioActual) state.usuarioActual.preferencias.tema = tema
    },
  },

  actions: {
    login({ commit }, { correo, password }) {
      commit('setError', '')
      const usuario = buscarUsuario(correo, password)
      if (!usuario) {
        commit('setError', 'Usuario o contraseña incorrectos')
        return false
      }
      // Guardamos una copia para no modificar el usuario "original"
      commit('setUsuario', {
        nombre: usuario.nombre,
        correo: usuario.correo,
        favoritos: [...usuario.favoritos],
        preferencias: { ...usuario.preferencias },
      })
      return true
    },

    logout({ commit }) {
      commit('limpiarUsuario')
    },

    registrar({ commit }, { nombre, correo, password }) {
      commit('setError', '')
      // Si el correo ya existe, no dejamos registrar
      if (USUARIOS.some((u) => u.correo === correo)) {
        commit('setError', 'Ese correo ya está registrado')
        return false
      }
      const nuevo = {
        nombre,
        correo,
        password,
        favoritos: [],
        preferencias: { unidad: 'C', tema: 'claro' },
      }
      USUARIOS.push(nuevo) // lo agregamos a la lista falsa
      commit('setUsuario', {
        nombre,
        correo,
        favoritos: [],
        preferencias: { unidad: 'C', tema: 'claro' },
      })
      return true
    },
  },
}
