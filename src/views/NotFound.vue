<template>
  <div class="not-found">
    <h3 class="not-found__title">Not Found</h3>
    <img class="not-found__image" src="@assets/not_found_grey.png" width="500" />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
}

.not-found__title {
  font-size: 2rem;
  color: $color-white;
}
</style>
