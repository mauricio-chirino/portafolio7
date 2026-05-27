<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const store = useStore()
const router = useRouter()
const route = useRoute()

// El formulario es local (no está en el store)
const correo = ref('')
const password = ref('')

const error = computed(() => store.state.usuario.error)

async function entrar() {
  const ok = await store.dispatch('usuario/login', {
    correo: correo.value,
    password: password.value,
  })
  if (ok) {
    // Si veníamos de una ruta protegida, volvemos a ella; si no, a Home
    const destino = route.query.redirect || { name: 'home' }
    router.push(destino)
  }
}
</script>

<template>
  <section class="auth">
    <h1>Iniciar sesión</h1>

    <form class="auth__form" @submit.prevent="entrar">
      <label>Correo</label>
      <input v-model="correo" type="text" />

      <label>Contraseña</label>
      <input v-model="password" type="password" />

      <button type="submit">Entrar</button>
    </form>

    <p v-if="error" class="auth__error">{{ error }}</p>

    <p>¿No tienes cuenta? <RouterLink to="/registro">Regístrate</RouterLink></p>
    <p class="auth__hint">Prueba con <b>ana@clima.com</b> y contraseña <b>1234</b></p>
  </section>
</template>

<style scoped>
.auth {
  max-width: 360px;
  margin: 2rem auto;
}
.auth__form {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}
.auth__form input {
  padding: 0.5rem;
}
.auth__form button {
  padding: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
}
.auth__error {
  color: #c0392b;
  font-weight: bold;
}
.auth__hint {
  color: #666;
  font-size: 0.9rem;
}
</style>
