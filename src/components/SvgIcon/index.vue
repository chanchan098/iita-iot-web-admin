<template>
  <svg v-if="dataMode===DataModeEnum.LOCAL"
    :class="svgClass"
    aria-hidden="true"
    :style="{
      color: props.color,
    }"
    :width="width" :height="height"
  >
    <use :xlink:href="iconName" :fill="color" />
  </svg>
  <svg v-else
    :class="svgClass"
    aria-hidden="true"
    :style="{
      color: props.color,
    }"
     :viewBox="viewBox" :version="version" :xmlns="xmlns" :width="width" :height="height"
     v-html="path"
  >
  </svg>
</template>

<script setup lang="ts">
import { DataModeEnum } from '@/enums/DataModeEnum'
import { PropType } from 'vue';
const props = defineProps({
  iconClass: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '1em'
  },
  height: {
    type: String,
    default: '1em'
  },
  viewBox:{
    type: String,
    default: '0 0 100 100'
  },
  xmlns:{
    type: String,
    default: ''
  },
  version:{
    type: String,
    default: ''
  },
  pathData: {
    type: String,
    default: ''
  },
  dataMode: {
      type: String as PropType<DataModeEnum>,
      default: DataModeEnum.LOCAL,
      validator: (value: string): boolean => {
        return Object.values(DataModeEnum).includes(value as DataModeEnum);
      }
    }
})
const iconName =  computed(() => `#icon-${props.iconClass}`)
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`
  }
  return 'svg-icon'
})
const path = computed(() => {
    return props.pathData.replace(/\\\\/g, "\\");
})
</script>

<style scope lang="scss">
.sub-el-icon,
.nav-icon {
  display: inline-block;
  font-size: 15px;
  margin-right: 12px;
  position: relative;
}

.svg-icon {
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
