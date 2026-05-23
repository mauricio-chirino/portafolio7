import { createStore } from 'vuex'
import usuario from './modules/usuario.js'

const store = createStore({
  modules: {
    usuario,
  },
  // strict solo en desarrollo: avisa si cambiamos el state fuera de una mutation
  strict: import.meta.env.DEV,
})

export default store
