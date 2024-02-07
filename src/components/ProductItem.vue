<script setup lang="ts">
import {ProductItemType, TableHead} from "../shared/types.js";
import {reactive, toRefs, watch} from "vue";
import VInput from "./VInput.vue";
import VSelect from "./VSelect.vue";

interface PropsType {
  head?: boolean
  rowData: ProductItemType
  headData: TableHead[]
  type?: string[]
  width: number[]
  id?: number
  columnValue?: string[]
  shownActionId?: number
}

const props = defineProps<PropsType>()
const { rowData, type, width, id, columnValue, shownActionId, headData} = toRefs(props)

const currentRowValues = reactive(rowData.value)

const emit = defineEmits<{
  (emit: 'dataWasChanged'): void,
  (emit: 'updateCurrentValues', id: number, values): void
  (emit: 'changeOrder', id: number, replaceId: number): void
  (emit: 'update:shownActionId', id: number): void
  (emit: 'deleteRowFromTable', id: number): void
}>()

watch(() => currentRowValues,
    () => {
      emit('dataWasChanged')
      emit('updateCurrentValues', rowData.value?.id, currentRowValues)
    },
    {deep: true}
)

const dragStart = (event, id) => {
  event.dataTransfer.setData('draggableItemId', id)
  event.target.closest('.row').classList.add('drag_active')
}

const drop = (event, id) => {
  const draggableItemId = +event.dataTransfer.getData('draggableItemId')
  const dropItemId = id

  emit('changeOrder', draggableItemId, dropItemId)

  document.querySelectorAll('.row').forEach(item => {
    item.classList.remove('drag_active')
    item.classList.remove('drop_active')
  })
}

const dragover = (event) => {
  event.target.closest('.row').classList.add('drop_active')
}

const dragleave = (event) => {
  event.target.closest('.row').classList.remove('drop_active')
}


const setActionId = () => {
  if (shownActionId.value > 0) {
    emit('update:shownActionId', 0)
  } else {
    emit('update:shownActionId', rowData.value!.id)
  }
}

const deleteRow = () => {
  emit('deleteRowFromTable', rowData.value!.id)
}
</script>

<template>
  <div
      class="row"
      @dragover.prevent="dragover($event)"
      @drop.prevent="drop($event, rowData.id)"
      @dragleave="dragleave($event)"
  >
    <div class="row__data">
      <div class="row__title">Номер строки</div>
      <div
          class="row__move"
          @dragstart="dragStart($event, rowData.id)"
          draggable="true"
         >
        <img src="../assets/images/move-icon.svg"/>
        <div>{{ id }}</div>
      </div>
    </div>

    <div class="row__data">
      <div class="row__title">Действие</div>
      <div class="row__change">
        <div
            class="row__circles"
            @click="setActionId">
          <div class="row__change-circle"/>
          <div class="row__change-circle"/>
          <div class="row__change-circle"/>
        </div>

        <div @click="deleteRow" class="row__change-action" v-if="shownActionId === rowData.id">
          <div>Удалить</div>
        </div>
      </div>
    </div>

    <div v-for="(cell,idx) in columnValue" class="row__data">
      <div v-if="type[idx] === 'select' && idx > 1">
        <div class="row__title">{{ headData[idx].title}}</div>

        <VSelect
            style="padding: 0"
            :cell-data="rowData[cell]"
            :width="width[idx]"
            @update-selected-value="value => currentRowValues[cell] = value"
            :pre-last-column="false"
        />
      </div>

      <div  v-if="type[idx] === 'input' && idx > 1">
        <div class="row__title">{{ headData[idx].title}}</div>

        <VInput
            style="padding: 0"
            :cell-data="rowData[cell]"
            @update-selected-value="value => currentRowValues[cell] = value"
        />
      </div>
    </div>

  </div>
</template>

<style scoped>
.row {
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
  border: solid 1px #eeeff1;
  background-color: #fff;
  margin-bottom: 5px;
}

.row__data {
  margin-bottom: 15px;
}

.row__title {
  font-family: 'MyriadPro-Regular', sans-serif;
  font-size: 10px;
  color: #8f8f8f;
  margin-bottom: 5px;
}

.row__move {
  display: flex;
  gap: 5px;
  justify-content: left;
  cursor: pointer;
  margin-bottom: 18px;
}

.row__change {
  color: #000;
  font-family: 'MyriadPro-Regular', sans-serif;
  font-size: 16px;
  cursor: pointer;
  position: relative;
}

.row__circles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.row__change-action {
  position: absolute;
  z-index: 100;
  padding: 7px 10px;
  border-radius: 5px;
  box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
  background-color: #fff;
  font-family: 'MyriadPro-Regular', sans-serif;
  cursor: pointer;
  top: 20px;
  min-width: 179px;
  color: #ae0a0a;
}

.row__change-circle {
  width: 3px;
  height: 3px;
  border-radius: 5px;
  background-color: #a6b7d4;
}

.drag_active {
  background-color: rgba(128, 128, 128, 0.5);
}

.drop_active {
  background-color: rgba(128, 128, 128, 0.2);
}
</style>
