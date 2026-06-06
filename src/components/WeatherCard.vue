<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineProps({
  lugar: { type: Object, required: true },
})

defineEmits(['seleccionar'])

const store = useStore()

const logueado = computed(() => store.getters['usuario/isAuthenticated'])
const unidad = computed(() => store.getters['usuario/unidad'])

// Convierte la temperatura según la preferencia del usuario (°C o °F)
function aTemp(celsius) {
  if (unidad.value === 'F') {
    return Math.round((celsius * 9) / 5 + 32)
  }
  return celsius
}

function esFavorito(id) {
  return store.getters['usuario/esFavorito'](id)
}

function alternarFavorito(id) {
  store.commit('usuario/toggleFavorito', id)
}
</script>

<template>
  <div class="tiempo-card" @click="$emit('seleccionar', lugar.id)">
    <div class="tiempo-card__header">
      <h3 class="tiempo-card__city">{{ lugar.nombre }}</h3>

      <!-- Estrella de favorito: solo si hay sesión.
           @click.stop evita que también se abra el detalle. -->
      <button
        v-if="logueado"
        class="tiempo-card__fav"
        :title="esFavorito(lugar.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        @click.stop="alternarFavorito(lugar.id)"
      >
        <i class="bi" :class="esFavorito(lugar.id) ? 'bi-star-fill' : 'bi-star'"></i>
      </button>
    </div>

    <div class="tiempo-card__tiempo">
      <div class="tiempo-card__icon">
        <i :class="`bi ${lugar.icono}`"></i>
      </div>
      <div class="tiempo-card__temperature">{{ aTemp(lugar.temperatura) }}°{{ unidad }}</div>
      <p class="tiempo-card__description">{{ lugar.descripcion }}</p>
      <p class="tiempo-card__feels">Sensación: {{ aTemp(lugar.sensacionTermica) }}°{{ unidad }}</p>
    </div>

    <div class="tiempo-card__details">
      <div class="tiempo-card__detail">
        <i class="bi bi-droplet tiempo-card__detail-icon tiempo-card__detail-icon--humidity"></i>
        <p class="tiempo-card__detail-label">Humedad</p>
        <p class="tiempo-card__detail-value">{{ lugar.humedad }}%</p>
      </div>
      <div class="tiempo-card__detail">
        <i class="bi bi-wind tiempo-card__detail-icon tiempo-card__detail-icon--wind"></i>
        <p class="tiempo-card__detail-label">Viento</p>
        <p class="tiempo-card__detail-value">{{ lugar.viento }} km/h {{ lugar.dirViento }}</p>
      </div>
      <div class="tiempo-card__detail">
        <i class="bi bi-clouds tiempo-card__detail-icon" style="color:#6c757d"></i>
        <p class="tiempo-card__detail-label">Nubosidad</p>
        <p class="tiempo-card__detail-value">{{ lugar.nubosidad }}%</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tiempo-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tiempo-card__fav {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #f5b301;
}
</style>
