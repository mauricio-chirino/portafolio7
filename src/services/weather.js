import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
  paramsSerializer: (params) =>
    Object.entries(params)
      .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(',') : v}`)
      .join('&'),
})

export const LUGARES = [
  { id: 1, nombre: 'Madrid',    lat: 40.4165, lon: -3.7026 },
  { id: 2, nombre: 'Barcelona', lat: 41.3851, lon:  2.1734 },
  { id: 3, nombre: 'Valencia',  lat: 39.4699, lon: -0.3763 },
  { id: 4, nombre: 'Sevilla',   lat: 37.3891, lon: -5.9845 },
  { id: 5, nombre: 'Bilbao',    lat: 43.2630, lon: -2.9350 },
  { id: 6, nombre: 'Malaga',    lat: 36.7213, lon: -4.4214 },
  { id: 7, nombre: 'Zaragoza',  lat: 41.6561, lon: -0.8773 },
  { id: 8, nombre: 'Alicante',  lat: 38.3452, lon: -0.4810 },
]

export const CODIGOS_CLIMA = {
  0:  { desc: 'Despejado',             icon: 'bi-sun',                  tipo: 'soleado'  },
  1:  { desc: 'Mayormente despejado',  icon: 'bi-sun',                  tipo: 'soleado'  },
  2:  { desc: 'Parcialmente nublado',  icon: 'bi-cloud-sun',            tipo: 'nublado'  },
  3:  { desc: 'Nublado',               icon: 'bi-cloud',                tipo: 'nublado'  },
  45: { desc: 'Niebla',                icon: 'bi-cloud-fog2',           tipo: 'nublado'  },
  48: { desc: 'Niebla con escarcha',   icon: 'bi-cloud-fog2',           tipo: 'nublado'  },
  51: { desc: 'Llovizna ligera',       icon: 'bi-cloud-drizzle',        tipo: 'lluvia'   },
  53: { desc: 'Llovizna moderada',     icon: 'bi-cloud-drizzle',        tipo: 'lluvia'   },
  55: { desc: 'Llovizna intensa',      icon: 'bi-cloud-drizzle',        tipo: 'lluvia'   },
  61: { desc: 'Lluvia ligera',         icon: 'bi-cloud-rain',           tipo: 'lluvia'   },
  63: { desc: 'Lluvia moderada',       icon: 'bi-cloud-rain',           tipo: 'lluvia'   },
  65: { desc: 'Lluvia intensa',        icon: 'bi-cloud-rain-heavy',     tipo: 'lluvia'   },
  71: { desc: 'Nieve ligera',          icon: 'bi-cloud-snow',           tipo: 'nieve'    },
  73: { desc: 'Nieve moderada',        icon: 'bi-cloud-snow',           tipo: 'nieve'    },
  75: { desc: 'Nevada intensa',        icon: 'bi-cloud-snow',           tipo: 'nieve'    },
  80: { desc: 'Aguaceros ligeros',     icon: 'bi-cloud-rain',           tipo: 'lluvia'   },
  81: { desc: 'Aguaceros moderados',   icon: 'bi-cloud-rain',           tipo: 'lluvia'   },
  82: { desc: 'Aguaceros intensos',    icon: 'bi-cloud-rain-heavy',     tipo: 'lluvia'   },
  95: { desc: 'Tormenta',              icon: 'bi-cloud-lightning',      tipo: 'tormenta' },
  96: { desc: 'Tormenta con granizo',  icon: 'bi-cloud-lightning-rain', tipo: 'tormenta' },
  99: { desc: 'Tormenta intensa',      icon: 'bi-cloud-lightning-rain', tipo: 'tormenta' },
}

const FALLBACK_CLIMA = { desc: 'Desconocido', icon: 'bi-question-circle', tipo: 'otro' }
const resolverCodigo = (codigo) => CODIGOS_CLIMA[codigo] || FALLBACK_CLIMA

export function gradosACardinal(grados) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  return dirs[Math.round(grados / 45) % 8]
}

const formatHora = (iso) => iso?.slice(11, 16) ?? '--:--'

const promedio = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length

const CURRENT_FIELDS = [
  'temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'is_day',
  'precipitation', 'weather_code', 'cloud_cover', 'wind_speed_10m',
  'wind_direction_10m', 'wind_gusts_10m', 'surface_pressure', 'visibility',
]

const DAILY_FIELDS = [
  'weather_code', 'temperature_2m_max', 'temperature_2m_min',
  'apparent_temperature_max', 'apparent_temperature_min',
  'sunrise', 'sunset', 'uv_index_max', 'precipitation_sum',
  'precipitation_probability_max', 'wind_speed_10m_max',
  'wind_gusts_10m_max', 'wind_direction_10m_dominant',
]

export async function fetchClima(lat, lon) {
  const { data } = await api.get('/forecast', {
    params: { latitude: lat, longitude: lon, current: CURRENT_FIELDS, timezone: 'auto' },
  })
  return data
}

export async function fetchPronostico(lat, lon) {
  const { data } = await api.get('/forecast', {
    params: {
      latitude: lat, longitude: lon,
      current: CURRENT_FIELDS, daily: DAILY_FIELDS,
      timezone: 'auto', forecast_days: 7,
    },
  })
  return data
}

export function parsearActual(current) {
  const { desc, icon, tipo } = resolverCodigo(current.weather_code)
  return {
    temperatura:      Math.round(current.temperature_2m),
    sensacionTermica: Math.round(current.apparent_temperature),
    humedad:          current.relative_humidity_2m,
    precipitacion:    current.precipitation,
    nubosidad:        current.cloud_cover,
    presion:          Math.round(current.surface_pressure),
    visibilidad:      Math.round((current.visibility ?? 0) / 100) / 10,
    viento:           Math.round(current.wind_speed_10m),
    rafagas:          Math.round(current.wind_gusts_10m),
    dirViento:        gradosACardinal(current.wind_direction_10m),
    esDeDia:          current.is_day === 1,
    descripcion: desc, icono: icon, tipo,
  }
}

export function procesarPronostico(daily) {
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  return daily.time.map((fecha, i) => {
    const { desc, icon, tipo } = resolverCodigo(daily.weather_code[i])
    const dia = diasSemana[new Date(`${fecha}T12:00:00`).getDay()]
    return {
      fecha, dia,
      tempMax:      Math.round(daily.temperature_2m_max[i]),
      tempMin:      Math.round(daily.temperature_2m_min[i]),
      sensacionMax: Math.round(daily.apparent_temperature_max[i]),
      sensacionMin: Math.round(daily.apparent_temperature_min[i]),
      amanecer:     formatHora(daily.sunrise[i]),
      atardecer:    formatHora(daily.sunset[i]),
      uvMax:        Math.round(daily.uv_index_max[i]),
      precipitacion: Math.round(daily.precipitation_sum[i] ?? 0),
      probLluvia:    daily.precipitation_probability_max[i] ?? 0,
      vientoMax:    Math.round(daily.wind_speed_10m_max[i]),
      rafagasMax:   Math.round(daily.wind_gusts_10m_max[i]),
      dirViento:    gradosACardinal(daily.wind_direction_10m_dominant[i]),
      descripcion: desc, icono: icon, tipo,
    }
  })
}

export function calcularEstadisticas(pronostico) {
  const conteoTipos = {}
  pronostico.forEach(d => { conteoTipos[d.tipo] = (conteoTipos[d.tipo] || 0) + 1 })
  return {
    tempMin:      Math.min(...pronostico.map(d => d.tempMin)),
    tempMax:      Math.max(...pronostico.map(d => d.tempMax)),
    tempProm:     Math.round(promedio(pronostico.map(d => (d.tempMax + d.tempMin) / 2))),
    precipTotal:  pronostico.reduce((s, d) => s + d.precipitacion, 0),
    uvPromedio:   Math.round(promedio(pronostico.map(d => d.uvMax))),
    conteoTipos,
  }
}

export function generarAlertas(stats, pronostico) {
  const conteo = (tipo) => stats.conteoTipos[tipo] || 0
  const alertas = []

  if (stats.tempProm > 30)
    alertas.push(`Alerta de calor: temperatura promedio de ${stats.tempProm}°C esta semana`)

  const diasLluvia = conteo('lluvia') + conteo('tormenta')
  if (diasLluvia >= 3)
    alertas.push(`Semana lluviosa: ${diasLluvia} días con lluvia o tormenta previstos`)

  const diasNieve = conteo('nieve')
  if (diasNieve >= 1)
    alertas.push(`Posibles nevadas: ${diasNieve} ${diasNieve === 1 ? 'día' : 'días'} con nieve previstos`)

  if (stats.uvPromedio >= 6)
    alertas.push(`Índice UV elevado: promedio de ${stats.uvPromedio} esta semana. Usa protección solar`)

  const rafagaMax = Math.max(...pronostico.map(d => d.rafagasMax))
  if (rafagaMax >= 60)
    alertas.push(`Viento fuerte: ráfagas de hasta ${rafagaMax} km/h previstas esta semana`)

  return alertas
}
