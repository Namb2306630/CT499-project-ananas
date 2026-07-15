<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    //đã chọn
    type: Array,
    default: () => [],
  },
  options: {
    //tất cả hiển thị
    type: Array,
    default: () => [],
  },
  placeholder: String,
})

const emit = defineEmits(['update:modelValue'])

const show = ref(false)
//để lưu DOM
const dropdown = ref(null)

const selectedItems = computed(() => {
  return props.options.filter((item) => props.modelValue.includes(item._id))
})

//dùng khi click checkbox
const toggleItem = (id) => {
  //Tạo bản sao
  let values = [...props.modelValue]

  if (values.includes(id)) {
    values = values.filter((item) => item !== id)
  } else {
    values.push(id)
  }

  //v-model
  emit('update:modelValue', values)
}

const removeItem = (id) => {
  emit(
    'update:modelValue',
    props.modelValue.filter((item) => item !== id),
  )
}

//e.target: phần tử mà người dùng vừa click
//dropdown.value: DOM của component (ref="dropdown")
const clickOutside = (e) => {
  if (!dropdown.value.contains(e.target)) {
    show.value = false
  }
}

//khi tạo com thì clicj đâu cũng đóng
onMounted(() => {
  document.addEventListener('click', clickOutside)
})

// khi com bị xóa khỏi DOM thì lick ko chạy clickOutdie
onBeforeUnmount(() => {
  document.removeEventListener('click', clickOutside)
})
</script>

<template>
  <div class="multi" ref="dropdown">
    <div class="input" @click.stop="show = !show">
      <span v-if="selectedItems.length === 0" class="placeholder">
        {{ placeholder }}
      </span>

      <div v-for="item in selectedItems" :key="item._id" class="tag">
        {{ item.name }}

        <i class="fa-solid fa-xmark" @click.stop="removeItem(item._id)"></i>
      </div>

      <i class="fa-solid fa-chevron-down arrow"></i>
    </div>

    <div v-if="show" class="menu">
      <label v-for="item in options" :key="item._id" class="option">
        <input
          type="checkbox"
          :checked="modelValue.includes(item._id)"
          @click.stop="toggleItem(item._id)"
        />
        <!--@click.stop="toggleItem(item._id)": chọn hoăc bỏ chọn  -->
        {{ item.name }}
      </label>
    </div>
  </div>
</template>

<style scoped>
.multi {
  position: relative;
  width: 100%;
}

.input {
  min-height: 42px;
  border: 1px solid var(--color-while);
  border-radius: 8px;
  padding: 6px 35px 6px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  cursor: pointer;
  background: white;
}

.placeholder {
  font-size: 14px;
}

.tag {
  background: #e8f0ff;
  color: #2563eb;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tag i {
  cursor: pointer;
}

.arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
}

.menu {
  position: absolute;
  top: 48px;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  z-index: 1000;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  max-height: 220px;
  overflow-y: auto;
}

.option {
  display: flex;
  gap: 10px;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
}

.option:hover {
  background: #f5f5f5;
}
</style>
