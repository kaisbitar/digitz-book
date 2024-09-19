<template>
  <div class="titleWrap">
    <h2>{{ title }}</h2>
    <appViewToggle />
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
})
</script>

<style>
.titleWrap {
  width: 260px;
  display: flex;
  align-items: center;
  margin-bottom: 13px;
}
@media (max-width: 600px) {
  .titleWrap {
    width: 100%;
  }
}
</style>
