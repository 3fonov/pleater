<script setup lang="ts">
import BladeConfig from "./BladeConfig.vue";
import { ref, onMounted } from "vue";
import paper from "paper";
import { Machine } from "../modules/machine";
import { useMachineStore } from "../stores/machine.store";
const machineStore = useMachineStore();
const machine = ref(new Machine(machineStore.config, intersectHandler));
const intersects = ref(false);
const scope = ref<paper.PaperScope>();
const props = defineProps(["canvasId"]);
function intersectHandler() {
  intersects.value = true;
}
function toggleMachine() {
  machine.value.isRunning = !machine.value.isRunning;
  if (!machine.value.isRunning) {
    refresh();
  }
}
function updateMachine() {
  if (scope.value) {
    machine.value.update(scope.value);
  }
}
function refresh() {
  if (scope.value) {
    intersects.value = false;
    scope.value.project.clear();
    machine.value = new Machine(machineStore.config, intersectHandler);
    machine.value.draw(scope.value);
  }
}

onMounted(() => {
  let paperScript = document.createElement("script");
  paperScript.setAttribute(
    "src",
    "https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.17/paper-full.min.js"
  );
  document.head.appendChild(paperScript);
  scope.value = new paper.PaperScope();
  scope.value.setup(props.canvasId);
  machine.value.draw(scope.value);
});
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="header__title">
        <h1>Pleater</h1>
      </div>
      <div class="controls">
        <div class="header__controls">
          <div class="header__control">
            <div class="control__label">Толщина:</div>
            <div>
              <input
                type="number"
                class="control__input"
                v-model="machineStore.config.thickness"
                @change="refresh"
              />
            </div>
          </div>
          <div class="header__control">
            <div class="control__label">Глубина:</div>
            <div>
              <input
                type="number"
                class="control__input"
                v-model="machineStore.config.depth"
                @change="refresh"
              />
            </div>
          </div>
        </div>
        <div class="header__buttons">
          <div class="button" @click="toggleMachine">
            <span :class="{ 'text-green-700 font-bold': machine.isRunning }"
              >вкл</span
            >/<span :class="{ 'text-red-700 font-bold': !machine.isRunning }"
              >выкл</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="config">
        <BladeConfig :blade="machine.topBlade" name="Верх"></BladeConfig>
        <BladeConfig :blade="machine.bottomBlade" name="Низ"></BladeConfig>
      </div>
      <div class="canvas__wrapper">
        <div class="canvas__bar">
          <div class="current_step">#{{ machine.currentStep }}</div>
          <div class="intersects__alert" v-if="intersects">&times;</div>
        </div>
        <div class="step-slider">
          <input
            type="range"
            class="step-slider__input"
            min="0"
            max="10000"
            step="100"
            v-model.number="machine.currentStep"
            @input="updateMachine"
            @change="updateMachine"
          />
        </div>
        <canvas :id="canvasId" class="canvas__element"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  @apply px-8 mx-auto my-16;
}
.controls {
  @apply flex justify-between flex-row gap-8 mb-8;
}
.header__controls {
  @apply flex flex-row gap-4;
}
.header__control {
  @apply text-right;
}
.control__input {
  @apply w-full outline-1 outline-blue-500 text-right;
  @apply rounded bg-slate-100;
}
.row {
  @apply flex gap-24;
}
.config {
  @apply grid grid-cols-2 grid-flow-row grow gap-16;
}
.button {
  @apply cursor-pointer rounded bg-slate-100 py-2 px-4;
}
.canvas__bar {
  @apply flex flex-row justify-between mb-2;
}
.current_step {
  @apply grow-0 w-1/3;
}
.intersects__alert {
  @apply rounded-full bg-red-500 text-white w-6 text-center h-6 grow-0;
}
.canvas__element {
  @apply w-full block h-full;
  @apply bg-blue-700;
}
.step-slider {
  @apply grow w-full;
}
.step-slider__input {
  @apply w-full;
}
</style>
../modules/Pleater
