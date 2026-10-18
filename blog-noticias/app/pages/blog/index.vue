<template>
  <div>
    <div class="category-hero">
      <h1>Últimas Noticias</h1>
      <p>Lo más reciente del acontecer nacional</p>
    </div>

    <div v-if="recentPosts.length > 0" class="news-grid">
      <div v-for="post in recentPosts" :key="post.title" class="news-card">
        <div class="news-card-image">
          <img :src="post.image || '/images/noticias/default.jpg'" :alt="post.title" loading="lazy" />
          <span class="news-card-badge" :class="post.category">
            {{ getCategoryLabel(post.category) }}
          </span>
        </div>
        <div class="news-card-content">
          <div class="meta">
            <span>{{ formatDate(post.date) }}</span>
            <span>⏱{{ getReadTime(post.body) }} min lectura</span>
          </div>
          <h2>
            <NuxtLink :to="`/blog/${post.category}/${createSlug(post.title)}`">
              {{ post.title }}
            </NuxtLink>
          </h2>
          <p>{{ post.description }}</p>
          <div class="news-card-footer">
            <div class="author">
              <img :src="post.author?.image || '/images/autores/default.jpg'" :alt="post.author?.name" />
              <span>{{ post.author?.name }}</span>
            </div>
            <span class="read-time">Leer más →</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">🌐︎</div>
      <h2>No hay noticias disponibles</h2>
      <p>Pronto publicaremos nuevas noticias.</p>
    </div>
  </div>
</template>

<script setup>
const createSlug = (title) => {
  if (!title) return ''
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const { data: posts } = await useAsyncData('blog-list', () => {
  return queryCollection('blog')
    .order('date', 'DESC')
    .all()
})

const recentPosts = computed(() => posts.value?.slice(0, 9) || [])

const getCategoryLabel = (category) => {
  const labels = {
    sucesos: 'Sucesos',
    deportes: 'Deportes',
    espectaculos: 'Espectáculos'
  }
  return labels[category] || category
}

const getReadTime = (body) => {
  if (!body) return 1
  const text = typeof body === 'string' ? body : JSON.stringify(body)
  const words = text.split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

const formatDate = (date) => {
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