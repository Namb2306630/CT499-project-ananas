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
import { ROUTE_NAMES } from '@/constants/routes'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const collectionStore = useCollectionStore()
const route = useRoute()
const router = useRouter()
const { error, loading } = storeToRefs(collectionStore)
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

onMounted(async () => {
  try {
    const slug = route.params.slug
    if (collectionStore.collection?.slug == slug) {
      Object.assign(collection.value, collectionStore.collection)
    }
    const data = await collectionStore.getBySlug(slug)

    Object.assign(collection.value, data)
  } catch (error) {
    toastStore.showToast(error.general, 'error')
    router.replace({ name: ROUTE_NAMES.COLLECTIONS })
  }
})

watch(
  () => collection.value.name,
  (newName) => {
    if (newName != null && newName !== '') {
      collection.value.slug = createSlug(newName)
    }
  },
)

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

const cancelEdit = () => {
  toastStore.showToast('Đã hủy thay đổi', 'warning')

  setTimeout(() => {
    router.back()
  }, 300)
}

const cancelDelete = () => {
  closeDelete()
  toastStore.showToast('Đã hủy thay đổi', 'warning')
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
            <div class="form-group">
              <label for="name" class="mt-0">Tên bộ sưu tập</label>
              <input type="text" name="" id="name" v-model="collection.name" />
              <p v-if="errors.name" class="error">{{ errors.name }}</p>
            </div>

            <!-- slug -->
            <div class="form-group">
              <label for="slug">Đường dẫn thân thiện (Slug)</label>
              <input type="text" name="" id="slug" readonly v-model="collection.slug" />
              <p v-if="errors.slug" class="error">{{ errors.slug }}</p>
            </div>

            <!-- mô tả -->
            <div class="form-group">
              <label for="description">Mô tả thêm</label>
              <textarea
                id="description"
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
        @cancel="cancelEdit"
        @save="saveCollection"
      />
    </div>
  </div>
  <ConfirmDialog
    title="Xóa bộ sưu tập sản phẩm"
    message="Bạn có chắc muốn xóa bộ sưu tập sản phẩm này?"
    :show="showConfirm"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    :name="deleteItem?.name"
  />
</template>
<style scoped>
@import '../../../assets/css/detail-form.css';
</style>
