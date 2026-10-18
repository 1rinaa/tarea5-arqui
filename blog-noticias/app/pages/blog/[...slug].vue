<template>
  <div class="container" v-if="article">
    <div class="article-detail">
      <!-- Hero -->
      <div class="article-hero">
        <img :src="article.image || '/images/noticias/default.jpg'" :alt="article.title" />
        <div class="article-hero-overlay">
          <span class="category-tag" :class="article.category">
            {{ getCategoryLabel(article.category) }}
          </span>
          <h1>{{ article.title }}</h1>
          <div class="meta">
            <span>📅 {{ formatDate(article.date) }}</span>
            <span>⏱️ {{ getReadTime(article.body) }} min lectura</span>
            <span>✍️ {{ article.author?.name }}</span>
          </div>
        </div>
      </div>

      <div class="article-body">
        <div class="content">
          <ContentRenderer :value="article" />
        </div>

        <div class="article-author">
          <img :src="article.author?.image || '/images/autores/default.jpg'" :alt="article.author?.name" />
          <div class="info">
            <h4>{{ article.author?.name }}</h4>
            <p>{{ article.author?.bio }}</p>
          </div>
        </div>

        <!-- ✅ NAVEGACIÓN CON ALTERNATIVA MANUAL -->
        <PrevNext 
          :category="article.category" 
          :prev="surrounding?.prev" 
          :next="surrounding?.next" 
        />

        <!-- 💬 SECCIÓN DE COMENTARIOS (TUTORIAL 8) -->
        <CommentsUtterances repo="1rinaa/tarea5-arqui" />
      </div>
    </div>
  </div>

  <div v-else class="container error">
    <h1 style="font-size: 3rem;">📖</h1>
    <h2>Artículo no encontrado</h2>
    <p style="color: #7f8c8d;">Lo sentimos, el artículo que buscas no existe.</p>
    <p style="color: #95a5a6; font-size: 0.9rem;">Ruta solicitada: {{ route.path }}</p>
    <NuxtLink to="/blog" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: #3498db; color: white; border-radius: 8px; text-decoration: none;">
      Volver al inicio
    </NuxtLink>
  </div>
</template>

<script setup>
const route = useRoute()

const createSlug = (title) => {
  if (!title) return ''
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const slugFromUrl = route.path.split('/').pop()

const { data: allArticles } = await useAsyncData('all-articles-detail', async () => {
  try {
    const result = await queryCollection('blog')
      .all()
    return result
  } catch (err) {
    console.error('Error cargando artículos:', err)
    return []
  }
})

// ✅ Buscar artículo por slug
const article = computed(() => {
  if (!allArticles.value) return null
  const found = allArticles.value.find(a => {
    const articleSlug = createSlug(a.title)
    return articleSlug === slugFromUrl
  })
  return found || null
})

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado' })
}

// ✅ ALTERNATIVA MANUAL - No usa _path
const { data: surrounding } = await useAsyncData(`surround-${route.path}`, async () => {
  try {
    // Obtener todas las noticias de la misma categoría, ordenadas por fecha DESC
    const categoryArticles = await queryCollection('blog')
      .where('category', '=', article.value.category)
      .order('date', 'DESC')
      .all()
    
    // Encontrar el índice del artículo actual por su título (más confiable)
    const currentIndex = categoryArticles.findIndex(a => {
      const articleSlug = createSlug(a.title)
      return articleSlug === slugFromUrl
    })
    
    console.log('📚 Artículos en categoría:', categoryArticles.length)
    console.log('📍 Índice actual:', currentIndex)
    console.log('🔄 Prev:', currentIndex > 0 ? categoryArticles[currentIndex - 1].title : 'Ninguno')
    console.log('🔄 Next:', currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1].title : 'Ninguno')
    
    return {
      prev: currentIndex > 0 ? categoryArticles[currentIndex - 1] : null,
      next: currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1] : null
    }
  } catch (err) {
    console.error('Error en navegación:', err)
    return { prev: null, next: null }
  }
})

const getCategoryLabel = (category) => {
  const labels = {
    sucesos: '🔴 Sucesos',
    deportes: '⚽ Deportes',
    espectaculos: '🎭 Espectáculos'
  }
  return labels[category] || category
}

const getReadTime = (body) => {
  if (!body) return 1
  let text = ''
  if (typeof body === 'string') {
    text = body
  } else if (typeof body === 'object') {
    try {
      text = JSON.stringify(body)
    } catch {
      text = ''
    }
  }
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

if (article.value) {
  useSeoMeta({
    title: article.value.title,
    description: article.value.description
  })
}
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.article-detail { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); margin: 40px 0; }
.article-hero { position: relative; height: 400px; overflow: hidden; }
.article-hero img { width: 100%; height: 100%; object-fit: cover; }
.article-hero-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px 50px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: white; }
.article-hero-overlay .category-tag { display: inline-block; padding: 4px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
.article-hero-overlay .category-tag.sucesos { background: #e74c3c; }
.article-hero-overlay .category-tag.deportes { background: #2ecc71; }
.article-hero-overlay .category-tag.espectaculos { background: #9b59b6; }
.article-hero-overlay h1 { font-size: 2.5rem; font-weight: 700; margin: 0 0 10px 0; line-height: 1.2; }
.article-hero-overlay .meta { font-size: 0.9rem; opacity: 0.8; }
.article-hero-overlay .meta span { margin-right: 20px; }
.article-body { padding: 40px 50px; }
.article-body .content { font-size: 1.05rem; line-height: 1.9; color: #2c3e50; }

.article-body .content :deep(h1),
.article-body .content :deep(h2),
.article-body .content :deep(h3),
.article-body .content :deep(h4) {
  color: #1a1a2e;
  margin-top: 30px;
  margin-bottom: 15px;
}

.article-body .content :deep(h2) { font-size: 1.6rem; }
.article-body .content :deep(h3) { font-size: 1.3rem; }

.article-body .content :deep(p) {
  margin-bottom: 18px;
  line-height: 1.8;
}

.article-body .content :deep(ul),
.article-body .content :deep(ol) {
  margin: 15px 0 20px 25px;
}

.article-body .content :deep(li) {
  margin-bottom: 8px;
}

.article-body .content :deep(h1 a),
.article-body .content :deep(h2 a),
.article-body .content :deep(h3 a),
.article-body .content :deep(h4 a),
.article-body .content :deep(h5 a),
.article-body .content :deep(h6 a) {
  color: inherit !important;
  text-decoration: none !important;
  font-weight: inherit !important;
  cursor: default !important;
  pointer-events: none !important;
}

.article-body .content :deep(a:not(h1 a):not(h2 a):not(h3 a):not(h4 a):not(h5 a):not(h6 a)) {
  color: #3498db;
  text-decoration: underline;
}

.article-body .content :deep(a:not(h1 a):not(h2 a):not(h3 a):not(h4 a):not(h5 a):not(h6 a):hover) {
  color: #2980b9;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px 30px;
  background: #f8f9fa;
  border-radius: 12px;
  margin: 30px 0 20px;
}

.article-author img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

.article-author .info h4 {
  font-size: 1.1rem;
  margin: 0 0 4px 0;
  color: #1a1a2e;
}

.article-author .info p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.95rem;
}

.error {
  text-align: center;
  padding: 80px 20px;
}

.error h2 { color: #2c3e50; }
.error p { color: #7f8c8d; }

@media (max-width: 768px) {
  .article-hero { height: 250px; }
  .article-hero-overlay { padding: 20px 25px; }
  .article-hero-overlay h1 { font-size: 1.5rem; }
  .article-body { padding: 25px; }
}
</style>