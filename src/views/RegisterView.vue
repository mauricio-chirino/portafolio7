<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const nombre = ref('')
const correo = ref('')
const password = ref('')

const error = computed(() => store.state.usuario.error)

async function registrar() {
  const ok = await store.dispatch('usuario/registrar', {
    nombre: nombre.value,
    correo: correo.value,
    password: password.value,
  })
  if (ok) {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <section class="auth">
    <h1>Crear cuenta</h1>

    <form class="auth__form" @submit.prevent="registrar">
      <label>Nombre</label>
      <input v-model="nombre" type="text" />

      <label>Correo</label>
      <input v-model="correo" type="text" />

      <label>Contraseña</label>
      <input v-model="password" type="password" />

      <button type="submit">Registrarme</button>
    </form>

    <p v-if="error" class="auth__error">{{ error }}</p>

    <p>¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink></p>
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
</style>
