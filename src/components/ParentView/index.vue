<template>
  <router-view v-slot="{ Component, route }" id="inner-router-view2">
    <div id="inner-router-view"></div>
    
    <component :is="Component" :key="route.path" />

  </router-view>
</template>

<script setup name="ParentView" lang="ts">

</script>