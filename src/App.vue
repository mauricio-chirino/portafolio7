<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light header__navbar">
      <div class="container">
        <RouterLink class="navbar-brand header__brand" to="/">
          <i class="bi bi-cloud-sun header__brand-icon"></i>App del Tiempo
        </RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <RouterLink
                class="nav-link header__nav-link"
                :class="{ 'header__nav-link--active': route.name === 'home' }"
                to="/"
              >Inicio</RouterLink>
            </li>
            <li class="nav-item" v-show="route.name === 'detalle'">
              <RouterLink
                class="nav-link header__nav-link header__nav-link--active"
                :to="route.fullPath"
              >Detalle</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <main class="container my-4">
    <RouterView />
  </main>

  <footer class="footer">
    <div class="container footer__container">
      <p class="footer__text">© 2025 App del Tiempo — Módulo 6</p>
    </div>
  </footer>
</template>
