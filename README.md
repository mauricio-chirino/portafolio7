# App del Tiempo — Módulo 7 (Usuarios, Login y Estado Global)

App de clima (SPA con Vue 3) a la que le agregué un **sistema básico de usuarios** (login y registro), **Vuex** para el estado global de la sesión, y **rutas protegidas** con Vue Router. La parte del clima es la misma del Módulo 6 (datos en tiempo real desde la API gratuita Open-Meteo); aquí el foco está en la **autenticación** y la **personalización** por usuario.

## Sistema de usuarios

Los usuarios son **simulados en el front** (no hay backend real). Están en `src/services/usuarios.js`. De cada usuario se guarda:

- **nombre** — para el saludo "Hola, {nombre}" en la navbar.
- **correo** y **password** — para validar el inicio de sesión.
- **favoritos** — lista de IDs de las ciudades favoritas del usuario.
- **preferencias** — unidad de temperatura (°C / °F) y tema (claro / oscuro).

Cuando inicias sesión, esos datos se cargan en **Vuex** (módulo `usuario`) y la interfaz se ajusta a ese usuario:

- La navbar muestra tu nombre y el botón **Cerrar sesión**.
- Las tarjetas de inicio muestran la temperatura en tu **unidad preferida** (°C o °F).
- Puedes marcar ciudades como **favoritas** (⭐) y verlas en la sección **Favoritos**.

### Usuarios de prueba

| Correo | Contraseña | Unidad |
|--------|-----------|--------|
| `ana@clima.com` | `1234` | °C |
| `luis@clima.com` | `1234` | °F |

También puedes crear uno nuevo en `/registro`.

## Rutas (Vue Router)

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Pública | Home: ciudades + buscador (con favoritos y unidad según el usuario). |
| `/lugar/:id` | Pública | Detalle del pronóstico de una ciudad. |
| `/login` | Pública | Inicio de sesión. |
| `/registro` | Pública | Crear un usuario nuevo (simulado). |
| `/favoritos` | **Privada** | Lista de tus ciudades favoritas. |
| `/preferencias` | **Privada** | Elegir unidad (°C / °F) y tema. |

Las rutas privadas están protegidas con un **guard global** (`router.beforeEach`): si intentas entrar sin sesión, te redirige a `/login`.

## Estado global (Vuex)

El módulo `usuario` (`src/store/modules/usuario.js`) contiene:

- **state**: `usuarioActual` (nombre, correo, favoritos, preferencias) y `error`.
- **getters**: `isAuthenticated`, `nombre`, `favoritos`, `esFavorito`, `unidad`, `tema`.
- **mutations** (síncronas): `setUsuario`, `limpiarUsuario`, `toggleFavorito`, `setUnidad`, `setTema`.
- **actions**: `login`, `logout`, `registrar`.

## Cómo ejecutar

```
npm install
npm run dev
```

Abre la dirección que aparece en la terminal (normalmente `http://localhost:5173`).

## Repositorio

[https://github.com/mauricio-chirino/portafolio7](https://github.com/mauricio-chirino/portafolio7)
