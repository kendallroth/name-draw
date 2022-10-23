<template>
  <div class="form">
    <ConfirmDialog
      v-model="resetDialog.open.value"
      confirm-color="error"
      title="Reset Form?"
      @confirm="resetEntries"
    >
      Are you sure you want to reset the name draw entries?
    </ConfirmDialog>
    <div class="form__names elevation-2">
      <NameInput
        v-for="(field, idx) in nameEntryFields"
        :key="field.value.id ?? field.key"
        ref="nameInputRefs"
        :alone="nameEntryFields.length <= 1"
        :name="`names[${idx}]`"
        @move="(direction) => handleMove(direction, idx)"
        @remove="nameEntryHelpers.remove(idx)"
      />
    </div>
    <ActionBar class="form__actions">
      <template #left>
        <VBtn color="secondary" :prepend-icon="mdiAdd" @click="addEntry">Add</VBtn>
      </template>
      <template #right>
        <VBtn color="warning" variant="text" @click="resetDialog.show()">Reset</VBtn>
        <VBtn color="secondary" :prepend-icon="mdiGenerate" @click="drawNames">Draw Names!</VBtn>
      </template>
    </ActionBar>
  </div>
</template>

<script setup lang="ts">
import { mdiPlus as mdiAdd, mdiVote as mdiGenerate } from "@mdi/js";
import { v4 as uuidv4 } from "uuid";
import { useFieldArray, useForm } from "vee-validate";
import { nextTick, ref } from "vue";
import * as yup from "yup";

import { ConfirmDialog } from "@components/dialog";
import { NameInput } from "@components/form";
import { ActionBar } from "@components/layout";
import { useDialog } from "@composables";

type NameEntry = {
  id: string;
  name: string;
  exclusions: string[];
};

const resetDialog = useDialog();

const createNameEntry = (base: Partial<NameEntry> = {}): NameEntry => ({
  exclusions: [],
  name: "",
  ...base,
  id: uuidv4(),
});

interface NameForm {
  names: NameEntry[];
}

const namesSchema = yup.object({
  names: yup.array(
    yup.object({
      name: yup.string().required(),
      exclusions: yup.array(yup.string()).required(),
    }),
  ),
});

const { handleReset, handleSubmit } = useForm<NameForm>({
  initialValues: {
    names: [createNameEntry()],
  },
  validationSchema: namesSchema,
});

const { fields: nameEntryFields, ...nameEntryHelpers } = useFieldArray<NameEntry>("names");

const addEntry = () => {
  // TODO: Only create if there are no empty rows previous
  nameEntryHelpers.push(createNameEntry());
};

const resetEntries = () => {
  handleReset();
};

const drawNames = handleSubmit(async (data) => {
  console.log("Submitted", data);
  alert(`Names: ${data.names.map((n) => n.name).join(", ")}`);
});

const nameInputRefs = ref<typeof NameInput[]>([]);

/** Allow moving between previous/next fields with up/down arrow keys */
const handleMove = (direction: "next" | "previous", idx: number) => {
  const nameCount = nameEntryFields.value.length;
  let targetIdx = idx;
  if (direction === "next") {
    targetIdx++;
  } else if (direction === "previous") {
    targetIdx--;
  }

  if (targetIdx < 0) return;
  if (targetIdx >= nameCount) {
    // Only allow automatically creating the "next" item if current field is valid
    if (!nameInputRefs.value[idx]?.value) return;

    addEntry();
  }

  nextTick(() => {
    nameInputRefs.value[targetIdx].focus();
  });
};
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: spacing(4) auto;
}

.form__names,
.form__name {
  width: 100%;
}

.form__actions {
  margin-top: spacing(3);
}
</style>

<style lang="scss">
.form__names {
  border-radius: spacing(1);

  .name-input {
    &:first-child {
      input[type="text"] {
        border-top-left-radius: spacing(1);
      }
      button:last-of-type {
        border-top-right-radius: spacing(1) !important;
      }
    }
    &:last-child {
      input[type="text"] {
        border-bottom-left-radius: spacing(1);
      }
      button:last-of-type {
        border-bottom-right-radius: spacing(1) !important;
      }
    }
    &:not(:last-child) {
      border-bottom: 1px solid $color-primary;
    }
  }
}
</style>
