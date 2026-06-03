<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const logueado = computed(() => store.getters['usuario/isAuthenticated'])
const nombre = computed(() => store.getters['usuario/nombre'])
const tema = computed(() => store.getters['usuario/tema'])

function cerrarSesion() {
  store.dispatch('usuario/logout')
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="app" :class="{ 'app--oscuro': tema === 'oscuro' }">
    <header>
      <nav class="navbar navbar-expand-lg navbar-light header__navbar">
        <div class="container">
          <RouterLink class="navbar-brand header__brand" to="/">
            <i class="bi bi-cloud-sun header__brand-icon"></i>App del Tiempo
          </RouterLink>

          <div class="navbar-collapse">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <RouterLink class="nav-link header__nav-link" to="/">Inicio</RouterLink>
              </li>

              <!-- Opciones cuando HAY sesión -->
              <template v-if="logueado">
                <li class="nav-item">
                  <RouterLink class="nav-link header__nav-link" to="/favoritos">Favoritos</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link header__nav-link" to="/preferencias">Preferencias</RouterLink>
                </li>
                <li class="nav-item header__saludo">Hola, {{ nombre }}</li>
                <li class="nav-item">
                  <button class="header__logout" @click="cerrarSesion">Cerrar sesión</button>
                </li>
              </template>

              <!-- Opciones cuando NO hay sesión -->
              <template v-else>
                <li class="nav-item">
                  <RouterLink class="nav-link header__nav-link" to="/login">Iniciar sesión</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link header__nav-link" to="/registro">Registro</RouterLink>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <main class="container my-4">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="container footer__container">
        <p class="footer__text">© 2026 App del Tiempo — Módulo 7</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app--oscuro {
  background: #15151f;
  color: #eaeaea;
  min-height: 100vh;
}
.header__saludo {
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 0 0.75rem;
}
.header__logout {
  background: none;
  border: 1px solid currentColor;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  color: inherit;
}
</style>
