<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: Boolean,

  variants: {
    type: Array,
    default: () => [],
  },

  errors: {
    type: Object,
    default: () => ({}),
  },
  generalError: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['submit', 'close'])

const dialog = ref(null)

watch(
  () => props.show,
  (value) => {
    if (value) {
      dialog.value.showModal()
    } else {
      dialog.value.close()
      resetForm()
    }
  },
)

const resetForm = () => {
  formData.value = {
    variant: '',
    sizes: [
      {
        size: '',
        stock: 0,
      },
    ],
  }
}

const groupedVariants = computed(() => {
  const groups = {}
  for (const item of props.variants) {
    const productId = item.product._id

    if (!groups[productId]) {
      groups[productId] = {
        productName: item.product.name,
        variants: [],
      }
    }

    groups[productId].variants.push(item)
  }
  return Object.values(groups)
})

const formData = ref({
  variant: '',

  sizes: [
    {
      size: '',
      stock: 0,
    },
  ],
})

// thêm size
const addSize = () => {
  formData.value.sizes.push({
    size: '',
    stock: 0,
  })
}
// xóa size
const removeSize = (index) => {
  formData.value.sizes.splice(index, 1)
}

const submitForm = () => {
  emit('submit', formData.value)
}

const closeDialog = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <dialog ref="dialog" :class="{ show: show }" class="dialog-form sku-dialog">
    <form @submit.prevent="submitForm">
      <div class="dialog-header">
        <h3>Thêm SKU sản phẩm</h3>

        <button type="button" class="close-btn" @click="closeDialog">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="dialog-body">
        <!-- Variant -->
        <div class="form-group">
          <label for="variant">Thuộc biến thể</label>

          <div class="select-box">
            <select id="variant" v-model="formData.variant">
              <option value="" disabled>-- Chọn biến thể --</option>

              <optgroup
                v-for="group in groupedVariants"
                :key="group.productName"
                :label="group.productName"
              >
                <option v-for="item in group.variants" :key="item._id" :value="item._id">
                 {{ item.colorName }} - {{ item._id }}
                </option>
              </optgroup>
            </select>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <p v-if="errors.variant" class="error m-0 p-0">{{ errors.variant }}</p>
        </div>

        <!-- Size -->
        <div class="size-title">
          <span class="p-0 m-0">Kích thước & tồn kho</span>
        </div>

        <div class="size-card" v-for="(item, index) in formData.sizes" :key="index">
          <div class="form-group">
            <label for="size">Size</label>
            <input id="size" v-model="item.size"  placeholder="VD: 40 hoặc M" />
          </div>

          <div class="form-group">
            <label for="stock">Số lượng</label>

            <input id="stock" type="number" min="1" v-model="item.stock" />
          </div>

          <div class="form-group remove-group">
            <label for="remove-btn">Xóa</label>

            <button id="remove-btn" type="button" class="remove-btn" @click="removeSize(index)">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
        <p v-if="errors.sizes" class="error p-0 m-0 mb-2">{{ errors.sizes }}</p>
        <button type="button" class="add-size" @click="addSize">
          <i class="fa-solid fa-plus"></i>
          Thêm size
        </button>

        <div><p v-if="generalError" class="error m-0 mt-3 error-general">
          {{ generalError }}
        </p></div>
      </div>

      <div class="dialog-footer">
        <button type="button" class="cancel-btn" @click="closeDialog">Hủy</button>

        <button type="submit" class="save-btn">Lưu</button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
@import '../../../assets/css/dialog.css';

input,
select {
  height: 42px;
  border: 1px solid var(--color-while);
  border-radius: 8px;
  padding: 0 12px;
  outline: none;
  font-size: 14px;
  transition: 0.2s;
}

label {
  padding: 0;
  margin: 0;
}

.size-title {
  margin: 8px 0;
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--text-gray-4);
}

.size-card {
  display: flex;
  gap: 12px;
  align-items: center;
  background: var(--bg-color-while-2);
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  border: 1px solid var(--border-gray-2);
}

.size-card .form-group {
  flex: 1 1 0;
  min-width: 0;
}

.remove-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 8px;
  background: #fee2e2;
  color: var(--text-color-red);
  flex: 0 0 42px;
  cursor: pointer;
}
.remove-group {
  flex: 0 0 42px !important;
}
.remove-btn:hover {
  background: #fecaca;
}

.add-size {
  width: 100%;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px dashed #aaa;
  background: var(--bg-color);
  cursor: pointer;
  font-weight: var(--font-width-md);
  transition: 0.2s;
}

.add-size:hover {
  background: #f8fafc;
}

@media (max-width: 767px) {
  .dialog-header {
    padding: 16px;
  }

  .dialog-header h4 {
    font-size: 18px;
  }

  .close-btn {
    width: 32px;
    height: 32px;
  }

  .dialog-body {
    padding: 16px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .form-group {
    margin-bottom: 14px;
  }

  input,
  select {
    height: 40px;
    font-size: 14px;
  }

  /* size item */

  .size-card {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px;
  }

  .size-card .form-group {
    flex: 1;
    min-width: 0;
    width: auto;
  }

  .remove-btn {
    width: 100%;
    height: 40px;
  }

  .add-size {
    height: 40px;
  }

  /* footer */

  .dialog-footer {
    padding: 14px 16px;
    flex-direction: column-reverse;
    gap: 10px;
  }

  .dialog-footer button {
    width: 100%;
    height: 42px;
  }
}
</style>
