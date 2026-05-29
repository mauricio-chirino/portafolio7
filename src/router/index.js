import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailView from '../views/DetailView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import PreferencesView from '../views/PreferencesView.vue'
import store from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/lugar/:id', name: 'detalle', component: DetailView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/registro', name: 'registro', component: RegisterView },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: FavoritesView,
      meta: { requiresAuth: true }, // necesita sesión
    },
    {
      path: '/preferencias',
      name: 'preferencias',
      component: PreferencesView,
      meta: { requiresAuth: true }, // necesita sesión
    },
  ],
})

// Guard global: se ejecuta antes de cada ruta.
// Si la ruta necesita sesión y no hay usuario, redirige al login.
router.beforeEach((to) => {
  const logueado = store.getters['usuario/isAuthenticated']
  if (to.meta.requiresAuth && !logueado) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
