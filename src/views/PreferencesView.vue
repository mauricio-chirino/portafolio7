<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// Usamos computed con get/set para conectar el formulario con el store:
// al leer, toma el valor del store; al cambiar, hace commit de la mutation.
const unidad = computed({
  get: () => store.getters['usuario/unidad'],
  set: (valor) => store.commit('usuario/setUnidad', valor),
})

const tema = computed({
  get: () => store.getters['usuario/tema'],
  set: (valor) => store.commit('usuario/setTema', valor),
})
</script>

<template>
  <section class="prefs">
    <h1>Mis preferencias de clima</h1>

    <div class="prefs__grupo">
      <p class="prefs__label">Unidad de temperatura:</p>
      <label>
        <input type="radio" value="C" v-model="unidad" /> Celsius (°C)
      </label>
      <label>
        <input type="radio" value="F" v-model="unidad" /> Fahrenheit (°F)
      </label>
    </div>

    <div class="prefs__grupo">
      <p class="prefs__label">Tema:</p>
      <select v-model="tema">
        <option value="claro">Claro</option>
        <option value="oscuro">Oscuro</option>
      </select>
    </div>

    <p class="prefs__nota">
      Tu preferencia de unidad se aplica al instante en las tarjetas de inicio.
    </p>
  </section>
</template>

<style scoped>
.prefs {
  max-width: 480px;
  margin: 2rem auto;
}
.prefs__grupo {
  margin-bottom: 1.2rem;
}
.prefs__label {
  font-weight: bold;
  margin-bottom: 0.3rem;
}
.prefs__grupo label {
  margin-right: 1rem;
}
.prefs__nota {
  color: #666;
  font-size: 0.9rem;
}
</style>
