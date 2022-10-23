<template>
  <VueFinalModal
    v-bind="$attrs"
    classes="dialog__backdrop"
    content-class="dialog__container"
    :model-value="modelValue"
  >
    <div class="dialog__title">
      {{ title }}
    </div>
    <div class="dialog__content">
      <slot name="default" />
    </div>
    <ActionBar class="dialog__actions" right>
      <button v-if="type === 'confirm'" class="button" @click="handleCancel">
        {{ cancelText ?? "Cancel" }}
      </button>
      <button class="button" :disabled="disabled" @click="handleConfirm">
        {{ cancelText ?? "Confirm" }}
      </button>
    </ActionBar>
  </VueFinalModal>
</template>

<script lang="ts" setup>
import { VueFinalModal } from "vue-final-modal";

import { ActionBar } from "@components/layout";

type ConfirmDialogProps = {
  cancelText?: string;
  confirmText?: string;
  /** Whether dialog should close immediately upon confirmation */
  closeOnConfirm?: boolean;
  /** Whether confirmation is disabled/pending */
  disabled?: boolean;
  modelValue: boolean;
  loading?: boolean;
  title: string;
  /**
   * Confirmation dialog type
   *
   * - "confirm" - Confirm/cancel buttons
   * - "alert" - Confirm button
   */
  type?: "confirm" | "alert";
};

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  cancelText: undefined,
  confirmText: undefined,
  closeOnConfirm: true,
  disabled: false,
  loading: false,
  type: "confirm",
});

const emit = defineEmits<{
  (event: "update:modelValue", open: boolean): void;
  (event: "confirm"): void;
  (event: "cancel"): void;
}>();

const handleCancel = () => {
  emit("cancel");
  emit("update:modelValue", false);
};

const handleConfirm = () => {
  emit("confirm");

  // Confirmation dialogs might not always close immediately after confirmation (ie. operation pending, etc)
  if (props.closeOnConfirm) {
    emit("update:modelValue", false);
  }
};
</script>

<style lang="scss" scoped>
:deep(.dialog__backdrop) {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000055;
}

:deep(.dialog__container) {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  width: 100%;
  max-height: 90%;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background-color: #fff;
}

.dialog__title {
  margin-bottom: spacing(2);
  font-size: 1.2rem;
  font-weight: bold;
}

.dialog__actions {
  margin-top: spacing(2);
}
</style>
