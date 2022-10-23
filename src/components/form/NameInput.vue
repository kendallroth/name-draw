<template>
  <div class="name-input">
    <div class="name-input__input-wrapper">
      <VTextField
        ref="inputRef"
        v-model.trim="nameValue"
        class="name-input__input"
        density="compact"
        :disabled="disabled"
        hide-details
        placeholder="Name"
        single-line
        variant="outlined"
        @blur="nameField.handleBlur"
        @keydown.down="emit('move', 'next')"
        @keydown.enter="emit('move', 'next')"
        @keydown.up="emit('move', 'previous')"
      />
      <SvgIcon v-if="nameErrors.length" class="name-input__input__error" :path="mdiError" />
    </div>
    <VBtn :disabled="disabled || true" :icon="mdiExclude" :rounded="0" size="small" />
    <VBtn
      :disabled="disabled || alone"
      :icon="mdiDelete"
      :rounded="0"
      size="small"
      @click="emit('remove')"
    />
  </div>
</template>

<script setup lang="ts">
import {
  mdiDelete,
  mdiAlertCircle as mdiError,
  mdiAccountMultipleRemove as mdiExclude,
} from "@mdi/js";
import { useField } from "vee-validate";
import { computed, ref } from "vue";

import { SvgIcon } from "@components/icon";

type NameInputProps = {
  disabled?: boolean;
  /** Last field cannot be removed */
  alone?: boolean;
  name: string;
};

const props = withDefaults(defineProps<NameInputProps>(), {
  alone: false,
  disabled: false,
  value: "",
});

const emit = defineEmits<{
  (e: "remove"): void;
  (e: "move", direction: "next" | "previous"): void;
}>();

defineExpose({
  focus: () => inputRef.value?.focus(),
  value: computed(() => nameValue.value),
});

const inputRef = ref<HTMLInputElement | null>(null);

const fieldName = computed(() => `${props.name}.name`);
const {
  errors: nameErrors,
  value: nameValue,
  ...nameField
} = useField(fieldName, undefined, {
  initialValue: "",
});
</script>

<style lang="scss" scoped>
$input-height: 40px;

.name-input {
  display: flex;
  align-items: center;
  width: 100%;
}

.name-input__input-wrapper {
  position: relative;
  display: flex;
  flex-grow: 1;
  z-index: 2; // Layout above following buttons (for outline)
}

.name-input__input__error {
  position: absolute;
  right: spacing(1.5);
  color: $color-error;
  align-self: center;
  z-index: 2;
}

.name-input__input {
  :deep(.v-field__input) {
    background-color: $color-white;

    &:focus {
      outline: 2px solid $color-secondary;
      outline-offset: -1px;
    }
  }

  :deep(.v-field__outline) {
    display: none;
  }
}
</style>
