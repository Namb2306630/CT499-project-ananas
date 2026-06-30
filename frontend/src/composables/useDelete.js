import { ref } from 'vue'

export function useDelete() {
  const showConfirm = ref(false)
  const deleteItem = ref(null)

  const openDelete = (item) => {
    deleteItem.value = item
    showConfirm.value = true
  }

  const closeDelete = () => {
    showConfirm.value = false
    deleteItem.value = null
  }

  return {
    showConfirm,
    deleteItem,
    openDelete,
    closeDelete,
  }
}
