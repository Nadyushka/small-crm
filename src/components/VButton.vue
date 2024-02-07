<script setup lang="ts">
import {toRefs} from "vue";

interface PropsType {
  title: string
}

const props = defineProps<PropsType>()
const {title} = toRefs(props)

const emit = defineEmits<{ (emit: 'btnClick'): void }>()
</script>

<template>
  <div>
    <button
        class="button"
        @click="$emit('btnClick')"
    >
      <div class="icon">
        <div class="icon__line"/>
        <div class="icon__line"/>
      </div>

      {{ title }}

    </button>
  </div>
</template>

<style scoped>
.button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #2f8cff;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  font-family: 'MyriadPro-Regular ', sans-serif;
  font-weight: 400;
  display: flex;
  gap: 7px;
  transition: 0.2s all;
}

.button:active {
  background-color: rgba(47, 140, 255, 0.8);
}

.icon {
  position: relative;
  width: 11px;
}

.icon__line {
  width: 11px;
  height: 1px;
  background-color: #1253a2;
  position: absolute;
}

.icon__line:nth-of-type(1) {
  top: 8px;
}

.icon__line:nth-of-type(2) {
  width: 1px;
  height: 11px;
  left: 5px;
  top: 3px;
}

</style>
