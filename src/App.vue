<template>
  <header class="app-header">
    <RouterLink class="app-header__logo" to="/">
      <img alt="Logo" src="@assets/logo.png" width="24" />
    </RouterLink>
    <h3 class="app-header__title">Name Draw</h3>
  </header>
  <main class="app-main">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: spacing(2);
  color: $color-white;
}

.app-header__logo {
  display: flex;
  margin-right: spacing(1);
  padding: 4px;
  background-color: $color-white;
  border-radius: 50%;
}

.app-header__title {
  font-size: 1.5rem;
}

.app-main {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
