<script setup>
const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="card-actions">
    <button class="edit" @click.stop="emit('edit')">
      <i class="fa-solid fa-pen"></i>
    </button>

    <button class="delete" @click.stop="emit('delete')">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>
</template>
<style scoped>
@import '@/assets/css/card.css';
</style>
