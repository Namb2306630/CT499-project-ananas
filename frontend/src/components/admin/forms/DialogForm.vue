<script setup>
import { ref, watch } from 'vue'
import UploadImage from '@/components/admin/forms/UploadImage.vue'

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
})

const dialog = ref(null)
const formData = ref({})
const showPassword = ref({})

const hidePassword = (name) => {
  showPassword.value[name] = !showPassword.value[name]
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

watch(
  () => props.fields,
  (fields) => {
    const data = {}

    fields.forEach((field) => {
      if (field.type === 'checkbox') {
        data[field.name] = []
      } else {
        data[field.name] = ''
      }
    })

    formData.value = data
  },
  {
    immediate: true,
  },
)

const emit = defineEmits(['submit', 'close'])

const submitForm = () => {
  emit('submit', formData.value)
}

// const submitForm = () => {
//   const data = new FormData()

//   Object.keys(formData.value).forEach((key) => {
//     if (Array.isArray(formData.value[key])) {
//       formData.value[key].forEach((item) => {
//         data.append(`${key}[]`, item)
//       })
//     } else {
//       data.append(key, formData.value[key])
//     }
//   })

//   emit('submit', data)
// }

const closeDialog = () => {
  emit('close')
}
</script>

<template>
  <dialog ref="dialog" :class="{ show: show }">
    <form @submit.prevent="submitForm">
      <div class="dialog-header">
        <h3>{{ title }}</h3>

        <button type="button" class="close-btn" @click="closeDialog">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="dialog-body">
        <UploadImage
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

              <option v-for="item in field.options" :key="item.id" :value="item.id">
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

          <p v-if="errors[field.name]" class="error">
            {{ errors[field.name] }}
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
