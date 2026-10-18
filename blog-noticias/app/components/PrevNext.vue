<template>
  <div class="nav-container">
    <!-- Anterior / Siguiente -->
    <div class="nav-articles">
      <NuxtLink 
        v-if="prev" 
        :to="getPostPath(prev)" 
        class="button prev"
      >
        <span class="label">← Anterior</span>
        <span class="title">{{ prev.title }}</span>
      </NuxtLink>
      <span v-else class="empty-space"></span>

      <NuxtLink 
        v-if="next" 
        :to="getPostPath(next)" 
        class="button next"
      >
        <span class="label">Siguiente →</span>
        <span class="title">{{ next.title }}</span>
      </NuxtLink>
      <span v-else class="empty-space"></span>
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

const getPostPath = (post) => {
  if (!post) return '#'
  return `/blog/${post.category}/${createSlug(post.title)}`
}

// ✅ CORREGIDO: Función con nombre correcto
const getCategoryLabel = (category) => {
  const labels = {
    sucesos: 'Sucesos',
    deportes: 'Deportes',
    espectaculos: 'Espectáculos'
  }
  return labels[category] || category
}

defineProps({
  category: { type: String, default: '' },
  prev: { type: Object, default: null },
  next: { type: Object, default: null }
})
</script>

<style scoped>
.nav-container {
  margin-top: 30px;
  padding-top: 25px;
  border-top: 2px solid #f0f0f0;
}

.back-section {
  margin-bottom: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: #f8f9fa;
  color: #2c3e50;
  border-radius: 25px;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.back-button:hover {
  background: #3498db;
  color: white;
  border-color: #3498db;
  transform: translateX(-4px);
}

.nav-articles {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.nav-articles .button {
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  text-decoration: none;
  color: #1a1a2e;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 45%;
}

.nav-articles .button:hover {
  background: #3498db;
  color: white;
}

.nav-articles .button .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.6;
}

.nav-articles .button .title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.3;
}

.nav-articles .prev {
  text-align: left;
}

.nav-articles .next {
  text-align: right;
  margin-left: auto;
}

.nav-articles .empty-space {
  flex: 1;
  max-width: 45%;
  visibility: hidden;
}

@media (max-width: 768px) {
  .nav-articles {
    flex-direction: column;
  }
  .nav-articles .button {
    max-width: 100%;
  }
  .nav-articles .next {
    text-align: left;
    margin-left: 0;
  }
  .nav-articles .empty-space {
    display: none;
  }
}
</style>