import { createStore } from 'vuex'
import usuario from './modules/usuario.js'
import clima from './modules/clima.js'

const store = createStore({
  modules: {
    usuario,
    clima,
  },
  // strict solo en desarrollo: avisa si cambiamos el state fuera de una mutation
  strict: import.meta.env.DEV,
})

// Cada vez que cambia algo del usuario, lo guardamos en el navegador
// para no perder la sesión ni las preferencias al recargar la página.
store.subscribe((mutation, state) => {
  if (mutation.type.startsWith('usuario/')) {
    try {
      localStorage.setItem(
        'usuarioActual',
        JSON.stringify(state.usuario.usuarioActual),
      )
    } catch {
      // si el navegador no permite localStorage, simplemente lo ignoramos
    }
  }
})

export default store
