<template>
  <div class="config__panel">
    <h2>{{ name }}, {{ metric }} {{ Math.round(config.value) }}</h2>
    <div class="steps">
      <div
        class="step"
        :class="{
          step_active:
            step.step !== '' &&
            step.value !== '' &&
            (step.step || step.step == 0) &&
            (step.value || step.value == 0),
        }"
        v-for="step in config.steps"
        :key="step.index"
      >
        <div class="step__index">{{ step.index }}</div>
        <div class="step__step">
          <input
            type="number"
            class="config__input"
            v-model.number="step.step"
          />
        </div>
        <div class="step__value">
          <input
            type="number"
            class="config__input"
            v-model.number="step.value"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps(["config", "name", "metric"]);
</script>
<style scoped>
.step {
  @apply flex justify-between gap-2 py-1 border-t;
}
.step_active {
  @apply text-green-700;
}
.step__index {
  @apply w-8;
}
.step__step {
  @apply w-32;
}
.step__value {
  @apply w-32;
}
.config__input {
  @apply w-full outline-1 outline-blue-500 text-right;
  @apply rounded bg-slate-100;
}
</style>
