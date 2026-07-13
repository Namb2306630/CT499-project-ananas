<script setup>
defineProps({
  saveText: {
    type: String,
    default: 'Lưu thay đổi',
  },

  cancelText: {
    type: String,
    default: 'Hủy bỏ',
  },
})

const emit = defineEmits(['save', 'cancel'])
</script>

<template>
  <div class="actions">
    <button type="button" class="cancel" @click="emit('cancel')">
      {{ cancelText }}
    </button>

    <button type="button" class="save" @click="emit('save')">
      {{ saveText }}
    </button>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: end;
  margin-top: 20px;
  gap: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
}

.cancel {
  background: var(--color-6);
}

.cancel:hover {
  background: var(--color-7);
}

.save {
  background: var(--color-8);
  color: white;
  transition: 0.3s ease;
}

.save:hover {
  transform: translateY(-5px);
}
</style>
