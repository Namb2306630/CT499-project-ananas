<script setup>
import DetailActions from '@/components/admin/detail/DetailActions.vue'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue'
import DetailStats from '@/components/admin/detail/DetailStats.vue'
import DetailStatus from '@/components/admin/detail/DetailStatus.vue'
import HeaderDetail from '@/components/admin/detail/HeaderDetail.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useToastStore } from '@/stores/toast'
import { useStyleStore } from '@/stores/style'
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createSlug } from '@/utils/slug'
import { useDelete } from '@/composables/useDelete'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()

const toastStore = useToastStore()
const styleStore = useStyleStore()
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const { error } = storeToRefs(styleStore)

const errors = computed(() => error.value.errors)

const style = ref({
  _id: '',
  name: '',
  slug: '',
  description: '',
  isActive: true,
  createdAt: '',
  productCount: 0,
})
watch(
  () => style.value.name,
  (newName) => {
    if (newName != null && newName !== '') {
      style.value.slug = createSlug(newName)
    }
  },
)
onMounted(async () => {
  const slug = route.params.slug
  if (styleStore.style?.slug === slug) {
    Object.assign(style.value, styleStore.style)
  }

  const data = await styleStore.getBySlug(slug)

  if (data && data.length > 0) {
    Object.assign(style.value, data[0])
  }
  loading.value = false
})

const confirmDelete = async () => {
  if (!deleteItem.value) return

  const res = await styleStore.delete(deleteItem.value._id)

  if (res) {
    toastStore.showToast(res.message, 'success')
    closeDelete()
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(styleStore.error.errors)[0] ||
      styleStore.error.general ||
      'Xóa dòng sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
    closeDelete()
  }
}

const saveStyle = async () => {
  const res = await styleStore.update(style.value._id, style.value)

  if (res?.code === 200) {
    styleStore.clearError()
    toastStore.showToast(res.message, 'success')
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(styleStore.error.errors)[0] ||
      styleStore.error.errors ||
      'Cập nhật dòng sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
}
</script>
<template>
  <div class="container-detail">
    <HeaderDetail
      v-if="!loading"
      title-go-back="Chi tiết kiểu dáng sản phẩm"
      title-delete="Xóa kiểu dáng sản phẩm"
      @delete="openDelete(style)"
    />
    <div class="detail-grid">
      <DetailLayout title="Thông tin cở bản của kiểu dáng sản phẩm">
        <div class="top-info">
          <div class="form">
            <!-- name -->
            <label for="">Tên kiểu dáng sản phẩm</label>
            <input type="text" name="" id="" v-model="style.name" />
            <p v-if="errors.name" class="error">{{ errors.name }}</p>

            <!-- slug -->
            <label for="">Đường dẫn thân thiện (Slug)</label>
            <input type="text" name="" id="" readonly v-model="style.slug" />
            <p v-if="errors.slug" class="error">{{ errors.slug }}</p>

            <!-- mô tả -->
            <label for="">Mô tả kiểu dáng sản phẩm</label>
            <textarea
              type="text"
              name=""
              id=""
              rows="5"
              class="description"
              placeholder="Thêm mô tả tả kiểu dáng sản phẩm..."
              v-model="style.description"
            ></textarea>
            <p v-if="errors.description" class="error">{{ errors.description }}</p>
          </div>
        </div>
      </DetailLayout>
      <div class="row info-card-2">
        <DetailStats
          count-label="Sản phẩm hiện có"
          :count="style.productCount"
          :created-at="style.createdAt"
        />
        <DetailStatus
          description="Khách hàng có thể thấy và tìm kiếm các sản phẩm thuộc kiểu dáng này"
          v-model="style.isActive"
        />
      </div>
      <DetailActions @save="saveStyle" @cancel="router.back()" />
    </div>
  </div>
  <ConfirmDialog
    :show="showConfirm"
    @cancel="showConfirm = false"
    @confirm="confirmDelete"
    title="Xóa kiểu dáng sản phẩm"
    message="Bạn có chắc muốn xóa kiểu dáng sản phẩm này?"
    :name="deleteItem?.name"
  />
</template>
<style scoped>
@import '../../../assets/css/detail-form.css';

label,
p {
  padding: 0;
  margin: 0;
}
</style>
