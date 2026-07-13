<script setup>
import { ref } from 'vue'

const showFilterMenu = ref(false)
const clickedSort = ref(false)

const toggleFilter = () => {
  showFilterMenu.value = !showFilterMenu.value
}

const toggleSort = () => {
  clickedSort.value = !clickedSort.value
}

defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: '',
  },

  showButton: {
    type: Boolean,
    default: true,
  },

  placeHolder: {
    type: String,
    default: '',
  },

  showSearch: {
    type: Boolean,
    default: true,
  },

  showFilter: {
    type: Boolean,
    default: true,
  },

  showSort: {
    type: Boolean,
    default: true,
  },

  filters: {
    type: Array,
    default: () => [],
  },

  showForm: {
    type: Function,
    default: () => {},
  },
})

const emit = defineEmits(['click']) //giửi dữ liệu ra ngoài

const openForm = () => {
  emit('click')
}
</script>

<template>
  <div>
    <div class="header">
      <div class="title">
        <h3>{{ title }}</h3>
        <p class="p-0 m-0 mt-2">{{ description }}</p>
      </div>

      <button v-if="showButton" class="btn" @click="openForm">
        <i class="fa-solid fa-plus"></i>
        <p class="p-0 m-0 contentBtn">{{ buttonText }}</p>
      </button>
    </div>
    <div v-if="showSearch || showFilter || showSort" class="toolbar">
      <div v-if="showSearch" class="inp-div">
        <div class="iconSearch"><i class="fa-solid fa-magnifying-glass"></i></div>
        <input type="text" name="search" class="input-search" :placeholder="placeHolder" />
      </div>
      <div class="btn-sort">
        <div v-if="showFilter" class="filter-box">
          <button class="filter" :class="{ active: showFilterMenu }" @click="toggleFilter">
            <i
              class="fa-solid"
              :class="showFilterMenu ? 'fa-xmark' : 'fa-arrow-down-wide-short'"
            ></i>
            <p class="p-0 m-0">Lọc</p>
          </button>

          <div v-if="showFilterMenu" class="filter-menu">
            <select v-for="(item, index) in filters" :key="index" class="filter-select">
              <option value="" style="font-weight: var(--font-width-lg)">
                {{ item.label }}
              </option>

              <option v-for="option in item.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>

        <button v-if="showSort" class="sort" :class="{ active: clickedSort }" @click="toggleSort">
          <i class="fa-solid" :class="clickedSort ? 'fa-xmark' : 'fa-arrow-down-a-z'"></i>

          <p class="p-0 m-0">Sắp xếp</p>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title h3 {
  font-weight: var(--font-width-lg);
  color: var(--text-black);
  text-transform: capitalize;
  border-left: 4px solid var(--color-bule);
  padding-left: 12px;
  margin: 0;
}

.title p {
  margin-top: 8px;
  font-size: var(--font-size-md);
  color: var(--text-grey);
}

/* button add */
.btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background-color: var(--bg-active);
  color: var(--text-white);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn p {
  font-weight: var(--font-width-lg);
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-blue);
  color: var(--text-white);
}

/* tollbar */
.toolbar {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 12px;
  border: 2px solid var(--border-gray-2);
  border-radius: 12px;
  background-color: var(--bg-color);
  box-shadow: var(--shadow-default);
  gap: 10px;
}

/* search */
.inp-div {
  display: flex;
  align-items: center;
  width: 50%;
  border: 1px solid var(--border-gray-2);
  border-radius: 10px;
  overflow: hidden;
}

.iconSearch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background-color: var(--bg-active);
}

.fa-magnifying-glass {
  color: white;
}

.input-search {
  flex: 1;
  height: 45px;
  border: none;
  outline: none;
  padding: 0 15px;
  font-size: var(--font-size-md);
  background-color: var(--bg-color-while-1);
}

/*  filter+sort */
.btn-sort {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}

.filter,
.sort {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid var(--border-gray-2);
  cursor: pointer;
  transition: 0.3s ease;
  background-color: var(--bg-color-while-1);
}

.filter p,
.sort p {
  font-weight: var(--font-width-md);
}

.fa-arrow-down-a-z,
.fa-arrow-down-wide-short,
.fa-arrow-up-short-wide {
  margin: 0;
  padding: 0;
}

.filter.active {
  background-color: var(--bg-active);
  color: white;
}

.filter:hover:not(.active),
.sort:hover:not(.active) {
  background-color: var(--bg-active);
  color: white;
}

.sort.active,
.filter.active {
  background-color: var(--bg-color-red);
  color: white;
}
/* select filters */
.filter-box {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

/* select */
.filter-select {
  min-width: 160px;
  height: 42px;
  padding: 0 35px 0 14px;
  border: 1px solid var(--border-gray-2);
  border-radius: 8px;
  background-color: var(--bg-color-while-1);
  color: var(--text-black);
  font-size: var(--font-size-md);
  font-weight: var(--font-width-md);
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  /* bỏ mũi tên mặc định */
  /* appearance: none; */
}

.filter-select:hover {
  border-color: var(--bg-focus-black);
  box-shadow: var(--shadow-black);
}

/* option */
.filter-select option {
  padding: 10px;
}

.filter-menu {
  display: flex;
  gap: 10px;
}

.contentBtn {
  text-transform: uppercase;
}
@media (max-width: 767px) {
  .category-container {
    margin: 12px;
  }

  /* header */
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  /* toolbar */
  .toolbar {
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
    gap: 15px;
    overflow: visible;
  }

  /* search */
  .inp-div {
    width: 100%;
    height: 45px;
  }

  /* filter + sort */
  .btn-sort {
    width: 100%;
    display: block;
  }

  /* filter */
  .filter-box {
    width: 100%;
    display: block;
  }

  .filter {
    width: 100%;
    justify-content: center;
    height: 45px;
  }

  /* menu filter */
  .filter-menu {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }

  .filter-select {
    width: 100%;
    height: 45px;
  }

  /* sort */
  .sort {
    width: 100%;
    justify-content: center;
    height: 45px;
    margin-top: 12px;
  }
}
</style>
