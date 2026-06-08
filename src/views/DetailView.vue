<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { LUGARES } from '../services/weather.js'

const route = useRoute()
const router = useRouter()
const store = useStore()

// Temperatura en la unidad del usuario (getter del store)
const tempTexto = computed(() => store.getters['usuario/tempTexto'])

// Sabemos al instante si la ciudad existe (sin esperar a la API)
const lugarBase = computed(() => LUGARES.find(l => l.id === Number(route.params.id)))

// Los datos del clima vienen del store (módulo clima)
const cargando = computed(() => store.state.clima.cargando)
const error = computed(() => store.state.clima.error)
const seleccionado = computed(() => store.state.clima.seleccionado)

// Atajos para el template (disponibles cuando ya hay datos cargados)
const actual = computed(() => seleccionado.value?.actual)
const pronostico = computed(() => seleccionado.value?.pronostico || [])
const stats = computed(() => seleccionado.value?.stats)
const alertas = computed(() => seleccionado.value?.alertas || [])

const fechaHoy = new Date().toLocaleDateString('es-ES', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
})

function cargar() {
  if (!lugarBase.value) { router.push('/'); return }
  store.dispatch('clima/cargarDetalle', route.params.id)
}

onMounted(cargar)
watch(() => route.params.id, cargar)
</script>

<template>
  <section class="detail" v-if="lugarBase">
    <button class="btn--back" @click="router.push('/')">
      <i class="bi bi-arrow-left btn--back-icon"></i>Volver al Inicio
    </button>

    <p v-if="cargando" class="loading-msg">
      <i class="bi bi-cloud-download"></i> Cargando datos de {{ lugarBase.nombre }}...
    </p>
    <p v-else-if="error" class="error-msg">
      <i class="bi bi-exclamation-triangle"></i> Error al cargar los datos del lugar.
    </p>

    <div v-else-if="seleccionado" class="card detail__card">
      <div class="card-body">

        <!-- ── Encabezado ── -->
        <div class="detail__header">
          <div class="detail__header-content">
            <div class="detail__header-info">
              <h2 class="detail__header-city">{{ lugarBase.nombre }}</h2>
              <p class="detail__header-date">{{ fechaHoy }}</p>
            </div>
            <div class="detail__header-weather">
              <div class="detail__header-icon">
                <i :class="`bi ${actual.icono}`"></i>
              </div>
              <div class="detail__header-temp">{{ tempTexto(actual.temperatura) }}</div>
              <p class="detail__header-description">{{ actual.descripcion }}</p>
            </div>
          </div>
        </div>

        <!-- ── Condiciones actuales (grid de 3×2) ── -->
        <div class="detail__stats">
          <div class="detail__stats-item">
            <i class="bi bi-thermometer-half detail__stats-item-icon detail__stats-item-icon--feels"></i>
            <p class="detail__stats-item-label">Sensación</p>
            <p class="detail__stats-item-value">{{ tempTexto(actual.sensacionTermica) }}</p>
          </div>
          <div class="detail__stats-item">
            <i class="bi bi-droplet detail__stats-item-icon detail__stats-item-icon--humidity"></i>
            <p class="detail__stats-item-label">Humedad</p>
            <p class="detail__stats-item-value">{{ actual.humedad }}%</p>
          </div>
          <div class="detail__stats-item">
            <i class="bi bi-wind detail__stats-item-icon detail__stats-item-icon--wind"></i>
            <p class="detail__stats-item-label">Viento</p>
            <p class="detail__stats-item-value">{{ actual.viento }} km/h {{ actual.dirViento }}</p>
          </div>
          <div class="detail__stats-item">
            <i class="bi bi-lightning detail__stats-item-icon" style="color:#ffc107"></i>
            <p class="detail__stats-item-label">Ráfagas</p>
            <p class="detail__stats-item-value">{{ actual.rafagas }} km/h</p>
          </div>
          <div class="detail__stats-item">
            <i class="bi bi-speedometer2 detail__stats-item-icon" style="color:#6c757d"></i>
            <p class="detail__stats-item-label">Presión</p>
            <p class="detail__stats-item-value">{{ actual.presion }} hPa</p>
          </div>
          <div class="detail__stats-item">
            <i class="bi bi-eye detail__stats-item-icon" style="color:#0d6efd"></i>
            <p class="detail__stats-item-label">Visibilidad</p>
            <p class="detail__stats-item-value">{{ actual.visibilidad }} km</p>
          </div>
          <div class="detail__stats-item">
            <i class="bi bi-clouds detail__stats-item-icon" style="color:#adb5bd"></i>
            <p class="detail__stats-item-label">Nubosidad</p>
            <p class="detail__stats-item-value">{{ actual.nubosidad }}%</p>
          </div>
          <div class="detail__stats-item">
            <i class="bi bi-cloud-rain detail__stats-item-icon detail__stats-item-icon--humidity"></i>
            <p class="detail__stats-item-label">Precipitación</p>
            <p class="detail__stats-item-value">{{ actual.precipitacion }} mm</p>
          </div>
          <div class="detail__stats-item">
            <i class="bi bi-thermometer detail__stats-item-icon detail__stats-item-icon--feels"></i>
            <p class="detail__stats-item-label">Rango hoy</p>
            <p class="detail__stats-item-value">
              {{ tempTexto(pronostico[0].tempMax) }} / {{ tempTexto(pronostico[0].tempMin) }}
            </p>
          </div>
        </div>

        <!-- ── Pronóstico 7 días ── -->
        <div class="detail__pronostico">
          <h4 class="pronostico__title">Pronóstico de 7 días</h4>
          <div class="pronostico__weekly">
            <div
              v-for="(dia, i) in pronostico"
              :key="i"
              class="pronostico__day"
            >
              <div class="pronostico__day-date">{{ dia.dia }}</div>

              <div class="pronostico__day-tiempo">
                <i :class="`bi ${dia.icono} pronostico__day-tiempo-icon`"></i>
                <span class="pronostico__day-tiempo-temp">
                  {{ tempTexto(dia.tempMax) }} / {{ tempTexto(dia.tempMin) }}
                </span>
              </div>

              <div class="pronostico__day-extra">
                <span title="Probabilidad de lluvia">
                  <i class="bi bi-umbrella" style="color:#0d6efd"></i> {{ dia.probLluvia }}%
                </span>
                <span title="Precipitación">
                  <i class="bi bi-cloud-rain" style="color:#0dcaf0"></i> {{ dia.precipitacion }} mm
                </span>
                <span title="Viento máximo">
                  <i class="bi bi-wind" style="color:#198754"></i> {{ dia.vientoMax }} km/h
                </span>
                <span title="Índice UV">
                  <i class="bi bi-brightness-high" style="color:#fd7e14"></i> UV {{ dia.uvMax }}
                </span>
                <span title="Amanecer / Atardecer">
                  <i class="bi bi-sunrise" style="color:#ffc107"></i> {{ dia.amanecer }}
                  <i class="bi bi-sunset ms-1" style="color:#dc3545"></i> {{ dia.atardecer }}
                </span>
              </div>

              <div class="pronostico__day-description">{{ dia.descripcion }}</div>
            </div>
          </div>
        </div>

        <!-- ── Estadísticas de la semana ── -->
        <div class="stats-semana">
          <h4 class="stats-semana__title">Estadísticas de la semana</h4>
          <div class="stats-semana__grid" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr))">
            <div class="stats-semana__item">
              <p class="stats-semana__label">Temp. mínima</p>
              <p class="stats-semana__value">{{ tempTexto(stats.tempMin) }}</p>
            </div>
            <div class="stats-semana__item">
              <p class="stats-semana__label">Temp. máxima</p>
              <p class="stats-semana__value">{{ tempTexto(stats.tempMax) }}</p>
            </div>
            <div class="stats-semana__item">
              <p class="stats-semana__label">Temp. promedio</p>
              <p class="stats-semana__value">{{ tempTexto(stats.tempProm) }}</p>
            </div>
            <div class="stats-semana__item">
              <p class="stats-semana__label">Precipitación total</p>
              <p class="stats-semana__value">{{ stats.precipTotal }} mm</p>
            </div>
            <div class="stats-semana__item">
              <p class="stats-semana__label">UV promedio</p>
              <p class="stats-semana__value">{{ stats.uvPromedio }}</p>
            </div>
          </div>
          <div class="stats-semana__tipos">
            <p class="stats-semana__label">Días por tipo de clima</p>
            <p class="stats-semana__tipos-valor">
              <span v-for="(n, tipo) in stats.conteoTipos" :key="tipo">
                {{ tipo }}: {{ n }} {{ n === 1 ? 'día' : 'días' }} &nbsp;
              </span>
            </p>
          </div>
        </div>

        <!-- ── Alertas ── -->
        <div v-if="alertas.length > 0" class="alertas">
          <h5 class="alertas__title">
            <i class="bi bi-exclamation-triangle-fill"></i> Alertas de clima
          </h5>
          <div v-for="(alerta, i) in alertas" :key="i" class="alertas__item">
            {{ alerta }}
          </div>
        </div>

      </div>
    </div>
  </section>

  <section v-else class="text-center py-5">
    <p class="error-msg">Lugar no encontrado.</p>
    <button class="btn--back" @click="router.push('/')">
      <i class="bi bi-arrow-left btn--back-icon"></i>Volver al Inicio
    </button>
  </section>
</template>
