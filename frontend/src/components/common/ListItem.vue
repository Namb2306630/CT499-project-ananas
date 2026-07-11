<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: Object,
  fields: Array,
})

const columns = computed(() => {
  return [
    ...props.fields.filter((f) => f.type !== 'isActive').map((f) => f.width || '1fr'),
    '120px', // Trạng thái
    '80px', // Thao tác
  ].join(' ')
})

const emit = defineEmits(['edit', 'delete'])

const handleEdit = () => emit('edit', props.item)
const handleDelete = () => emit('delete', props.item)
</script>

<template>
  <div class="list-item" :style="{ gridTemplateColumns: columns }" @click.stop="handleEdit">
    <div class="list-content">
      <div
        v-for="field in fields.filter((f) => f.type !== 'isActive')"
        :key="field.name"
        class="cell"
      >
        <template v-if="field.type === 'title'">
          <strong>{{ item[field.name] }}</strong>
        </template>

        <template v-else-if="field.type === 'text'">
          {{ item[field.name] || 'Không có' }}
        </template>

        <template v-else-if="field.type === 'ref'">
          {{ item[field.name]?.name }}
        </template>

        <template v-else-if="field.type === 'count'">
          {{ item[field.name] || 0 }}
        </template>

        <template v-else-if="field.type === 'tags'">
          <div class="tag-list">
            <span v-for="line in item[field.name].slice(0, 3)" :key="line._id" class="tag">
              {{ line.name }}
            </span>

            <span v-if="item[field.name].length > 3" class="tag more">
              +{{ item[field.name].length - 3 }}
            </span>
          </div>
        </template>
        <template v-else-if="field.type === 'createdAt'">
          {{ new Date(item[field.name]).toLocaleDateString('vi-VN') }}
        </template>
      </div>
    </div>

    <div class="list-status">
      <template v-for="field in fields" :key="field.name">
        <span v-if="field.type === 'isActive'" :class="item[field.name] ? 'active' : 'inactive'">
          {{ item[field.name] ? 'Hoạt động' : 'Ẩn' }}
        </span>
      </template>
    </div>

    <div class="list-actions">
      <button class="edit" @click.stop="handleEdit">
        <i class="fa-solid fa-pen"></i>
      </button>

      <button class="delete" @click.stop="handleDelete">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.list-item:hover {
  cursor: pointer;
}
.list-content {
  display: contents;
}

.tag-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  background: #eee;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
}

.more {
  background: #2563eb;
  color: white;
}

.list-status {
  text-align: start;
}

.active {
  padding: 6px 12px;
  border-radius: 20px;
  background: #d1fae5;
  color: #047857;
}

.inactive {
  padding: 6px 12px;
  border-radius: 20px;
  background: #fee2e2;
}

.list-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.list-actions button {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
}

.edit {
  background: #2563eb;
}

.delete {
  background: #dc2626;
}
</style>
