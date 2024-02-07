<script setup lang="ts">
import {onMounted, ref, toRefs} from "vue"

interface PropsType {
  cellData: string | null
  width: number
  preLastColumn: boolean
}

const props = defineProps<PropsType>()
const {cellData, width, preLastColumn} = toRefs(props)

const emit = defineEmits<{ (emit: 'updateSelectedValue', value: string): void }>()

const productValues = [
  'Мраморный щебень фр. 2-5 мм, 25кг',
  'Мраморный щебень фр. 2-5 мм, 25кг (белый)',
  'Мраморный щебень фр. 2-5 мм, 25кг (вайт)',
  'Мраморный щебень фр. 2-5 мм, 25кг, возврат',
  'Мраморный щебень фр. 2-5 мм, 1т',
]

const selectListToggle = ref(false)

const inputValue = ref<string>(cellData.value)

const toggleList = () => selectListToggle.value = !selectListToggle.value

const selectItem = (selectedItem: string) => {
  inputValue.value = selectedItem
  emit('updateSelectedValue', inputValue.value)
}

const windowWidth = ref(window.innerWidth)

const updateWindowWidth = () => windowWidth.value = window.innerWidth

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})
</script>

<template>
  <div class="select">
    <div class="select__wrapper">
      <input
          :value="inputValue"
          class="select__input"
          readonly
          @click="toggleList"
      />
      <button
          class="select__btn"
          @click="toggleList">
        <div
            class="select__triangle"
            :class="{
               'select__triangle_active': selectListToggle
        }"
        />
      </button>
    </div>

    <div
        class="select__list"
        v-show="selectListToggle"
        :style="{
           width: width > 500 && windowWidth > 700  ? `${width - 45}px`
                : width < 500 && windowWidth > 700 ? '315px' : `95%`,
           left: !preLastColumn ? null :`-170px`,
        }"
    >
      <div
          class="select__item"
          v-for="product in productValues"
          :key="product"
          @click="selectItem(product)"
      > {{ product }}
      </div>
    </div>

    <div @click="toggleList" class="select__bg" v-if="selectListToggle"/>
  </div>
</template>

<style scoped>
.select {
  padding: 5px 10px;
  position: relative;
}

.select__wrapper {
  display: flex;
}

.select__input {
  width: calc(100% - 21px);
  padding: 10px 15px;
  font-family: 'MyriadPro-Regular', sans-serif;
  font-size: 16px;
  color: #000;
  border-radius: 5px 0 0 5px;
  border: 1px solid #ccc;
  border-right: none;
  background-color: #fff;
  cursor: pointer;
}

.select__btn {
  padding: 15px 8px;
  border-radius: 0 4px 4px 0;
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-left: none;
  background-color: #f6f5f3;
  cursor: pointer;
}

.select__triangle {
  border-top: 3px solid transparent;
  border-left: 3px solid #c0c0c0;
  border-bottom: 3px solid transparent;
  transition: 0.2s all;
}

.select__triangle_active {
  transform: rotate(90deg);
  transition: 0.2s all;
}

.select__list {
  position: absolute;
  z-index: 100;
  border-radius: 5px;
  box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
  background-color: #fff;
  padding: 7px 8px;
  top: 50px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
}

.select__item {
  cursor: pointer;
  transition: 0.5s all;
  font-size: 14px;
  font-family: 'MyriadPro-Regular', sans-serif;
  color: #161616;
  margin-bottom: 10px;
  padding: 4px 2px;
  border-radius: 4px;
}

.select__item:last-of-type {
  margin-bottom: 0;
}

.select__item:hover {
  background-color: rgba(192, 192, 192, 0.5);
}

.select__bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
}
</style>
