<template>
  <div
    class="name-match"
    :class="{
      'is-giver': type === 'giver-recipient',
    }"
  >
    <div class="name-match__name">{{ names[0].name }}</div>
    <VIcon v-if="names[0].id === names[1].id" class="name-match__icon" color="error">
      {{ mdiWarning }}
    </VIcon>
    <VIcon v-else-if="type === 'giver-recipient'" class="name-match__icon" color="secondary">
      {{ mdiGive }}
    </VIcon>
    <div class="name-match__name">{{ names[1].name }}</div>
  </div>
</template>

<script setup lang="ts">
import { mdiArrowRightCircle as mdiGive, mdiAlert as mdiWarning } from "@mdi/js";

import type { Name } from "@typings/name.types";

type NamePairProps = {
  /**
   * Name match groups can represent several potential grouping types
   *
   * - Giver and recipient (hidden)
   * - Mutual pairing (known)
   */
  names: Name[];
  type: "giver-recipient" | "mutual-pair";
};

withDefaults(defineProps<NamePairProps>(), {});
</script>

<style lang="scss" scoped>
.name-match {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: spacing(1) spacing(2);
  background-color: $color-white;
  transition: margin ease-in-out 0.1s;

  &:hover {
    margin: 0 -#{spacing(0.5)};
    border-bottom: none;
  }

  &:not(:last-child) {
    border-bottom: 1px solid $color-primary;
  }

  &:first-child {
    border-top-left-radius: spacing(1);
    border-top-right-radius: spacing(1);
  }
  &:last-child {
    border-bottom-left-radius: spacing(1);
    border-bottom-right-radius: spacing(1);
  }
}

.name-match.is-giver {
  > :first-child {
    font-size: 1.1rem;
    font-weight: bold;
  }
  > :last-child {
    opacity: 0.8;
  }
}

.name-match__icon {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
