export const PRODUCT_VARIANT_STATUS = {
  active: {
    label: 'Đang bán',
    class: 'success',
  },
  inactive: {
    label: 'Ngừng hoạt động',
    class: 'secondary',
  },
  out_of_stock: {
    label: 'Hết hàng',
    class: 'warning',
  },
  discontinued: {
    label: 'Ngừng kinh doanh',
    class: 'danger',
  },
}

export const PRODUCT_STATUS = {
  active: { label: 'Đang bán', class: 'active' },
  inactive: { label: 'Ẩn', class: 'inactive' },
  discontinued: { label: 'Ngừng kinh doanh', class: 'discontinued' },
}

export const PRODUCT_GENDER = {
  unisex: { label: 'Phi giới tính' },
  male: { label: 'Nam' },
  female: { label: 'Nữ' },
}
