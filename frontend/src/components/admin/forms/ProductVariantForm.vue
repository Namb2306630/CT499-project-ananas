<script setup>
import { ref, watch } from 'vue'
import UploadImage from './UploadImage.vue'
import { validateImage } from '@/utils/validateFile.js'

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
})

const dialog = ref(null)
const formData = ref({
  productId: '',
})
const colorCode = ref('#000000')
const errors = ref({})

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
    }
  },
)

const emit = defineEmits(['submit', 'close'])

const submitForm = () => {
  console.log(formData.value)

  emit('submit', formData.value)
}

const closeDialog = () => {
  emit('close')
}

const images = ref([])
const countImage = ref(0)

const uploadImages = (e) => {
  const files = Array.from(e.target.files)

  errors.value.images = []

  if (images.value.length + files.length > 10) {
    errors.value.images.push('Chỉ được upload tối đa 10 ảnh')
    return
  }

  const validImages = []

  files.forEach((file) => {
    const error = validateImage(file)

    if (error) {
      errors.value.images.push(error)
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
        <h3>Thêm sản phẩm</h3>

        <button type="button" class="close-btn" @click="closeDialog">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="dialog-body">
        <div class="form-group">
          <label for="code"> Nhập mã sản phẩm * </label>
          <input
            id="code"
            name=""
            v-model="formData.code"
            type="text"
            placeholder="Nhập mã sản phẩm"
          />
        </div>
        <div class="form-group select-box">
          <label for="productId">Thuộc sản phẩm *</label>
          <selec id="productId" v-model="formData.productId">
            <option disabled value="">-- Thuộc biến thể --</option>

            <option v-for="item in products" :key="item._id" :value="item._id">
              {{ item.name }}
            </option>
          </selec>
          <i class="fa-solid fa-chevron-down"></i>
        </div>

        <div class="form-group">
          <label for="color">Sản phẩm có màu *</label>
          <input
            v-model="formData.color"
            type="text"
            name=""
            id="color"
            placeholder="Màu của sản phẩm"
          />
        </div>

        <div class="form-group">
          <label for="colorCode">Code color *</label>

          <div class="color-picker">
            <input id="" type="color" v-model="colorCode" />

            <input
              id="colorCode"
              class="hex-input"
              type="text"
              v-model="colorCode"
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
                  @change="formData.imageMain = $event"
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
                  @change="formData.imageHover = $event"
                  contentImg="Ảnh khi hover"
                  descImg="Hiệu ứng danh sách"
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
              <label v-if="images.length < 10" class="add-image">
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
                <img :src="img.url" />
              </div>
            </div>
          </div>
          <p>Hỗ trợ JPG, PNG hoặc WEBP (Tối đa 2MB)</p>
          <p v-if="errors.images?.length" class="error">
            {{ errors.images[0] }}
          </p>
        </div>
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
  }
}
</style>
