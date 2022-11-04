<template>
  <div class="name-input">
    <div class="name-input__input-wrapper">
      <VTextField
        ref="inputRef"
        v-model.trim="nameValue"
        class="name-input__input"
        :class="{ 'text-decoration-line-through': selected, 'text-error': selected }"
        density="compact"
        :disabled="disabled"
        hide-details
        placeholder="Name"
        :readonly="editorState === 'exclusions'"
        single-line
        variant="outlined"
        @blur="nameField.handleBlur"
        @keydown.down="emit('move', 'next')"
        @keydown.enter="emit('move', 'next')"
        @keydown.up="emit('move', 'previous')"
      />
      <SvgIcon v-if="nameErrors.length" class="name-input__input__error" :path="mdiError" />
    </div>
    <VBtn
      v-if="!selectable"
      :disabled="disabled"
      icon
      :rounded="0"
      size="small"
      variant="flat"
      @click="emit('manage-exclusions')"
    >
      <VBadge color="error" dot floating :model-value="exclusions">
        <VIcon color="secondary">{{ mdiExclude }}</VIcon>
      </VBadge>
    </VBtn>
    <VCheckbox
      v-else
      color="error"
      hide-details
      :model-value="selected"
      :true-icon="mdiExcluded"
      @update:model-value="emit('select')"
    />
    <VBtn
      :disabled="disabled || alone || editorState === 'exclusions'"
      icon
      :rounded="0"
      size="small"
      variant="flat"
      @dblclick="emit('remove')"
    >
      <VIcon color="error">{{ mdiDelete }}</VIcon>
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import {
  mdiDelete,
  mdiAlertCircle as mdiError,
  mdiAccountMultipleRemove as mdiExclude,
  mdiCheckboxBlankOff as mdiExcluded,
} from "@mdi/js";
import { useField } from "vee-validate";
import { computed, ref } from "vue";

import { SvgIcon } from "@components/icon";

import type { EditorState } from "@typings/editor.types";

type NameInputProps = {
  /** Last field cannot be removed */
  alone?: boolean;
  disabled?: boolean;
  editorState: EditorState;
  exclusions?: boolean;
  /** Whether name is excluded */
  selected?: boolean;
  /** Whether name can be selected for exclusion */
  selectable?: boolean;
  name: string;
};

const props = withDefaults(defineProps<NameInputProps>(), {
  alone: false,
  disabled: false,
  exclusions: false,
  selected: false,
  selectable: false,
  state: "edit",
});

const emit = defineEmits<{
  (e: "remove"): void;
  (e: "select"): void;
  (e: "manage-exclusions"): void;
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

    &:focus:not(:read-only) {
      outline: 2px solid $color-secondary;
      outline-offset: -1px;
    }
  }

  :deep(.v-field__outline) {
    display: none;
  }
}

.name-input .v-checkbox {
  flex-grow: 0;
  background-color: $color-white;

  :deep(.v-selection-control) {
    height: unset;
  }
}
</style>
