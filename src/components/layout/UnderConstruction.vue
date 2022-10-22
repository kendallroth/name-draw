<template>
  <div class="under-construction">
    <h3 class="under-construction__title">Under Construction</h3>
    <img class="under-construction__image" src="@assets/under_construction_grey.png" width="500" />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.under-construction {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.under-construction__title {
  font-size: 2rem;
  color: $color-white;
}
</style>
