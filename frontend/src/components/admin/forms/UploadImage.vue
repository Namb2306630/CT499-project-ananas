<script setup>
import { ref, watch } from 'vue'
import { validateImage } from '@/utils/validateFile'
import UploadBg from '@/assets/images/upload-bg.png'
const BASE_URL = import.meta.env.VITE_BACKEND
const emit = defineEmits(['change'])
const fileInput = ref(null)
const error = ref('')

const props = defineProps({
  //gửi ảnh lên
  modelValue: {
    type: String,
    default: '',
  },

  //---------------------
  //nội dung trên input
  titleImg: {
    type: String,
    default: '',
  },

  //border ngoài
  containerBox: {
    type: Boolean,
    default: true,
  },

  //nội dung chính trong ảnh
  contentImg: {
    type: String,
    default: '',
  },

  //mô tả trong ảnh
  descImg: {
    type: String,
    default: 'Hỗ trợ JPG, PNG hoặc WEBP (Tối đa 2MB)',
  },

  //hiện BG mặc định ở input
  showBGImage: {
    type: Boolean,
    default: true,
  },

  //icon
  icon: {
    type: String,
    default: 'add_a_photo',
  },

  //chiều cao
  height: {
    type: String,
    default: '300px',
  },

  width: {
    type: String,
    default: '100%',
  },

  //bg icon ảnh
  showIconBG: {
    type: Boolean,
    default: true,
  },

  //hiện icon và nội dung trên ảnh
  showContentInImage: {
    type: Boolean,
    default: true,
  },

  objectFit: {
    type: String,
    default: 'cover',
  },
})

const image = ref('')

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) return

    if (!image.value) {
      if (!image.value) {
        image.value = `${BASE_URL}/${newValue}`
      }
    }
  },
  {
    immediate: true,
  },
)

const reset = () => {
  image.value = null
  error.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

//cho phép component cha truy cập vào biến hoặc hàm của component con thông qua ref
defineExpose({
  reset,
})

const clickUpload = () => {
  fileInput.value.click()
}

const upload = (e) => {
  const file = e.target.files[0]
  error.value = ''
  if (!file) return
  const err = validateImage(file)
  if (err) {
    error.value = err
    e.target.value = ''
    return
  }
  // hiện ảnh mới ngay
  image.value = URL.createObjectURL(file)
  emit('change', file) // gửi ra compo cha
}
</script>

<template>
  <div :class="{ 'container-img': containerBox }">
    <p class="titleImg p-0 m-0">{{ titleImg }}</p>

    <div
      class="upload-box"
      :class="{ uploaded: image }"
      :style="{
        height: height,
        width: width,
        marginTop: containerBox ? '8px' : '0px',
      }"
      @click="clickUpload"
    >
      <img
        v-if="image"
        class="preview-image"
        :src="image"
        alt="Ảnh đã tải lên"
        :style="{ objectFit: objectFit }"
      />

      <img
        v-else-if="showBGImage"
        class="preview-image default-bg"
        :src="UploadBg"
        alt="Ảnh nền tải lên"
      />

      <div v-if="showContentInImage" class="title-upload">
        <div :class="[image ? 'icon-tick' : 'icon-camera', { 'no-icon-bg': !showIconBG }]">
          <span class="material-symbols-outlined" :class="{ check_circle: image }">
            {{ image ? 'check_circle' : icon }}
          </span>
        </div>

        <div class="content-upload">
          <p v-if="!image" class="p-0 m-0 pload-heading" :class="{ uploadedContent: image }">
            {{ contentImg }}
          </p>
          <p v-if="image" class="p-0 m-0 pload-heading" :class="{ uploadedContent: image }">
            Ảnh đã sẵn sàng
          </p>
          <p class="p-0 m-0 desc-upload" :class="{ uploadedContent: image }">
            {{ descImg }}
          </p>
        </div>
      </div>

      <input
        id=""
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        @change="upload"
      />
    </div>

    <p class="upload-error p-0 m-0">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.upload-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 2px solid var(--border-gray-2);
  transition: 0.3s ease;
}

.preview-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  /* object-fit: cover; */
  transition: transform 0.4s ease;
  pointer-events: none;
}

.upload-box:hover .preview-image {
  transform: scale(1.08);
}

.title-upload {
  position: relative;
  z-index: 2;
}

.container-img,
.container-field {
  border: 2px solid var(--border-gray-2);
  padding: 5px 10px 10px 10px;
  border-radius: 10px;
  box-shadow: var(--shadow-gray);
  margin-bottom: 18px;
}

.upload-box:hover,
.title-upload:hover {
  cursor: pointer;
}
.upload-box:hover {
  border: 1px solid var(--color-bule);
}

.upload-box.uploaded:hover {
  border: 1px solid var(--bg-green);
}

.upload-box::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1;
}

.uploaded::before {
  background: rgba(255, 255, 255, 0);
}

.uploadedContent {
  color: var(--text-white) !important ;
}

.container-field input {
  margin-bottom: 10px;
}

/* ẩn input */
.upload-box input {
  display: none;
}

.upload-box .title-upload {
  z-index: 1;
}

.title-upload,
.content-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.content-upload .pload-heading {
  color: var(--text-grey);
  font-size: var(--font-size-sm);
  font-weight: var(--font-width-lg);
}

.content-upload {
  margin-top: 10px;
}

.desc-upload {
  color: var(--text-gray-2);
  font-size: var(--font-size-sm);
  text-transform: none;
  font-weight: normal;
  text-align: center;
}

.icon-camera {
  background-color: var(--bg-active);
  border-radius: 10px;
  padding: 10px 10px 5px 10px;
  color: var(--text-white);
}
.icon-tick {
  background-color: var(--bg-green);
  border-radius: 10px;
  padding: 10px 10px 5px 10px;
  color: var(--text-green);
}

input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border-gray-2);
  border-radius: 8px;
  outline: none;
  width: 100%;
}

.submit {
  height: 40px;
  border: none;
  border-radius: 8px;
  background-color: var(--bg-active);
  color: var(--text-white);
  cursor: pointer;
  width: 100%;
  font-weight: var(--font-width-md);
  transition: 0.3s ease;
}
.cancel {
  height: 40px;
  border: none;
  border-radius: 8px;
  background-color: var(--bg-color-red);
  color: var(--text-white);
  cursor: pointer;
  width: 100%;
  font-weight: var(--font-width-md);
  transition: 0.3s ease;
}

.titleImg {
  text-transform: capitalize;
  font-size: var(--font-size-sm);
  color: var(--text-gray-4);
  font-weight: var(--font-width-md);
}

dialog::-webkit-scrollbar {
  display: none; /* Chrome, Edge, Safari */
}

.no-icon-bg {
  background: transparent !important;
  padding: 0;
  color: var(--text-gray-3);
}
.check_circle {
  color: var(--text-green) !important;
}

@media (max-width: 450px) {
  .container-img {
    width: 100%;
  }

  .upload-box {
    width: 220px !important;
    height: 220px !important;
  }

  .content-upload .pload-heading {
    font-size: 12px;
    text-align: center;
  }

  .desc-upload {
    font-size: 11px;
  }
}

@media (max-width: 350px) {
  .upload-box {
    width: 180px !important;
    height: 180px !important;
  }
}
</style>
