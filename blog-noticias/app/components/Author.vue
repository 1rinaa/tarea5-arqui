<template>
  <div class="author">
    <img :src="author.image" :alt="author.name" />
    <div class="author-info">
      <h4>Autor</h4>
      <p><strong>{{ author.name }}</strong></p>
      <p>{{ author.bio }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  author: {
    type: Object,
    required: true
  }
})
</script>