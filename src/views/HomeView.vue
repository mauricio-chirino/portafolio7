<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import WeatherCard from '../components/WeatherCard.vue'

const router = useRouter()
const store = useStore()

const busqueda = ref('')

// Los datos del clima vienen del store (módulo clima)
const lugares = computed(() => store.state.clima.lugares)
const cargando = computed(() => store.state.clima.cargando)
const error = computed(() => store.state.clima.error)

const lugaresFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return lugares.value
  return lugares.value.filter(l => l.nombre.toLowerCase().includes(q))
})

onMounted(() => {
  // Si todavía no tenemos las ciudades, las pedimos.
  // (Así no se vuelve a cargar al regresar del detalle.)
  if (store.state.clima.lugares.length === 0) {
    store.dispatch('clima/cargarLugares')
  }
})

function irADetalle(id) {
  router.push({ name: 'detalle', params: { id } })
}
</script>

<template>
  <section class="home">
    <div class="home__hero">
      <h1 class="home__title">Pronóstico del Tiempo</h1>
      <p class="home__subtitle">Selecciona una ciudad para ver el pronóstico detallado</p>
    </div>

    <!-- Buscador -->
    <div class="home__search">
      <input
        v-model="busqueda"
        class="home__search-input"
        type="text"
        placeholder="🔍 Buscar ciudad..."
      />
    </div>

    <p v-if="cargando" class="loading-msg">
      <i class="bi bi-cloud-download"></i> Cargando datos del clima...
    </p>
    <p v-else-if="error" class="error-msg">
      <i class="bi bi-exclamation-triangle"></i> Error al cargar los datos. Intenta de nuevo.
    </p>

    <div v-else class="home__grid">
      <WeatherCard
        v-for="lugar in lugaresFiltrados"
        :key="lugar.id"
        :lugar="lugar"
        @seleccionar="irADetalle"
      />
      <p v-show="lugaresFiltrados.length === 0 && busqueda" class="home__no-results">
        <i class="bi bi-search"></i> No se encontró ninguna ciudad con "{{ busqueda }}"
      </p>
    </div>
  </section>
</template>
