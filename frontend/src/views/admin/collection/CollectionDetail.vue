<script setup>
import HeaderDetail from '@/components/admin/detail/HeaderDetail.vue'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue'
import DetailStats from '@/components/admin/detail/DetailStats.vue'
import DetailStatus from '@/components/admin/detail/DetailStatus.vue'
import DetailActions from '@/components/admin/detail/DetailActions.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { createSlug } from '@/utils/slug'
import { useCollectionStore } from '@/stores/collection'
import { useDelete } from '@/composables/useDelete'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { storeToRefs } from 'pinia'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const collectionStore = useCollectionStore()
const route = useRoute()
const router = useRouter()
const { error } = storeToRefs(collectionStore)
const loading = ref(true)
const errors = computed(() => error.value.errors)

const collection = ref({
  _id: '',
  name: '',
  slug: '',
  description: '',
  createdAt: '',
  productCount: 0,
  isActive: true,
})

watch(
  () => collection.value.name,
  (newName) => {
    if (newName != null && newName !== '') {
      collection.value.slug = createSlug(newName)
    }
  },
)

onMounted(async () => {
  const slug = route.params.slug
  if (collectionStore.collection?.slug == slug) {
    Object.assign(collection.value, collectionStore.collection)
  }

  const data = await collectionStore.getBySlug(slug)

  if (data?.code === 200) {
    Object.assign(collection.value, data)
  }
  loading.value = false
})

const confirmDelete = async () => {
  if (!deleteItem.value) return

  const res = await collectionStore.delete(deleteItem.value._id)

  if (res?.code === 200) {
    toastStore.showToast(res.message, 'success')
    closeDelete()
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(collectionStore.error.errors)[0] ||
      collectionStore.error.general ||
      'Xóa bộ sưu tập sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
    closeDelete()
  }
}
const saveCollection = async () => {
  const res = await collectionStore.update(collection.value._id, collection.value)

  if (res?.code === 200) {
    collectionStore.clearError()
    toastStore.showToast(res.message, 'success')
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(collectionStore.error.errors)[0] ||
      collectionStore.error.general ||
      'Cập nhật bộ sưu tập sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
}
</script>

<template>
  <div v-if="!loading" class="container-detail">
    <HeaderDetail
      title-go-back="Chi tiết bộ sưu tập sản phẩm"
      title-delete="Xóa bộ sưu tập sản phẩm"
      @delete="openDelete(collection)"
    />
    <div class="detail-grid">
      <DetailLayout title="Thông tin cơ bản của bộ sưu tập">
        <div class="top-info">
          <div class="form">
            <!-- name -->
            <label for="">Tên bộ sưu tập</label>
            <input type="text" name="" id="" v-model="collection.name" />
            <p v-if="errors.name" class="error">{{ errors.name }}</p>

            <!-- slug -->
            <label for="">Đường dẫn thân thiện (Slug)</label>
            <input type="text" name="" id="" readonly v-model="collection.slug" />
            <p v-if="errors.slug" class="error">{{ errors.slug }}</p>

            <!-- mô tả -->
            <label for="">Mô tả thêm</label>
            <textarea
              id=""
              v-model="collection.description"
              rows="5"
              class="description"
              placeholder="Thêm mô tả cho bộ sưu tập..."
            ></textarea>
            <p v-if="errors.description" class="error">
              {{ errors.description }}
            </p>
          </div>
        </div>
      </DetailLayout>
      <div class="row info-card-2">
        <DetailStats
          count-label="Sản phẩm hiện có"
          :created-at="collection.createdAt"
          :count="collection.productCount"
        />
        <DetailStatus
          v-model="collection.isActive"
          description="Khách hàng có thể thấy các sản phẩm từ bộ sưu tập này"
        />
      </div>
      <DetailActions
        cancel-text="Hủy bỏ"
        save-text="Lưu thay đổi"
        @cancel="router.back()"
        @save="saveCollection"
      />
    </div>
  </div>
  <ConfirmDialog
    title="Xóa bộ sưu tập sản phẩm"
    message="Bạn có chắc muốn xóa bộ sưu tập sản phẩm này?"
    :show="showConfirm"
    @confirm="confirmDelete"
    @cancel="showConfirm = false"
    :name="deleteItem?.name"
  />
</template>
<style scoped>
@import '../../../assets/css/detail-form.css';
</style>
