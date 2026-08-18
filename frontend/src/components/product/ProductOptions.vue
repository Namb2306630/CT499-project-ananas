<script setup>
import { computed, ref, watch, nextTick } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },

  initialSize: {
    type: String,
    default: '',
  },

  initialQuantity: {
    type: Number,
    default: 1,
  },

  selectedSize: {
    type: String,
    default: '',
  },

  quantity: {
    type: Number,
    default: 1,
  },

  sizes: {
    type: Array,
    default: () => [
      '31',
      '32',
      '33',
      '34',
      '35',
      '36',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45',
      '46',
    ],
  },
  textSize: {
    type: String,
    default: '25px',
  },
  padding: {
    type: String,
    default: '20px',
  },
  height: {
    type: String,
    default: '43px',
  },
})
console.log('USSS:', props.items)

const emit = defineEmits(['update:selectedSize', 'update:quantity'])

watch(
  () => props.initialSize,
  (size) => {
    if (size && !props.selectedSize) {
      emit('update:selectedSize', size)
    }
  },
  { immediate: true },
)

watch(
  () => props.initialQuantity,
  (value) => {
    if (value && props.quantity === 1) {
      emit('update:quantity', value)
    }
  },
  { immediate: true },
)

const showSizeDropdown = ref(false)
const showQuantityDropdown = ref(false)

const selectedItem = computed(() => {
  return props.items.find((item) => item.size === props.selectedSize)
})

const selectedStock = computed(() => {
  return selectedItem.value?.stock ?? 0
})

const getSizeItem = (size) => {
  return props.items.find((item) => item.size === size)
}

const selectSize = async (size) => {
  emit('update:selectedSize', size)
  emit('update:quantity', 1)

  await nextTick()

  emit('change')

  showSizeDropdown.value = false
}

const selectQuantity = async (value) => {
  emit('update:quantity', value)

  await nextTick()

  emit('change')

  showQuantityDropdown.value = false
}

// Nếu stock thay đổi mà quantity hiện tại vượt stock
watch(selectedStock, (stock) => {
  if (stock <= 0) {
    emit('update:quantity', 1)
    return
  }

  if (props.quantity > stock) {
    emit('update:quantity', stock)
  }
})
</script>

<template>
  <div class="product-options row" :style="{ paddingBottom: padding, paddingTop: padding }">
    <!-- SIZE -->
    <div class="product-option col-md-6">
      <span class="option-label" :style="{ fontSize: textSize }">SIZE</span>

      <div class="size-select">
        <div
          class="size-select-display"
          @click="showSizeDropdown = !showSizeDropdown"
          :style="{ height: height }"
        >
          <span>{{ selectedSize || '' }}</span>

          <i class="fa-solid fa-chevron-down"></i>
        </div>

        <div v-if="showSizeDropdown" class="size-dropdown">
          <button
            v-for="size in sizes"
            :key="size"
            type="button"
            class="size-item"
            :class="{
              selected: selectedSize === size,
              disabled: !getSizeItem(size),
            }"
            :disabled="!getSizeItem(size)"
            @click="selectSize(size)"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>

    <!-- SỐ LƯỢNG -->
    <div class="product-option col-md-6">
      <span class="option-label" :style="{ fontSize: textSize }">SỐ LƯỢNG</span>

      <div class="quantity-select">
        <div
          class="quantity-select-display"
          :style="{ height: height }"
          :class="{ disabled: !selectedSize }"
          @click="selectedSize && (showQuantityDropdown = !showQuantityDropdown)"
        >
          <span>
            {{ selectedSize ? quantity : '' }}
          </span>

          <i class="fa-solid fa-chevron-down"></i>
        </div>

        <div v-if="showQuantityDropdown" class="quantity-dropdown">
          <button
            v-for="i in selectedStock"
            :key="i"
            type="button"
            class="quantity-item"
            :class="{ selected: quantity === i }"
            @click="selectQuantity(i)"
          >
            {{ i }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-options {
  color: black;
  font-weight: bold;
  padding: 0;
}

.product-option {
  position: relative;
}

.option-label {
  display: block;
  font-weight: bold;
  margin-bottom: 12px;
}

/* SIZE */

.size-select {
  position: relative;
  width: 100%;
}

.size-select-display {
  border: 1px solid var(--text-gray-3);
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  cursor: pointer;
  background: white;
}

.size-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  padding: 6px;
  background: white;
  border: 1px solid var(--border-gray-2);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.size-item {
  height: 60px;
  border: 1px solid #999;
  background: white;
  font-size: 18px;
  cursor: pointer;
}

.size-item:hover:not(:disabled) {
  background: var(--color-25);
}

.size-item.selected {
  border: 2px solid black;
  font-weight: bold;
}

.size-item.disabled {
  color: var(--text-gray-3);
  background: #fafafa;
  cursor: not-allowed;
}

/* QUANTITY */

.quantity-select {
  position: relative;
  width: 100%;
}

.quantity-select-display {
  border: 1px solid var(--text-gray-3);
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  background: white;
  cursor: pointer;
}

.quantity-select-display.disabled {
  background: var(--color-25);
  color: var(--text-gray-3);
  cursor: not-allowed;
}

.quantity-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 6px;
  background: white;
  border: 1px solid var(--text-gray-3);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  z-index: 100;
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
}

.quantity-item {
  height: 60px;
  border: 1px solid #999;
  background: white;
  font-size: 18px;
  cursor: pointer;
}

.quantity-item:hover {
  background: var(--color-25);
}

.quantity-item.selected {
  border: 2px solid black;
  font-weight: bold;
}
</style>
