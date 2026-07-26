<script setup>
import { ref, watch, onMounted } from 'vue'
import { useProductStore } from '@/stores/product.js'
import VariantImageManager from './VariantImageManager.vue'
const props = defineProps({
  show: Boolean,

  products: {
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

  showProductOptions: {
    type: Boolean,
    default: true,
  },
})

const productStore = useProductStore()

const getDefaultForm = () => ({
  _id: '',
  code: '',
  product: '',
  colorName: '',
  colorCode: '#000000',
  mainImage: null,
  imageHover: null,
  images: [],
})

const formData = ref(getDefaultForm())

const resetForm = () => {
  formData.value = getDefaultForm()
  colorCode.value = '#000000'
}

onMounted(async () => {
  if (productStore.products.length > 0) {
    //
  }

  await productStore.fetchForUser()
})

const dialog = ref(null)
const colorCode = ref('#000000')

const updateColor = (e) => {
  let value = e.target.value

  if (!value.startsWith('#')) {
    value = '#' + value
  }

  colorCode.value = value
}

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

const emit = defineEmits(['submit', 'close'])

const submitForm = () => {
  emit('submit', formData.value)
}

const closeDialog = () => {
  resetForm()
  emit('close', 'clearError')
}
</script>

<template>
  <dialog ref="dialog" :class="{ show: show }" class="dialog-form">
    <form @submit.prevent="submitForm">
      <div class="dialog-header">
        <h3>Thêm biến thể sản phẩm</h3>

        <button type="button" class="close-btn" @click="closeDialog">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="dialog-body">
        <div class="form-group">
          <label for="id"> Nhập mã sản phẩm </label>
          <input
            id="id"
            name=""
            v-model="formData._id"
            type="text"
            placeholder="Nhập mã sản phẩm"
            maxlength="7"
          />
          <p v-if="errors._id" class="error">{{ errors._id }}</p>
        </div>

        <div v-if="props.showProductOptions" class="form-group">
          <label for="product">Chọn sản phẩm</label>
          <div class="select-box">
            <select id="product" v-model="formData.product">
              <option disabled value="">-- Chọn sản phẩm --</option>

              <option v-for="item in products" :key="item._id" :value="item._id">
                {{ item.name }}
              </option>
            </select>
            <i class="fa-solid fa-chevron-down"></i>
          </div>

          <p v-if="errors.product" class="error">{{ errors.product }}</p>
        </div>

        <div class="form-group">
          <label for="colorName">Sản phẩm có màu</label>
          <input
            v-model="formData.colorName"
            type="text"
            name=""
            id="colorName"
            maxlength="50"
            placeholder="Màu của sản phẩm"
          />
          <p v-if="errors.colorName" class="error">{{ errors.colorName }}</p>
        </div>

        <div class="form-group">
          <label for="colorCode">Code color</label>

          <div class="color-picker">
            <input id="" type="color" v-model="formData.colorCode" />

            <input
              id="colorCode"
              class="hex-input"
              type="text"
              v-model="formData.colorCode"
              @input="updateColor"
              placeholder="#000000"
              maxlength="7"
            />
            <p v-if="errors.colorCode" class="error">{{ errors.colorCode }}</p>
          </div>
        </div>

        <VariantImageManager v-model="formData" :readonly="false" :errors="errors" />
        <p v-if="generalError" class="error mt-3 d-flex justify-content-center">
          {{ generalError }}
        </p>
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

.error {
  color: var(--text-red);
  align-items: start;
}

.dialog-header h3 {
  border-left: 5px solid var(--color-9);
  padding-left: 10px;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  flex: 1;
}

.form-group > .hint {
  color: var(--text-gray-4);
  text-align: center;
}

/* select {
  margin-bottom: 14px;
} */

input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border-gray-3);
  border-radius: 8px;
  outline: none;
  width: 100%;
  transition: 0.3s ease;
  /* margin-bottom: 15px; */
}

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
.color-picker {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.color-picker input[type='color'] {
  width: 55px !important;
  height: 42px;
  padding: 3px;
  border: 1px solid var(--border-gray-3);
  border-radius: 10px;
  cursor: pointer;
  flex: none;
  margin: 0;
}

.hex-input {
  flex: 1;
  height: 42px;
  margin: 0;
}
</style>
