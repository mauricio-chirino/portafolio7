<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WeatherCard from '../components/WeatherCard.vue'
import { LUGARES, fetchClima, parsearActual } from '../services/weather.js'

const router = useRouter()

const lugares = ref([])
const cargando = ref(true)
const error = ref(false)
const busqueda = ref('')

const lugaresFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return lugares.value
  return lugares.value.filter(l => l.nombre.toLowerCase().includes(q))
})

onMounted(async () => {
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
    lugares.value = resultados.filter(Boolean)
  } catch {
    error.value = true
  } finally {
    cargando.value = false
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
      <p v-show="lugaresFiltrados.length === 0" class="home__no-results">
        <i class="bi bi-search"></i> No se encontró ninguna ciudad con "{{ busqueda }}"
      </p>
    </div>
  </section>
</template>
