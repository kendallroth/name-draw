<template>
  <div class="name-input">
    <div class="name-input__input-wrapper">
      <input
        v-model="nameValue"
        class="name-input__input"
        :disabled="disabled"
        placeholder="Name"
        type="text"
        @blur="nameField.handleBlur"
      />
      <SvgIcon v-if="nameErrors.length" class="name-input__input__error" :path="mdiError" />
    </div>
    <button class="button is-icon" :disabled="disabled || true">
      <SvgIcon :path="mdiExclude" />
    </button>
    <button class="button is-icon" :disabled="disabled || alone" @click="emit('remove')">
      <SvgIcon :path="mdiDelete" />
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  mdiDelete,
  mdiAlertCircle as mdiError,
  mdiAccountMultipleRemove as mdiExclude,
} from "@mdi/js";
import { useField } from "vee-validate";
import { computed } from "vue";

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
}>();

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

.name-input__input {
  flex-grow: 1;
  height: $input-height;
  padding: 0 spacing(1.5);
  border: none;
  outline: none;

  &:focus {
    outline: 2px solid $color-secondary;
    outline-offset: -1px;
    z-index: 2; // Layout above following fields
  }
}

.name-input__input-wrapper {
  display: flex;
  flex-grow: 1;
  position: relative;
}

.name-input__input__error {
  position: absolute;
  right: spacing(1.5);
  color: $color-error;
  align-self: center;
  z-index: 2;
}

.button.is-icon {
  --background-default: #{lighten($color-secondary, 70%)};
  --background-hover: #{lighten($color-secondary, 65%)};
  --background-outline: #{darken($color-secondary, 5%)};
  --color: #{$color-secondary};

  height: $input-height;
  width: $input-height;
  border-radius: 0;

  &:disabled {
    opacity: 1;
    --background-default: #{lighten($color-secondary, 65%)};
  }
}
</style>
