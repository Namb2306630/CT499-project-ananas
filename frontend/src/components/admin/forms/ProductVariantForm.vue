<script setup>
import { ref, watch, onMounted } from 'vue'
import UploadImage from './UploadImage.vue'
import { validateImage } from '@/utils/validateFile.js'
import { useProductStore } from '@/stores/product.js'

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
  images.value = []
  countImage.value = 0
  colorCode.value = '#000000'
  mainImageRef.value?.reset()
  hoverImageRef.value?.reset()
}

onMounted(async () => {
  if (productStore.products.length > 0) {
    //
  }

  await productStore.fetchForUser()
})

const dialog = ref(null)
const colorCode = ref('#000000')
const mainImageRef = ref(null)
const hoverImageRef = ref(null)

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

const images = ref([])
const imageErrors = ref([])
const countImage = ref(0)

const uploadImages = (e) => {
  const files = Array.from(e.target.files)

  imageErrors.value = []

  if (images.value.length + files.length > 10) {
    imageErrors.value.push('Chỉ được upload tối đa 10 ảnh')
    return
  }

  const validImages = []

  files.forEach((file) => {
    const error = validateImage(file)

    if (error) {
      imageErrors.value.push(error)
    } else {
      validImages.push({
        file,
        url: URL.createObjectURL(file),
      })
    }
  })

  images.value.push(...validImages)

  formData.value.images = images.value.map((item) => item.file)

  countImage.value = images.value.length
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
          />
        </div>
        <div class="form-group select-box">
          <label for="product">Chọn sản phẩm</label>
          <select id="product" v-model="formData.product">
            <option disabled value="">-- Chọn sản phẩm --</option>

            <option v-for="item in products" :key="item._id" :value="item._id">
              {{ item.name }}
            </option>
          </select>
          <i class="fa-solid fa-chevron-down"></i>
        </div>

        <div class="form-group">
          <label for="colorName">Sản phẩm có màu</label>
          <input
            v-model="formData.colorName"
            type="text"
            name=""
            id="colorName"
            placeholder="Màu của sản phẩm"
          />
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
            />
          </div>
        </div>

        <div class="form-group">
          <label for="" class="label-image"
            ><i class="fa-regular fa-images"></i>Hình ảnh sản phẩm</label
          >
          <div class="upload-box">
            <div class="image-upload-row">
              <div class="image-upload-item">
                <UploadImage
                  ref="mainImageRef"
                  @change="formData.mainImage = $event"
                  contentImg="Ảnh chính"
                  descImg="Dùng làm ảnh đại hiện"
                  icon="add_a_photo"
                  :showBGImage="false"
                  height="200px"
                  :container-box="false"
                  :show-icon-b-g="false"
                />
              </div>
              <div class="image-upload-item">
                <UploadImage
                  ref="hoverImageRef"
                  @change="formData.hoverImage = $event"
                  contentImg="Ảnh khi hover"
                  descImg="Hiệu ứng khi hover"
                  icon="flip_camera_ios"
                  :showBGImage="false"
                  height="200px"
                  :container-box="false"
                  :show-icon-b-g="false"
                />
              </div>
            </div>
          </div>
          <div class="images-box">
            <div class="title-images">
              <p class="p-0 m-0">Ảnh phụ (Bộ sưu tập)</p>
              <div class="count-image">
                <p class="p-0 m-0 px-2">{{ countImage }}/10</p>
              </div>
            </div>

            <div class="preview-images">
              <!-- nút thêm ảnh -->
              <label v-if="images.length < 10" class="add-image" aria-label="Thêm ảnh">
                <i class="fa-solid fa-plus"></i>

                <input
                  class="input-upload-images"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  @change="uploadImages"
                />
              </label>

              <!-- ảnh đã chọn -->
              <div v-for="(img, index) in images" :key="index" class="image-item">
                <img :src="img.url" alt="Ảnh phụ" />
              </div>
            </div>
          </div>
          <p>Hỗ trợ JPG, PNG hoặc WEBP (Tối đa 2MB)</p>
        </div>
        <p v-if="generalError" class="error p-0 mt-3 m-0 d-flex justify-content-center">
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

.dialog-header h3 {
  border-left: 5px solid var(--color-9);
  padding-left: 10px;
}
.label-image {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;
}

.label-image i {
  color: var(--color-bule-2);
}
form {
  display: flex;
  flex-direction: column;
}

.form-group {
  flex: 1;
  margin: 0;
}

.form-group p {
  color: var(--text-gray-4);
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

select {
  margin-bottom: 14px;
}

input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border-gray-3);
  border-radius: 8px;
  outline: none;
  width: 100%;
  transition: 0.3s ease;
  margin-bottom: 15px;
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

/* icon SELECT */
.select-box i {
  top: 60%;
}

/* Ảnh bộ sưu tập */
.images-box {
  background-color: var(--bg-color-3);
  border-radius: 5px;
  padding: 10px;
}
.title-images {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.count-image {
  background-color: var(--bg-color-4);
  border-radius: 3px;
  color: var(--text-gray-3);
}
.title-images > p:first-child {
  color: var(--text-gray-3);
}

/* ẢNH CHÍNH */
.image-upload-row {
  display: flex;
  gap: 12px;
}

.image-upload-item {
  flex: 1;
}

/* UPLOAD ẢNH PHỤ */

.preview-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

/* ô dấu + */
.add-image {
  width: 100px;
  height: 100px;
  border: 1px dashed var(--border-gray-3);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;
}

.add-image i {
  font-size: 30px;
  color: var(--text-gray-3);
}

/* ẩn input */
.input-upload-images {
  display: none;
}

/* ảnh */
.image-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

@media (max-width: 767px) {
  .image-upload-row {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
