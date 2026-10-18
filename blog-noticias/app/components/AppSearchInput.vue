<template>
  <div class="search-box">
    <input
      v-model="searchQuery"
      type="search"
      placeholder="Buscar en todas las noticias..."
      autocomplete="off"
      @input="performSearch"
    />
    
    <!-- Mostrar resultados -->
    <div v-if="searchQuery && results.length > 0" class="search-results">
      <ul>
        <li v-for="result in results" :key="result.title">
          <NuxtLink :to="`/blog/${result.category}/${createSlug(result.title)}`">
            <strong>{{ result.title }}</strong>
            <p>{{ result.description }}</p>
            <small>{{ formatDate(result.date) }} - {{ capitalizeCategory(result.category) }}</small>
          </NuxtLink>
        </li>
      </ul>
    </div>
    
    <!-- No resultados -->
    <div v-else-if="searchQuery && results.length === 0" class="no-results">
      <p>No se encontraron resultados para "{{ searchQuery }}"</p>
    </div>
  </div>
</template>

<script setup>
const searchQuery = ref('')
const allArticles = ref([])
const results = ref([])

const createSlug = (title) => {
  if (!title) return ''
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ✅ Función para capitalizar categoría
const capitalizeCategory = (category) => {
  const names = {
    sucesos: 'Sucesos',
    deportes: 'Deportes',
    espectaculos: 'Espectáculos'
  }
  return names[category] || category
}

function getBodyText(article) {
  if (!article) return ''
  
  if (typeof article.body === 'string') {
    return article.body
  }
  
  if (article.body && typeof article.body === 'object') {
    function extractText(node) {
      if (!node) return ''
      if (typeof node === 'string') return node
      if (node.type === 'text') return node.value || ''
      if (Array.isArray(node)) {
        return node.map(extractText).join(' ')
      }
      if (node.children) {
        return extractText(node.children)
      }
      if (node.value) return node.value
      if (node.text) return node.text
      return ''
    }
    
    const text = extractText(article.body)
    if (text) return text
    
    if (article.body.value) return String(article.body.value)
    if (article.body.text) return String(article.body.text)
    
    try {
      return JSON.stringify(article.body)
    } catch {
      return ''
    }
  }
  
  return ''
}

// Cargar todos los artículos
const { data } = await useAsyncData('all-articles', async () => {
  try {
    const result = await queryCollection('blog')
      .all()
    return result
  } catch (err) {
    console.error('Error cargando artículos:', err)
    return []
  }
})

if (data.value) {
  allArticles.value = data.value
}

// Función de búsqueda
function performSearch() {
  const term = searchQuery.value.trim().toLowerCase()
  
  if (!term) {
    results.value = []
    return
  }
  
  results.value = allArticles.value.filter(article => {
    const titleMatch = article.title?.toLowerCase().includes(term) || false
    const descMatch = article.description?.toLowerCase().includes(term) || false
    
    const bodyText = getBodyText(article)
    const bodyMatch = typeof bodyText === 'string' ? bodyText.toLowerCase().includes(term) : false
    
    const authorName = article.author?.name?.toLowerCase() || ''
    const authorBio = article.author?.bio?.toLowerCase() || ''
    const authorMatch = authorName.includes(term) || authorBio.includes(term)
    
    return titleMatch || descMatch || bodyMatch || authorMatch
  })
}

// Formatear fecha
function formatDate(date) {
  if (!date) return 'Fecha no disponible'
  try {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return 'Fecha no disponible'
  }
}
</script>

<style scoped>
.search-box {
  margin: 20px 0;
}

.search-box input {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.search-box input:focus {
  outline: none;
  border-color: #3498db;
}

.search-results {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  padding: 10px 0;
  max-height: 400px;
  overflow-y: auto;
}

.search-results ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-results ul li {
  padding: 10px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.search-results ul li:last-child {
  border-bottom: none;
}

.search-results ul li a {
  display: block;
  text-decoration: none;
  color: #2c3e50;
}

.search-results ul li a strong {
  display: block;
  font-size: 1.1rem;
  color: #2c3e50;
}

.search-results ul li a p {
  margin: 5px 0;
  color: #7f8c8d;
  font-size: 0.95rem;
}

.search-results ul li a small {
  color: #95a5a6;
  font-size: 0.85rem;
}

.search-results ul li:hover {
  background: #f8f9fa;
}

.no-results {
  padding: 15px 20px;
  color: #7f8c8d;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 10px;
}
</style>