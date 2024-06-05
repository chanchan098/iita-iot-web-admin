<script setup lang="ts">
import { ConfigGlobal } from '@/components/ConfigGlobal'
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
import { useAppStore } from '@/store/modules/app'

import { useDesign } from '@/hooks/web/useDesign'


const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('app')

const currentSize = computed(() => appStore.getCurrentSize)

appStore.initTheme()

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>


<template>
  <ConfigGlobal :size="currentSize">
    <router-view />
  </ConfigGlobal>
</template>
<style lang="less">

@prefix-cls: ~'@{adminNamespace}-app';

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  .size;

  #app {
    .size;
  }
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>

