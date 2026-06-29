<script setup>
import { ref, watch, nextTick } from 'vue'

const dialog = ref(null)

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Xác nhận xóa',
  },

  message: {
    type: String,
    default: 'Bạn có chắc muốn xóa không?',
  },

  note: {
    type: String,
    default: 'Không thể hoàn tác sau khi xóa',
  },

  show: Boolean,
})

const emit = defineEmits(['cancel', 'confirm'])

watch(
  () => props.show,
  async (value) => {
    if (!dialog.value) return
    await nextTick()
    if (value && !dialog.value.open) {
      dialog.value.showModal()
    }

    if (!value && dialog.value.open) {
      dialog.value.close()
    }
  },
)

const cancel = () => {
  emit('cancel')
}

const confirm = () => {
  emit('confirm')
}
</script>

<template>
  <dialog ref="dialog" class="confirm-dialog">
    <div class="content">
      <h3>{{ title }}</h3>

      <p v-if="name" class="target">
        Bạn đang xóa:
        <strong>{{ name }}</strong>
      </p>

      <p class="message">
        {{ message }}
      </p>

      <div class="warning">
        <i class="fa-solid fa-circle-info"></i>
        <span>{{ note }}</span>
      </div>

      <div class="actions">
        <button class="cancel" @click="cancel">
          <i class="fa-solid fa-xmark"></i>
          Hủy
        </button>

        <button class="delete" @click="confirm">
          <i class="fa-solid fa-trash"></i>
          Xóa
        </button>
      </div>
    </div>
  </dialog>
</template>
<style scoped>
.confirm-dialog {
  border: none;
  border-radius: 18px;
  padding: 0;
  width: 420px;
  box-shadow: var(--shadow-black-2);
  overflow: hidden;
}

.content {
  padding: 30px;
  text-align: left;
}

h3 {
  margin: 0;
  font-weight: var(--font-width-lg);
}

.target {
  margin-top: 15px;
  font-size: 15px;
  color: var(--text-gray-4);
}

.target strong {
  color: var(--color-red-1);
}

.message {
  margin-top: 12px;
  color: var(--text-gray-3);
  line-height: 1.5;
}

.warning {
  margin-top: 18px;
  padding: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  border-radius: 10px;
  background: #fff7ed;
  color: var(--text-color-red);
  font-size: 14px;
  text-align: left;
}

.warning i {
  font-size: 16px;
}

.actions {
  margin-top: 25px;
  display: flex;
  justify-content: end;
  gap: 12px;
}

button {
  min-width: 120px;
  padding: 11px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
}

.cancel {
  background: var(--color-2);
  color: var(--text-gray-4);
}

.cancel:hover {
  background: var(--color-3);
}

.delete {
  background: var(--bg-color-red);
  color: var(--text-white);
}

.delete:hover {
  background: var(--bg-color-red-hover);
}

@media (max-width: 767px) {
  .confirm-dialog {
    width: 320px;
  }

  .actions {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>
