<script setup lang="ts">
import { reactive, ref, toRefs, watch} from "vue";
import VSelect from "./VSelect.vue";
import VInput from "./VInput.vue";
import {ProductItemType, TableHead} from "../shared/types";

interface PropsType {
  head?: boolean
  rowData: ProductItemType | TableHead[]
  type?: string[]
  width: number[]
  id?: number
  columnValue?: string[]
  shownActionWithRowId?: number
  resizingColumnTitle?: string | undefined
}

const props = defineProps<PropsType>()
const {head, rowData, type, width, id, columnValue, shownActionWithRowId, resizingColumnTitle} = toRefs(props)

const currentRowValues = reactive(rowData.value)

const emit = defineEmits<{
  (emit: 'dataWasChanged'): void,
  (emit: 'updateCurrentValues', id: number, values): void
  (emit: 'changeOrder', id: number, replaceId: number): void
  (emit: 'update:shownActionWithRowId', id: number): void
  (emit: 'deleteRowFromTable', id: number): void
  (emit: 'changeColumnWidth', title: string, width: number | undefined): void
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
  event.target.closest('.row__body').classList.add('drag_active')
}

const drop = (event, id) => {
  const draggableItemId = +event.dataTransfer.getData('draggableItemId')
  const dropItemId = id

  emit('changeOrder', draggableItemId, dropItemId)

  document.querySelectorAll('.row__body').forEach(item => {
    item.classList.remove('drag_active')
    item.classList.remove('drop_active')
  })
}

const dragover = (event) => {
  event.target.closest('.row__body').classList.add('drop_active')
}

const dragleave = (event) => {
  event.target.closest('.row__body').classList.remove('drop_active')
}


const setActionId = () => {
  if (shownActionWithRowId.value > 0) {
    emit('update:shownActionWithRowId', 0)
  } else {
    emit('update:shownActionWithRowId', rowData.value!.id)
  }
}

const deleteRow = () => {
  emit('deleteRowFromTable', rowData.value!.id)
}

const initialMouseX = ref()
const initialColumnWidth = ref()


const startResizing = (event, title, width) => {
  event.preventDefault();
  initialMouseX.value = event.clientX;
  initialColumnWidth.value = width;

  emit('changeColumnWidth', title, undefined);

  document.addEventListener('mousemove', resizeColumn);
  document.addEventListener('mouseup', stopResizing);
};

const resizeColumn = (event) => {
  const widthDelta = event.clientX - initialMouseX.value;
  const newWidth = initialColumnWidth.value + widthDelta;
  if (newWidth >= 0) {
    emit('changeColumnWidth', resizingColumnTitle.value, newWidth);
  }
};

const stopResizing = () => {
  document.removeEventListener('mousemove', resizeColumn);
  document.removeEventListener('mouseup', stopResizing);

  emit('changeColumnWidth', resizingColumnTitle.value, undefined);
};
</script>

<template>
  <thead v-if="head" class="row__head">
  <tr
      style="border-bottom: 1px solid black;"
  >
    <th
        v-for="(cell,idx) in rowData"
        class="row__head-cell"
        :style="{
           width: `${width[idx]}px`
        }"
    >
      <div
          class="row__head-title"
      >
        {{ cell.title }}
      </div>

      <div
          class="row__change-size"

          :style="{
                   borderRight: idx === 2  ? `3px solid #eeeff1`: `2px solid #eeeff1`
      }"

          @mousedown="startResizing($event, cell.title, width[idx])"
      />
    </th>
  </tr>
  </thead>


  <tr
      v-else class="row__body"
      @dragover.prevent="dragover($event)"
      @drop.prevent="drop($event, rowData.id)"
      @dragleave="dragleave($event)"
  >
    <td
        v-for="(cell,idx) in columnValue"
        :style="{
            width: `${width[idx]}px`,
            borderRight: idx === 2 ? `3px solid #eeeff1` : 'none',
          }"
        class="row__body-cell"
    >

      <div
          v-if="idx === 0"
          class="row__move"
          @dragstart="dragStart($event, rowData.id)"
          draggable="true">
        <img src="../assets/images/move-icon.svg"/>
        <div>{{ id }}</div>
      </div>

      <div v-if="idx === 1" class="row__change">
        <div
            class="row__circles"
            @click="setActionId">
          <div class="row__change-circle"/>
          <div class="row__change-circle"/>
          <div class="row__change-circle"/>
        </div>

        <div @click="deleteRow" class="row__change-action" v-if="shownActionWithRowId === rowData.id">
          <div>Удалить</div>
        </div>
      </div>

      <VSelect
          v-if="type[idx] === 'select' && idx > 1"
          :cell-data="rowData[cell]"
          :width="width[idx]"
          @update-selected-value="value => currentRowValues[cell] = value"
          :pre-last-column="idx >= columnValue.length - 2"
      />
      <VInput
          v-if="type[idx] === 'input' && idx > 1"
          :cell-data="rowData[cell]"
          @update-selected-value="value => currentRowValues[cell] = value"
      />
    </td>
  </tr>
</template>

<style scoped>
.row__head {
  font-family: 'MyriadPro-SemiBold', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #000;
  text-align: left;
  position: relative;
}

.row__head::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: #eeeff1;
}

.row__head-cell {
  position: relative;
}

.row__head-title {
  padding: 14px 7px;
}

.row__change-size {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  cursor: col-resize;
  height: 100%;
  z-index: 10;
}

.row__move {
  display: flex;
  gap: 5px;
  justify-content: center;
  padding-top: 16px;
  padding-bottom: 16px;
  cursor: pointer;
}

.row__body-cell {
  justify-content: center;
}

.row__change {
  padding-left: 16px;
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
