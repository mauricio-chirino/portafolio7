<script setup>
defineProps({
  lugar: { type: Object, required: true },
})

defineEmits(['seleccionar'])
</script>

<template>
  <div class="tiempo-card" @click="$emit('seleccionar', lugar.id)">
    <div class="tiempo-card__header">
      <h3 class="tiempo-card__city">{{ lugar.nombre }}</h3>
    </div>

    <div class="tiempo-card__tiempo">
      <div class="tiempo-card__icon">
        <i :class="`bi ${lugar.icono}`"></i>
      </div>
      <div class="tiempo-card__temperature">{{ lugar.temperatura }}°C</div>
      <p class="tiempo-card__description">{{ lugar.descripcion }}</p>
      <p class="tiempo-card__feels">Sensación: {{ lugar.sensacionTermica }}°C</p>
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
