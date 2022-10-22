<template>
  <SvgIcon :path="path" :size="size" type="mdi" />
</template>

<script lang="ts" setup>
// @ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";

type SvgIconProps = {
  path: string;
  size?: number;
};

withDefaults(defineProps<SvgIconProps>(), {
  size: 24,
});
</script>
