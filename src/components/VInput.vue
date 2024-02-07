<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue";

interface PropsType {
  cellData: string | number | null
}

const props = defineProps<PropsType>()
const {cellData} = toRefs(props)

const emit = defineEmits<{ (emit: 'updateSelectedValue', value: string | number | null): void }>()

const inputValue = ref<string | number | null>(cellData.value)

const type = computed(() => typeof cellData.value)

watch(() => inputValue.value,
    () =>
        emit('updateSelectedValue', inputValue.value)
)
</script>

<template>
  <div class="input">
    <input
        v-model="inputValue"
        class="input__body"
        :type="type"
    />
  </div>
</template>

<style scoped>
.input {
  padding: 5px 10px;
  position: relative;
}

.input__body {
  width: calc(100% - 30px);
  padding: 10px 15px;
  font-family: 'MyriadPro-Regular', sans-serif;
  font-size: 16px;
  color: #000;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
