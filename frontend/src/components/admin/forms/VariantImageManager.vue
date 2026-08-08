<script setup>
import { ref, watch, computed } from 'vue'
import UploadImage from './UploadImage.vue'
import { validateImage } from '@/utils/validateFile'

const BASE_URL = import.meta.env.VITE_BACKEND

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  readonly: Boolean,

  errors: {
    type: Object,
    default: () => ({}),
  },
  height: {
    type: String,
    default: '200px',
  },
  showContentInImage: {
    type: Boolean,
    default: true,
  },
  titleMainImage: {
    type: String,
    default: '',
  },
  titleHoverImage: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])
const images = ref([])
const imageErrors = ref([])
const variant = computed({
  get() {
    return props.modelValue
  },

  set(value) {
    emit('update:modelValue', value)
  },
})
watch(
  () => variant.value.images,
  (value = []) => {
    images.value = value.map((item) => {
      //file user gửi lên
      if (item instanceof File) {
        return {
          file: item,
          // dùng để tạo url ảo đẻ hiện ảnh lên
          url: URL.createObjectURL(item),
        }
      }

      return {
        file: null,
        url: `${BASE_URL}/${item}`,
      }
    })
  },
  {
    //sẽ chạy ngay khi component được tạo.
    immediate: true,
  },
)

const uploadImages = (e) => {
  const files = Array.from(e.target.files)

  imageErrors.value = []

  if (images.value.length + files.length > 10) {
    imageErrors.value.push('Chỉ được upload tối đa 10 ảnh')
    return
  }

  const valid = []

  files.forEach((file) => {
    const err = validateImage(file)

    if (err) {
      imageErrors.value.push(err)
      return
    }

    valid.push({
      file,
      url: URL.createObjectURL(file),
      //Browser tạo ra một URL tạm để hiệ ra ở giao diện
    })
  })

  images.value.push(...valid)

  variant.value = {
    ...variant.value,
    images: images.value.map((i) => i.file ?? i.url.replace(`${BASE_URL}/`, '')),
  }
}

const removeImage = (index) => {
  images.value.splice(index, 1)

  variant.value = {
    ...variant.value,
    images: images.value.map((i) => i.file ?? i.url.replace(`${BASE_URL}/`, '')),
  }
}
</script>

<template>
  <div class="form-group">
    <label for="" class="label-image">
      <i class="fa-regular fa-images"></i>
      Hình ảnh sản phẩm
    </label>

    <div class="upload-box">
      <div class="image-upload-row">
        <div class="image-upload-item">
          <p v-if="titleMainImage !== ''" class="ml-1 title-image">{{ titleMainImage }}</p>
          <UploadImage
            :model-value="variant.mainImage"
            :show-content-in-image="showContentInImage"
            @change="variant.mainImage = $event"
            contentImg="Ảnh chính"
            descImg="Dùng làm ảnh đại diện"
            icon="add_a_photo"
            :container-box="false"
            :showBGImage="false"
            :show-icon-bg="false"
            :height="height"
            :width="'100%'"
          />

          <p v-if="errors.mainImage" class="error ml-1 m-0">
            {{ errors.mainImage }}
          </p>
        </div>
        <div class="image-upload-item">
          <p v-if="titleHoverImage !== ''" class="ml-1 title-image m-0">{{ titleHoverImage }}</p>
          <UploadImage
            :model-value="variant.hoverImage"
            :show-content-in-image="showContentInImage"
            @change="variant.hoverImage = $event"
            contentImg="Ảnh hover"
            descImg="Hiệu ứng hover"
            icon="flip_camera_ios"
            :container-box="false"
            :showBGImage="false"
            :show-icon-bg="false"
            :height="height"
            :width="'100%'"
          />

          <p v-if="errors.hoverImage" class="error ml-1">
            {{ errors.hoverImage }}
          </p>
        </div>
      </div>
    </div>

    <div class="images-box">
      <div class="title-images">
        <p class="p-0 m-0">Ảnh phụ (Bộ sưu tập)</p>

        <p class="p-0 m-0 px-2">{{ images.length }}/10</p>
      </div>

      <div class="preview-images">
        <label v-if="!readonly && images.length < 10" class="add-image" aria-label="Thêm ảnh">
          <i class="fa-solid fa-plus"></i>

          <input
            type="file"
            multiple
            class="input-upload-images"
            accept="image/jpeg,image/png,image/webp"
            @change="uploadImages"
          />
        </label>

        <div v-for="(img, index) in images" :key="index" class="image-item">
          <img :src="img.url" alt="Ảnh phụ" />
          <button v-if="!readonly" class="remove-btn" @click.prevent="removeImage(index)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>
    <p class="hint">Hỗ trợ JPG, PNG hoặc WEBP</p>

    <p v-for="err in imageErrors" :key="err" class="error">
      {{ err }}
    </p>
  </div>
</template>

<style scoped>
.error {
  color: var(--text-red);
  text-align: left;
  justify-content: flex-start !important;
  align-items: flex-start !important;
  width: 100%;
  margin-top: 6px;
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

.form-group > .hint {
  color: var(--text-gray-4);
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 15px 0 0 0;
  font-weight: 500;
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

label {
  padding: 0;
  margin: 0;
}

/* Ảnh bộ sưu tập */
.images-box {
  background-color: var(--bg-color-3);
  border: 2px solid var(--border-gray-2);
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
  color: var(--color-4);
  font-weight: 500;
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
.image-item {
  position: relative;
  width: 100px;
  height: 100px;
}
/* ảnh */
.image-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.remove-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  z-index: 10;
}

.remove-btn i {
  color: white;
  font-size: 10px;
}

.title-image {
  padding: 0;
  margin: 0 0 5px 0;
  font-weight: 500;
  color: var(--color-4);
}

@media (max-width: 767px) {
  .image-upload-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
