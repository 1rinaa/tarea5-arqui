<template>
  <div>
    <!-- HEADER PRINCIPAL -->
    <header class="site-header">
      <div class="header-inner">
        <!-- Logo -->
        <NuxtLink to="/blog" class="logo">
          <span class="logo-icon">📰</span>
          <div>
            <h1>Noticias Nacionales </h1>
            <span>Información que importa</span>
          </div>
        </NuxtLink>

        <!-- Búsqueda -->
        <div class="header-search" style="position: relative; flex: 1; max-width: 500px; min-width: 250px;">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="⌕  Buscar noticias..."
            @input="performSearch"
            @focus="showResults = true"
            @blur="setTimeout(() => showResults = false, 200)"
          />

          <!-- Resultados dropdown -->
          <div v-if="showResults && searchQuery && searchResults.length > 0" class="search-results-dropdown active">
            <ul>
              <li v-for="result in searchResults" :key="result.title">
                <NuxtLink :to="`/blog/${result.category}/${createSlug(result.title)}`">
                  <img v-if="result.image" :src="result.image" class="result-img" />
                  <div class="result-info">
                    <strong>{{ result.title }}</strong>
                    <small>{{ capitalizeCategory(result.category) }}</small>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div v-else-if="showResults && searchQuery && searchResults.length === 0" class="search-results-dropdown active">
            <div style="padding: 20px; color: #7f8c8d; text-align: center;">
              No se encontraron resultados
            </div>
          </div>
        </div>
      </div>

      <!-- BARRA DE CATEGORÍAS -->
      <div class="category-bar">
        <div class="category-bar-inner">
          <NuxtLink to="/blog" class="cat-link" :class="{ active: $route.path === '/blog' }">
            🏠︎ Inicio
          </NuxtLink>
          <NuxtLink to="/blog/sucesos" class="cat-link" :class="{ active: $route.path === '/blog/sucesos' || $route.path.startsWith('/blog/sucesos/') }">
            ⓘ Sucesos
          </NuxtLink>
          <NuxtLink to="/blog/deportes" class="cat-link" :class="{ active: $route.path === '/blog/deportes' || $route.path.startsWith('/blog/deportes/') }">
            ⚽︎ Deportes
          </NuxtLink>
          <NuxtLink to="/blog/espectaculos" class="cat-link" :class="{ active: $route.path === '/blog/espectaculos' || $route.path.startsWith('/blog/espectaculos/') }">
            ★ Espectáculos
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="container">
      <NuxtPage />
    </main>

    <!-- FOOTER -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-col">
          <h4>📰 Noticias Nacionales</h4>
          <p>Tu fuente confiable de información. Siempre al día con lo que pasa en el país.</p>
          <p style="margin-top: 10px; font-size: 0.85rem;">
            EIF-508 - Sistemas Distribuidos<br>
            Universidad Nacional
          </p>
        </div>
        <div class="footer-col">
          <h4>Categorías</h4>
          <ul>
            <li><NuxtLink to="/blog/sucesos">Sucesos</NuxtLink></li>
            <li><NuxtLink to="/blog/deportes">Deportes</NuxtLink></li>
            <li><NuxtLink to="/blog/espectaculos">Espectáculos</NuxtLink></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Estudiante</h4>
          <ul>
            <li><strong>Nombre:</strong> Irina Rivera Chavarría</li>
            <li><strong>Curso:</strong> EIF-508</li>
            <li><strong>Año:</strong> 2026</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        © 2026 Noticias Nacionales - Todos los derechos reservados
      </div>
    </footer>
  </div>
</template>

<script setup>
const searchQuery = ref('')
const allArticles = ref([])
const searchResults = ref([])
const showResults = ref(false)

const createSlug = (title) => {
  if (!title) return ''
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const capitalizeCategory = (category) => {
  const names = {
    sucesos: 'Sucesos',
    deportes: 'Deportes',
    espectaculos: 'Espectáculos'
  }
  return names[category] || category
}

// Cargar artículos para búsqueda
const { data } = await useAsyncData('search-articles', () => {
  return queryCollection('blog')
    .all()
})

if (data.value) {
  allArticles.value = data.value
}

const performSearch = () => {
  const term = searchQuery.value.trim().toLowerCase()
  if (!term) {
    searchResults.value = []
    return
  }
  searchResults.value = allArticles.value.filter(a => {
    const titleMatch = a.title?.toLowerCase().includes(term) || false
    const descMatch = a.description?.toLowerCase().includes(term) || false
    return titleMatch || descMatch
  })
}
</script>

<style>
@import '~/assets/css/blog.css';
</style>