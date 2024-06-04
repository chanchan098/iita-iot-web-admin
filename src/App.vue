<template>
  <el-config-provider :locale="appStore.getLocal2" :size="size">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const size = computed(() => appStore.getSize2 as any)

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>

<style lang="scss">
.el-table__body-wrapper .el-table-column--selection>.cell {
  display: block;
}
</style>
