<script setup>
import { ref, watch } from 'vue'
import UploadImage from '@/components/admin/forms/UploadImage.vue'

const dialog = ref(null)
const formData = ref({})
const showPassword = ref({})
const uploadImage = ref(null)

const hidePassword = (name) => {
  showPassword.value[name] = !showPassword.value[name]
}
const props = defineProps({
  title: String,
  titleImg: String,
  contentImg: String,
  fields: {
    type: Array,
    default: () => [],
  },
  show: Boolean,
  showImage: {
    type: Boolean,
    default: false,
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

const resetForm = () => {
  const data = {}

  props.fields.forEach((field) => {
    if (field.type === 'checkbox') {
      data[field.name] = []
    } else {
      data[field.name] = ''
    }
  })

  emit('clearError')
  data.image = null
  formData.value = data
  uploadImage.value?.reset()
}

watch(
  () => props.show,
  (value) => {
    if (!dialog.value) return

    if (value) {
      dialog.value.showModal()
    } else {
      dialog.value.close()

      resetForm()
    }
  },
)

watch(
  () => props.fields,
  (fields) => {
    if (!fields) return
    // Chỉ khởi tạo các key nếu formData hiện tại chưa có, tránh overwrite sạch sẽ data cũ
    fields.forEach((field) => {
      if (formData.value[field.name] === undefined) {
        formData.value[field.name] = field.type === 'checkbox' ? [] : ''
      }
    })
  },
  {
    immediate: true, // chạy lần đầu khi component chạy
    // deep: true, // Để theo dõi sâu nếu options bên trong thay đổi
  },
)

const emit = defineEmits(['submit', 'close', 'clearError'])

const submitForm = () => {
  emit('submit', formData.value, () => {
    resetForm()
  })
}

const closeDialog = () => {
  emit('close')
  // resetForm()
  // uploadImage.value?.reset()
}
</script>

<template>
  <dialog ref="dialog" :class="{ show: show }" class="dialog-form">
    <form @submit.prevent="submitForm">
      <div class="dialog-header">
        <h3>{{ title }}</h3>

        <button type="button" class="close-btn" @click="closeDialog">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="dialog-body">
        <UploadImage
          ref="uploadImage"
          v-if="showImage"
          @change="formData.image = $event"
          :titleImg="titleImg"
          :contentImg="contentImg"
        />

        <div v-for="field in fields" :key="field.name" class="form-group">
          <label for="">
            {{ field.label }}
          </label>

          <!-- select -->
          <div v-if="field.type === 'select'" class="select-box">
            <select v-model="formData[field.name]" :id="formData[field.name]">
              <option value="" disabled>Chọn {{ field.label }}</option>

              <option v-for="item in field.options" :key="item._id" :value="item._id">
                {{ item.name }}
              </option>
            </select>

            <i class="fa-solid fa-chevron-down"></i>
          </div>

          <!-- input -->
          <input
            :id="formData[field.name]"
            v-if="field.type === 'text'"
            v-model="formData[field.name]"
            type="text"
            :placeholder="field.placeholder"
          />

          <!-- password -->
          <div v-if="field.type === 'password'" class="password-box">
            <input
              :id="formData[field.name]"
              v-model="formData[field.name]"
              :type="showPassword[field.name] ? 'text' : 'password'"
              :placeholder="field.placeholder"
            />

            <i
              class="fa-regular"
              :class="showPassword[field.name] ? 'fa-eye' : 'fa-eye-slash'"
              @click="hidePassword(field.name)"
            ></i>
          </div>

          <!-- checkbox -->
          <div v-if="field.type === 'checkbox'" class="checkbox-box">
            <label v-for="item in field.options" :key="item">
              <input
                type="checkbox"
                class="checkbox-input"
                :value="item"
                v-model="formData[field.name]"
              />

              {{ item }}
            </label>
          </div>

          <!-- textarea -->
          <textarea
            class="textarea"
            id=""
            v-if="field.type === 'textarea'"
            v-model="formData[field.name]"
            :placeholder="field.placeholder"
          ></textarea>

          <p v-if="errors?.[field.name]" class="error p-0 m-0">
            {{ errors[field.name] }}
          </p>
        </div>
        <p v-if="generalError && Object.keys(errors).length === 0" class="error p-0 m-0">
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
dialog label {
  padding: 0;
  margin: 0;
}

/* password */
.password-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.password-box input {
  flex: 1;
}

.fa-regular {
  cursor: pointer;
  font-size: 18px;
}

/* checkbox */
.checkbox-box {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  background: var(--bg-color-while-2);
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--color-while);
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

.checkbox-box label {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
}

.textarea {
  width: 100%;
  min-height: 120px;
  resize: vertical;
  padding: 12px;
  border: 1px solid var(--color-while);
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  transition: 0.3s;
  margin-bottom: 15px;
  font-family: inherit;
}

.textarea:focus {
  border-color: #333;
}

/* icon SELECT */
.select-box i {
  top: 50%;
}
</style>
