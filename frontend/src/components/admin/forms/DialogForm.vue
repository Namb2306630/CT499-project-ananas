<script setup>
import { ref, watch } from 'vue'
import UploadImage from '@/components/admin/forms/UploadImage.vue'
import MultiSelect from '@/components/admin/forms/MultiSelect.vue'
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
  //EDIT
  data: {
    type: Object,
    default: () => ({}),
  },
})

//reset form
const resetForm = () => {
  const data = {}

  props.fields.forEach((field) => {
    switch (field.type) {
      case 'checkbox':
      case 'multiselect':
        data[field.name] = []
        break

      case 'checkbox-group':
        field.options.forEach((item) => {
          data[item.name] = false
        })
        break

      default:
        data[field.name] = ''
    }
  })

  if (props.showImage) {
    data.image = null
  }

  formData.value = data
  uploadImage.value?.reset()
  emit('clearError')
}
//mở dialog
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

//from dl
watch(
  () => props.fields,
  (fields) => {
    if (!fields) return

    fields.forEach((field) => {
      if (field.type === 'checkbox-group') {
        field.options.forEach((item) => {
          if (formData.value[item.name] === undefined) {
            formData.value[item.name] = false
          }
        })
      } else if (formData.value[field.name] === undefined) {
        switch (field.type) {
          case 'checkbox':
          case 'multiselect':
            formData.value[field.name] = []
            break

          default:
            formData.value[field.name] = ''
        }
      }
    })
  },
  {
    immediate: true,
  },
)

// check isSale
watch(
  () => formData.value.discountPercent,
  (value) => {
    const discount = Number(value) || 0

    formData.value.isSale = discount > 0
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
              <option value="" disabled>{{ field.placeholder }}</option>

              <option v-for="item in field.options" :key="item._id" :value="item._id">
                {{ item.name }}
              </option>
            </select>

            <i class="fa-solid fa-chevron-down"></i>
          </div>

          <!-- multiselect -->
          <MultiSelect
            v-if="field.type === 'multiselect'"
            v-model="formData[field.name]"
            :options="field.options"
            :placeholder="field.placeholder"
          />

          <!-- input -->
          <input
            :id="formData[field.name]"
            v-if="field.type === 'text'"
            v-model="formData[field.name]"
            maxlength="100"
            type="text"
            :placeholder="field.placeholder"
          />

          <!-- number -->
          <input
            :id="formData[field.name]"
            v-if="field.type === 'number'"
            min="0"
            v-model="formData[field.name]"
            type="number"
            :placeholder="field.placeholder"
          />

          <!-- password -->
          <div v-if="field.type === 'password'" class="password-box">
            <input
              :id="formData[field.name]"
              v-model="formData[field.name]"
              :type="showPassword[field.name] ? 'text' : 'password'"
              :placeholder="field.placeholder"
              maxlength="100"
            />

            <i
              class="fa-regular"
              :class="showPassword[field.name] ? 'fa-eye' : 'fa-eye-slash'"
              @click="hidePassword(field.name)"
            ></i>
          </div>

          <!-- radio -->
          <div v-if="field.type === 'radio'" class="radio-box">
            <label v-for="item in field.options" :key="item.value">
              <input
                type="radio"
                class="radio"
                :name="field.name"
                :value="item.value"
                v-model="formData[field.name]"
              />
              {{ item.label }}
            </label>
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

          <div v-if="field.type === 'checkbox-group'" class="checkbox-group">
            <label v-for="item in field.options" :key="item.name">
              <input type="checkbox" class="checkbox-product" v-model="formData[item.name]" />
              {{ item.label }}
            </label>
          </div>

          <!-- textarea -->
          <textarea
            class="textarea description"
            id=""
            v-if="field.type === 'textarea'"
            v-model="formData[field.name]"
            :placeholder="field.placeholder"
            maxlength="500"
          ></textarea>
          <div v-if="field.type === 'textarea'" class="char-count">
            {{ (formData[field.name] || '').length }}/500
          </div>

          <p v-if="errors?.[field.name]" class="error p-0 m-0">
            {{ errors[field.name] }}
          </p>
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
/* số lượng ký tự */
.char-count {
  text-align: right;
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}
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
.checkbox-box,
.radio-box {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  background: var(--bg-color-while-2);
  padding: 0 12px;
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
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.checkbox-box label,
.radio-box label {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
}

.description {
  width: 100%;
  min-height: 120px;
  resize: vertical;
  padding: 12px;
  outline: none;
  font-size: 14px;
}

h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-gray-4);
  border-left: 4px solid var(--color-bule);
  padding-left: 12px;
}

/* checkbox-trạng thái như sale,... */
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;

  padding: 12px;
  border: 1px solid var(--color-while);
  border-radius: 10px;
  background: var(--bg-color-while-2);
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  cursor: pointer;
}

.checkbox-product {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

@media (max-width: 767px) {
  .checkbox-group,
  .checkbox-box,
  .radio-box {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
