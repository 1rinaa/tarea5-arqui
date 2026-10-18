<!-- app/components/CommentsUtterances.vue -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  repo?: string
  theme?: string
  issueTerm?: string
}>(), {
  repo: '1rinaa/tarea5-arqui',
  theme: 'github-light',
  issueTerm: 'pathname'
})

const container = ref<HTMLElement | null>(null)
const route = useRoute()

function loadComments() {
  if (!container.value) return
  container.value.innerHTML = ''
  const script = document.createElement('script')
  script.src = 'https://utteranc.es/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('repo', props.repo)
  script.setAttribute('issue-term', props.issueTerm)
  script.setAttribute('label', 'comments')
  script.setAttribute('theme', props.theme)
  container.value.appendChild(script)
}

onMounted(loadComments)
watch(() => route.path, loadComments)
</script>

<template>
  <div class="comments-section">
    <h3 class="comments-title">💬 Comentarios</h3>
    <div ref="container" class="comments" />
  </div>
</template>

<style scoped>
.comments-section {
  margin-top: 40px;
  padding-top: 25px;
  border-top: 2px dashed #e2e8f0;
}
.comments-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 20px;
}
</style>
