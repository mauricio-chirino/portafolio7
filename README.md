# App del Tiempo — Versión final (Portafolio)

SPA hecha con **Vue 3** que muestra el clima de 8 ciudades españolas en tiempo real (API gratuita **Open-Meteo**), con **inicio de sesión**, **Vuex** para el estado global y **rutas protegidas**. Este es el producto final de mi portafolio.

## Requisitos

- **Node.js** 20.19+ o 22.12+
- **npm** (viene incluido con Node)

## Instrucciones para ejecutarlo en local

```
npm install
npm run dev
```

Abre la dirección que aparece en la terminal (normalmente `http://localhost:5173`).

> **No necesita clave de API ni archivo `.env`**: Open-Meteo es gratuita y no requiere API key.

### Usuarios de prueba

| Correo | Contraseña | Unidad |
|--------|-----------|--------|
| `ana@clima.com` | `1234` | °C |
| `luis@clima.com` | `1234` | °F |

También puedes crear uno nuevo en `/registro`.

## Rutas principales

| Ruta | Acceso | Qué muestra |
|------|--------|-------------|
| `/` | Pública | **Home**: lista de ciudades con su clima actual + buscador. |
| `/lugar/:id` | Pública | **Detalle**: clima actual, pronóstico de 7 días, estadísticas y alertas. |
| `/login` | Pública | Inicio de sesión. |
| `/registro` | Pública | Crear un usuario (simulado). |
| `/favoritos` | **Privada** | Ciudades favoritas del usuario. |
| `/preferencias` | **Privada** | Unidad de temperatura (°C/°F) y tema. |

## Funcionalidades clave

- **API real**: datos del clima desde **Open-Meteo** con **Axios** (instancia configurada en `src/services/weather.js`), con estados de `cargando…` y error al consultar.
- **Estado global con Vuex** (dos módulos):
  - `clima`: lista de lugares, lugar seleccionado y banderas de carga/error.
  - `usuario`: sesión, favoritos y preferencias (persisten en `localStorage`).
- **Estadísticas y alertas** semanales: mínimo, máximo, promedio, conteo por tipo de clima y alertas automáticas (calor, semana lluviosa, viento fuerte, UV alto).
- **Personalización por usuario**: favoritos y unidad de temperatura (°C/°F) consistente en toda la app.
- **Rutas protegidas** con un guard global de Vue Router.

## Estructura del proyecto

```
src/
├── services/weather.js        # Axios + API Open-Meteo + helpers
├── store/
│   ├── index.js               # store de Vuex
│   └── modules/
│       ├── clima.js           # lista de lugares y lugar seleccionado
│       └── usuario.js         # sesión, favoritos y preferencias
├── router/index.js            # rutas + guard de autenticación
├── components/WeatherCard.vue # tarjeta de ciudad
└── views/                     # Home, Detalle, Login, Registro, Favoritos, Preferencias
```

## Capturas

*(Opcional: agrega aquí capturas de la Home, el Detalle y la vista de Favoritos para mejorar la presentación.)*

## Repositorio

[https://github.com/mauricio-chirino/portafolio7](https://github.com/mauricio-chirino/portafolio7)
