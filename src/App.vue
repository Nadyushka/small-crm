<script setup lang="ts">
import PageSections from "./components/PageSections.vue"
import {onMounted, reactive, ref} from "vue"
import VTable from "./components/VTable.vue"
import {TableHead} from "./shared/types"

const sectionsNames = ['Общее', 'Товары', 'Доп.расходы']
const selectedSection = ref<string>('Товары')

const tableData = reactive([
  {
    id: 1,
    title: 'Мраморный щебень фр. 2-5 мм, 25кг',
    productTitle: 'Мраморный щебень фр. 2-5 мм, 25кг',
    price: 1231,
    quantity: 12,
    discount: 0,
    deliveryTime: 5,
    total: 1231,
  },
  {
    id: 2,
    title: 'Мраморный щебень фр. 2-5 мм, 25кг',
    productTitle: 'Мраморный щебень фр. 2-5 мм, 25кг',
    price: 1231,
    quantity: 12,
    discount: 0,
    deliveryTime: 5,
    total: 1231,
  },
  {
    id: 3,
    title: 'Мраморный щебень фр. 2-5 мм, 25кг',
    productTitle: null,
    price: 1231,
    quantity: 1,
    discount: 0,
    deliveryTime: 5,
    total: 1231,
  }, {
    id: 4,
    title: 'Мраморный щебень фр. 2-5 мм, 25кг',
    productTitle: 'Мраморный щебень фр. 2-5 мм, 25кг',
    price: 1231,
    quantity: 12,
    discount: 0,
    deliveryTime: 5,
    total: 1231,
  }])

const tableHeadsSettings = ref([
  {title: '', visible: true, type: '', width: 44, value: ''},
  {title: '', visible: true, type: '', width: 22, value: ''},
  {title: 'Наименование единицы', visible: true, type: 'select', width: 623, value: 'title'},
  {title: 'Цена', visible: true, type: 'input', width: 220, value: 'price'},
  {title: 'Скидка', visible: false, type: 'input', width: 210, value: 'discount'},
  {title: 'Срок доставки, дней', visible: false, type: 'input', width: 210, value: 'deliveryTime'},
  {title: 'Кол-во', visible: true, type: 'input', width: 220, value: 'quantity'},
  {title: 'Название товара', visible: true, type: 'select', width: 171, value: 'productTitle'},
  {title: 'Итого', visible: true, type: 'input', width: 146, value: 'total'}] as TableHead[])

onMounted(() => console.log('Запрос на сервер за данными'))

const toggleHeadsItems = (headTitle: string) => {
  tableHeadsSettings.value = tableHeadsSettings.value.map(item => {
    if (item.title === headTitle) {
      return {
        ...item,
        visible: !item.visible
      }
    } else {
      return item
    }
  })
}

const setColumnWidth = (title: string, width: number | undefined) => {

  if (width) {
    tableHeadsSettings.value = tableHeadsSettings.value.map(head => {
      if (head.title === title) {
        return {
          ...head,
          width: width
        }
      } else {
        return head
      }
    })
  } else {
    resizingColumnTitle.value = title
  }

}

const resizingColumnTitle = ref()
</script>

<template>
  <div class="main">
    <h1 class="main__title">Проведение ТО и мелкий ремонт</h1>

    <PageSections
        v-model:active-section="selectedSection"
        :sections-names="sectionsNames"
        :selected-section="selectedSection"
        :table-heads="tableHeadsSettings"
        @show-head-item="headTitle => toggleHeadsItems(headTitle)"
        @change-order="headItems =>  tableHeadsSettings = headItems"
    />

    <VTable
        v-model:table-data="tableData"
        :resizing-column-title="resizingColumnTitle"
        :table-heads="tableHeadsSettings"
        @update-column-width="(title, width) => setColumnWidth(title, width)"
    />
  </div>
</template>

<style scoped>
.main {
  padding: 25px;
  background-color: #fbfcfd;
  max-width: 1450px;
  margin: 0 auto;
}

@media (max-width: 750px) {
  .main {
    padding: 5px;
  }
}

.main__title {
  font-size: 30px;
  font-family: 'MyriadPro-Regular ', sans-serif;
  font-weight: 400;
  color: #000;
  margin-bottom: 25px;
}

</style>
