<script setup lang="ts">
import {computed, ref, toRefs} from "vue";
import {TableHead} from "../shared/types";

interface PropsType {
  sectionsNames: string[]
  selectedSection: string
  tableHeads: TableHead[]
}

const props = defineProps<PropsType>()
const {sectionsNames, selectedSection, tableHeads} = toRefs(props)

const emit = defineEmits<{
  (emit: 'update:activeSection', section: string): void
  (emit: 'showHeadItem', headTitle: string): void
  (emit: 'changeOrder', headItems: TableHead[]): void
}>()

const selectSection = (section: string) => emit('update:activeSection', section)

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  headMenuType.value = undefined
}
const selectHeadMenuType = (type: string) => {
  if (headMenuType.value === type) {
    headMenuType.value = undefined
  } else {
    headMenuType.value = type
  }
}

const headMenuType = ref<undefined | string>(undefined)

const toggleSelectedHead = (headTitle: string) => {
  emit('showHeadItem', headTitle)
}

const headMenuItems = ['Отображение столбцов', 'Порядок столбцов']

const dragStart = (event, title: string) => {
  event.dataTransfer.setData('draggableItemTitle', title)
  event.target.closest('.sections__head-item').classList.add('drag_active')
}

const drop = (event, dropItemTitle) => {
  const draggableItemTitle = event.dataTransfer.getData('draggableItemTitle')
  const droppableItemTitle = dropItemTitle

  const dragItemIdx = tableHeads.value.findIndex(item => item.title === draggableItemTitle)
  const dropItemIdx = tableHeads.value.findIndex(item => item.title === droppableItemTitle)

  const item = tableHeads.value.find(item => item.title === draggableItemTitle)

  const actualisedHeadsItems = [...tableHeads.value]

  actualisedHeadsItems.splice(dragItemIdx, 1)
  actualisedHeadsItems.splice(dropItemIdx, 0, item)

  emit('changeOrder', actualisedHeadsItems)

  document.querySelectorAll('.sections__head-item').forEach(item => {
    item.classList.remove('drag_active')
    item.classList.remove('drop_active')
  })
}

const dragover = (event) => {
  event.target.closest('.sections__head-item').classList.add('drop_active')
}

const dragleave = (event) => {
  event.target.closest('.sections__head-item').classList.remove('drop_active')
}

const headItemTitles = computed(() => {
  if (headMenuType.value === 'Порядок столбцов') {
    return [...tableHeads.value].filter(tableHead => tableHead.visible).filter(tableHead => tableHead.title)
  } else {
    return [...tableHeads.value].filter(tableHead => tableHead.title)
  }

})
</script>

<template>
  <div class="sections">
    <ul class="sections__list">
      <li
          v-for="section in sectionsNames"
          :key="section"
          @click="selectSection(section)"
          class="sections__item"
          :class="{
            'sections__item_active': section === selectedSection
          }"
      >
        {{ section }}
      </li>
    </ul>

    <div class="sections__settings">
      <img
          class="sections__settings-img"
          src="../assets/images/setting-icon.svg"
          @click="toggleMenu"/>

      <div class="sections__menu" v-if="isMenuOpen">
        <div
            v-for="item in headMenuItems"
            class="sections__menu-item"
            @click="selectHeadMenuType(item)"
            :class="{
              'sections__menu-item_active': headMenuType === item
            }"
        >
          <div> {{ item }}</div>
          <img
              class="sections__settings-arrow"
              :style="{
                transform: headMenuType === item ? 'rotate(90deg)' : null
              }"
              src="../assets/images/arrow-icon.svg"/>
        </div>

        <div class="sections__head-menu" v-if="headMenuType">
          <div
              class="sections__head-item"
              v-for="head in headItemTitles"
              :key="head"
              @dragover.prevent="dragover($event)"
              @drop.prevent="drop($event, head.title)"
              @dragleave="dragleave($event)"
          >
            <input
                type="checkbox"
                v-if="headMenuType === 'Отображение столбцов'"
                :checked="head.visible"
                @change="toggleSelectedHead(head.title)"
            />
            <img
                class="sections__settings"
                v-if="headMenuType === 'Порядок столбцов'"
                src="../assets/images/move-icon.svg"
                @dragstart="dragStart($event, head.title)"
                draggable="true"
            />
            <div> {{ head.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sections {
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
}

.sections__list {
  display: flex;
  gap: 25px;

}

.sections__item {
  color: #1253a2;
  font-family: 'MyriadPro-SemiBold', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s all;
}

.sections__item_active {
  color: #000;
}

.sections__settings-img {
  cursor: pointer;
}

.sections__settings {
  position: relative;
}

.sections__menu {
  position: absolute;
  min-width: 180px;
  left: -165px;
  top: 20px;
  border-radius: 5px;
  box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
  background-color: #fff;
  font-family: 'MyriadPro-Regular', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

.sections__menu-item {
  display: flex;
  justify-content: space-between;
  padding: 7px 10px;
  gap: 9px;
  align-items: center;
  cursor: pointer;
  transition: 0.5s all;
  z-index: 100;
}

.sections__menu-item:hover {
  background-color: #eef3f8;
}


.sections__menu-item_active {
  background-color: #eef3f8;
}

.sections__menu-item img {
  width: 6px;
  height: 9px;
}

.sections__head-menu {
  position: absolute;
  min-width: 180px;
  top: 70px;
  left: -20px;
  border-radius: 5px;
  box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
  background-color: #fff;
  font-family: 'MyriadPro-Regular', sans-serif;
  font-size: 14px;
  font-weight: 400;
  z-index: 120;
}

.sections__head-item {
  display: flex;
  gap: 9px;
  padding: 7px 10px;
  cursor: pointer;
}

.sections__settings-arrow {
  transition: 0.2s all;
}

.drag_active {
  cursor: grab;
  background-color: rgba(128, 128, 128, 0.5);
}

.drop_active {
  background-color: rgba(128, 128, 128, 0.2);
}
</style>
