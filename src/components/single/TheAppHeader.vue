<template>
  <VAppBar color="transparent" :elevation="0">
    <VAppBarTitle class="app-header__title">
      <RouterLink class="app-header__logo" to="/">
        <img alt="Logo" src="@assets/logo.png" width="24" />
      </RouterLink>
      Name Draw
    </VAppBarTitle>
  </VAppBar>
</template>

<style lang="scss" scoped>
.app-header__logo {
  display: flex;
  margin-right: spacing(1);
  padding: 4px;
  background-color: $color-white;
  border-radius: 50%;
}

.app-header__title > :deep(div) {
  display: flex;
  align-items: center;
  color: $color-white;
}
</style>
