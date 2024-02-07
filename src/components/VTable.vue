<script setup lang="ts">
import {computed, onMounted,  ref, toRefs } from "vue"
import TableRow from "./TableRow.vue"
import {ProductItemType, TableHead} from "../shared/types"
import VButton from "./VButton.vue"
import ProductItem from "./ProductItem.vue"

interface PropsType {
  tableData: ProductItemType[],
  tableHeads: TableHead[]
  resizingColumnTitle: string | undefined
}

const props = defineProps<PropsType>()
const {tableData , tableHeads, resizingColumnTitle} = toRefs(props)

const emit = defineEmits<{
  (emit: 'update:tableData', tableData: ProductItemType[]): void
  (emit: 'updateColumnWidth',  title:string, width: number | undefined): void
}>()

const currentTableData = ref(tableData.value)

const saveChanges = () => {
  wasDataChanged.value = false
  emit('update:tableData', currentTableData.value)
  console.log('Тут можно добавить запрос на сервер', currentTableData.value)
}

const tableHeadsVisible = computed<TableHead[]>(() => [...tableHeads.value].filter(head => head.visible))

const columnWidth = computed(() => [...tableHeads.value].filter(head => head.visible).map(head => head.width))
const columnType = computed(() => [...tableHeads.value].filter(head => head.visible).map(head => head.type))
const columnValue = computed(() => [...tableHeads.value].filter(head => head.visible).map(head => head.value))

const wasDataChanged = ref(false)

const updateCurrentValues = (id: number, values: ProductItemType) => {
  currentTableData.value = currentTableData.value.map(data => {
    if (data.id == id) {
      return values
    } else {
      return data
    }
  })
}

const changeRowsOrder = async (id, replaceId) => {
  const draggableItemId = id
  const dragItemIdx = currentTableData.value.findIndex(item => item.id === draggableItemId)
  const dropItemIdx = currentTableData.value.findIndex(item => item.id === replaceId)

  const item = currentTableData.value.find(item => item.id === draggableItemId)

  const tableData = [...currentTableData.value]

  tableData.splice(dragItemIdx, 1)
  tableData.splice(dropItemIdx, 0, item)

  currentTableData.value = tableData
}

const addRow = () => {
  wasDataChanged.value = true

  currentTableData.value = [...currentTableData.value, {
    id: currentTableData.value.length + 1,
    title: '',
    productTitle: null,
    price: null,
    quantity: null,
    discount: null,
    deliveryTime: null,
    total: null,
  }]
}

const shownActionWithRowId = ref(0)

const deleteRow = (id: number) => {
  currentTableData.value  = currentTableData.value.filter(row => row.id !== id)
}

const windowWidth = ref(window.innerWidth)
const updateWindowWidth = () => windowWidth.value = window.innerWidth

onMounted(()=> {
  window.addEventListener('resize', updateWindowWidth)
})
</script>

<template>
  <div>

    <div class="btn">
      <VButton
          title="Добавить строку"
          @btn-click="addRow"/>
    </div>

    <div class="table">
      <div
          class="table__action"
          @click="saveChanges"

      >
        <div v-if="wasDataChanged">Сохранить изменения</div>
        <img v-if="wasDataChanged" src="../assets/images/setting-icon.svg"/>
      </div>

      <table class="table__body" v-if="windowWidth > 700" >
        <TableRow
            :head="true"
            :row-data="tableHeadsVisible"
            :width="columnWidth"
            :resizing-column-title="resizingColumnTitle"
            @change-column-width="(title, width) => $emit('updateColumnWidth', title, width)"
        />
        <TableRow
            v-for="(rowData,idx) in currentTableData"
            :key="rowData.id"
            :row-data="rowData"
            :head="false"
            :type="columnType"
            :width="columnWidth"
            :id="idx + 1"
            :column-value="columnValue"
            v-model:shown-action-with-row-id="shownActionWithRowId"
            @data-was-changed="wasDataChanged = true"
            @update-current-values="(id, rowValues) => updateCurrentValues(id, rowValues)"
            @change-order="(id, replacedId) => changeRowsOrder(id, replacedId)"
            @delete-row-from-table="id => deleteRow(id)"
        />
      </table>

      <div v-else>
        <ProductItem
            v-for="(rowData,idx) in currentTableData"
            :key="rowData.id"
            :row-data="rowData"
            :head="false"
            :type="columnType"
            :width="columnWidth"
            :id="idx + 1"
            :column-value="columnValue"
            :head-data="tableHeads"
            v-model:shown-action-with-row-id="shownActionWithRowId"
            @data-was-changed="wasDataChanged = true"
            @update-current-values="(id, rowValues) => updateCurrentValues(id, rowValues)"
            @change-order="(id, replacedId) => changeRowsOrder(id, replacedId)"
            @delete-row-from-table="id => deleteRow(id)"
        />
      </div>

      <div class="table__total">
        <div class="table__total-wrapper">
          <div class="table__total-data">
            <div class="table__total-row">
              <div>Сумма:</div>
              <div>152 212 руб.</div>
            </div>
            <div class="table__total-row">
              <div>Кол-во:</div>
              <div>24 шт.</div>
            </div>
            <div class="table__total-row">
              <div>Общий вес:</div>
              <div>2 322 кг</div>
            </div>
          </div>

          <div class="table__total-amount">
            <div>Общая сумма:</div>
            <div> 152 212 руб.</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.btn {
  padding: 20px 25px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
  border: solid 1px #eeeff1;
  margin-bottom: 25px;
}

.table {
  border-radius: 10px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
  border: solid 1px #eeeff1;
  background-color: #fff;
  padding: 10px 0px 25px;
}

.table__action {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 400;
  font-family: 'MyriadPro-Regular ', sans-serif;
  color: #a6b7d4;
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
  padding-right: 10px;
  min-height: 15px;
}

.table__body {
  border-top: 1px solid #eeeff1;
  margin-bottom: 20px;
}

.table__total {
  display: flex;
  justify-content: flex-end;
}

.table__total-wrapper {
  min-width: 304px;
}

.table__total-data {
  padding: 15px;
  border-radius: 5px;
  border: solid 1px #eeeff1;
  background-color: #fbfcfd;
  margin-bottom: 5px;
}

.table__total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.table__total-row:last-of-type {
  margin-bottom: 0;
}

.table__total-row div:first-of-type {
  font-size: 14px;
  font-family: 'MyriadPro-Regular ', sans-serif;
  color: #8f8f8f;
  font-weight: 400;
}

.table__total-row div:last-of-type {
  font-size: 14px;
  font-family: 'MyriadPro-Regular ', sans-serif;
  color: #000;
  font-weight: 400;
}

.table__total-amount {
  padding: 15px;
  border-radius: 5px;
  border: solid 1px #eeeff1;
  background-color: #fbfcfd;
  display: flex;
  justify-content: space-between;
}

.table__total-amount div {
  font-size: 14px;
  font-family: 'MyriadPro-SemiBold ', sans-serif;
  color: #000;
  font-weight: 600;
}
</style>
