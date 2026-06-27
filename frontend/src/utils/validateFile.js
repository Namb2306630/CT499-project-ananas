export const validateImage = (file) => {
  const maxSize = 2 * 1024 * 1024 // 2MB

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return 'Chỉ hỗ trợ file JPG, PNG hoặc WEBP'
  }

  if (file.size > maxSize) {
    return 'Kích thước ảnh không được vượt quá 2MB'
  }
  return null
}
