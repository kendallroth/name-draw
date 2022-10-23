<template>
  <VApp :theme="appStore.theme">
    <TheAppHeader />
    <VMain>
      <RouterView />
    </VMain>
    <TheAppSnackbar />
  </VApp>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";

import { TheAppHeader, TheAppSnackbar } from "@components/single";
import { useAppStore } from "@stores";

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.v-application {
  background-color: $color-primary;
}

.v-main {
  display: flex;
}
</style>
