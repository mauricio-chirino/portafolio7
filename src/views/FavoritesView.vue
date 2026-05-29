<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { LUGARES } from '../services/weather.js'

const store = useStore()

const favoritosIds = computed(() => store.getters['usuario/favoritos'])

// Filtramos la lista de ciudades para quedarnos solo con las favoritas del usuario
const ciudadesFavoritas = computed(() =>
  LUGARES.filter((lugar) => favoritosIds.value.includes(lugar.id)),
)

function quitar(id) {
  store.commit('usuario/toggleFavorito', id)
}
</script>

<template>
  <section class="favoritos">
    <h1>Mis lugares favoritos</h1>

    <p v-if="ciudadesFavoritas.length === 0">
      Todavía no tienes ciudades favoritas. Agrégalas con la estrella ⭐ en la
      página de inicio.
    </p>

    <ul v-else class="favoritos__lista">
      <li v-for="ciudad in ciudadesFavoritas" :key="ciudad.id">
        <RouterLink :to="{ name: 'detalle', params: { id: ciudad.id } }">
          {{ ciudad.nombre }}
        </RouterLink>
        <button @click="quitar(ciudad.id)">Quitar</button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.favoritos {
  max-width: 480px;
  margin: 2rem auto;
}
.favoritos__lista {
  list-style: none;
  padding: 0;
}
.favoritos__lista li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid #ddd;
}
.favoritos__lista button {
  cursor: pointer;
}
</style>
