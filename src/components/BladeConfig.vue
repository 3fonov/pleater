<template>
  <Config
    :config="blade.positionConfig"
    :name="name"
    metric="смещение"
  ></Config>
  <Config :config="blade.rotationConfig" :name="name" metric="поворот"></Config>
</template>
<script setup lang="ts">
defineProps(["blade", "name"]);
import Config from "./Config.vue";
</script>
<style scoped></style>
