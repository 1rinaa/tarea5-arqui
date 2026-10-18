<template>
  <div>
    <div class="category-hero">
      <h1>{{ categoryName }}</h1>
      <p>{{ posts.length }} noticias en esta categoría</p>
    </div>

    <div v-if="posts.length > 0" class="news-grid">
      <div v-for="post in posts" :key="post.title" class="news-card">
        <div class="news-card-image">
          <img :src="post.image || '/images/noticias/default.jpg'" :alt="post.title" loading="lazy" />
          <span class="news-card-badge" :class="post.category">
            {{ getCategoryLabel(post.category) }}
          </span>
        </div>
        <div class="news-card-content">
          <div class="meta">
            <span>{{ formatDate(post.date) }}</span>
            <span>⏱ {{ getReadTime(post.body) }} min lectura</span>
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
      <h2>No hay noticias en esta categoría</h2>
      <p>Vuelve más tarde para ver nuevas publicaciones.</p>
      <NuxtLink to="/blog" class="btn-volver">
        Volver al inicio
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const categoria = route.params.categoria

const createSlug = (title) => {
  if (!title) return ''
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const { data: posts } = await useAsyncData(`categoria-${categoria}`, () => {
  return queryCollection('blog')
    .where('category', '=', categoria)
    .order('date', 'DESC')
    .all()
})

const categoryName = computed(() => {
  const names = {
    'sucesos': 'Sucesos',
    'deportes': 'Deportes',
    'espectaculos': 'Espectáculos'
  }
  return names[categoria] || categoria
})

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

<style scoped>
.btn-volver {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 25px;
  background: #3498db;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s ease;
}

.btn-volver:hover {
  background: #2980b9;
}

.category-hero {
  text-align: center;
  padding: 40px 0 10px;
}

.category-hero h1 {
  font-size: 2.8rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 5px;
}

.category-hero p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  margin: 40px 0;
}

.news-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.news-card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #e9ecef;
}

.news-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .news-card-image img {
  transform: scale(1.05);
}

.news-card-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.news-card-badge.sucesos { background: #e74c3c; }
.news-card-badge.deportes { background: #2ecc71; }
.news-card-badge.espectaculos { background: #9b59b6; }

.news-card-content {
  padding: 20px 24px 24px;
}

.news-card-content .meta {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: #95a5a6;
  margin-bottom: 10px;
}

.news-card-content h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  line-height: 1.3;
  color: #1a1a2e;
}

.news-card-content h2 a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.news-card-content h2 a:hover {
  color: #3498db;
}

.news-card-content p {
  color: #5a5a7a;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 15px;
}

.news-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.news-card-footer .author {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.news-card-footer .author img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.news-card-footer .read-time {
  font-size: 0.8rem;
  color: #95a5a6;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.empty-state .empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}
</style>