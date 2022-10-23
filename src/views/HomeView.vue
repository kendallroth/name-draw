<template>
  <div class="form">
    <ConfirmDialog
      v-model="resetDialog.open.value"
      confirm-color="error"
      title="Reset Form?"
      @confirm="handleReset"
    >
      Are you sure you want to reset the name draw entries?
    </ConfirmDialog>
    <div v-show="editingNames" class="form__names elevation-2 mb-6">
      <NameInput
        v-for="(field, idx) in nameEntryFields"
        :key="field.value.id ?? field.key"
        ref="nameInputRefs"
        :alone="nameEntryFields.length <= 1"
        :disabled="!editingNames"
        :name="`names[${idx}]`"
        @move="(direction) => handleMove(direction, idx)"
        @remove="nameEntryHelpers.remove(idx)"
      />
    </div>
    <ActionBar class="form__actions">
      <template #left>
        <VBtn
          v-if="editingNames"
          color="secondary"
          :disabled="drawingNames"
          :prepend-icon="mdiAdd"
          @click="addEntry"
        >
          Add
        </VBtn>
        <VBtn v-else color="secondary" :prepend-icon="mdiEdit" @click="editingNames = true">
          Edit
        </VBtn>
      </template>
      <template #right>
        <VBtn
          color="warning"
          :disabled="drawingNames"
          :variant="editingNames ? 'text' : undefined"
          @click="resetDialog.show()"
        >
          Reset
        </VBtn>
        <VBtn
          v-if="editingNames"
          color="secondary"
          :loading="drawingNames"
          :prepend-icon="mdiGenerate"
          @click="handleDrawNames"
        >
          Draw Names!
        </VBtn>
      </template>
    </ActionBar>
    <div v-if="!editingNames && drawnNames.length" class="form matches">
      <div v-for="match in drawnNames" :key="match.giver.id" class="match-item">
        <div class="match-item__name is-giver">{{ match.giver.name }}</div>
        <div class="match-item__name is-recipient">{{ match.recipient.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiPlus as mdiAdd, mdiPencil as mdiEdit, mdiVote as mdiGenerate } from "@mdi/js";
import { v4 as uuidv4 } from "uuid";
import { useFieldArray, useForm } from "vee-validate";
import { nextTick, ref } from "vue";
import * as yup from "yup";

import { ConfirmDialog } from "@components/dialog";
import { NameInput } from "@components/form";
import { ActionBar } from "@components/layout";
import { useDialog } from "@composables";
import { getNextItem, shuffle, sleep } from "@utilities";

interface Name {
  id: string;
  name: string;
}

interface NameEntry extends Name {
  exclusions: string[];
}

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

const { handleReset: resetForm, handleSubmit: submitForm } = useForm<NameForm>({
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

const handleReset = () => {
  resetForm();

  drawnNames.value = [];
  editingNames.value = true;
};

interface GiverRecipient {
  giver: NameEntry;
  recipient: NameEntry;
}

const drawingNames = ref(false);
const editingNames = ref(true);
const drawnNames = ref<GiverRecipient[]>([]);
const handleDrawNames = submitForm(async (data) => {
  drawingNames.value = true;

  await sleep(500);

  // Shuffle names to allow easily finding unique matches by matching with next available name
  //   in the shuffled array (respecting exclusions, etc).
  const shuffledNames = shuffle(data.names, 10);

  const nameMap = shuffledNames.reduce(
    (accum: Record<string, NameEntry>, name) => ({ ...accum, [name.id]: name }),
    {},
  );

  const matchIds: Record<string, string> = {};
  for (let idx = 0; idx < shuffledNames.length; idx++) {
    const currentEntry = shuffledNames[idx];
    const nextEntry = getNextItem(idx, shuffledNames);
    matchIds[currentEntry.id] = nextEntry.id;
  }

  const matches = Object.entries(matchIds).reduce(
    (accum: GiverRecipient[], [giverId, recipientId]) => [
      ...accum,
      { giver: nameMap[giverId], recipient: nameMap[recipientId] },
    ],
    [],
  );

  drawnNames.value = matches;
  editingNames.value = false;
  drawingNames.value = false;
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

.matches {
  align-items: stretch;
}

.match-item {
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

  &:first-child {
    border-top-left-radius: spacing(1);
    border-top-right-radius: spacing(1);
  }
  &:last-child {
    border-bottom-left-radius: spacing(1);
    border-bottom-right-radius: spacing(1);
  }

  &:not(:last-child) {
    border-bottom: 1px solid $color-primary;
  }
}

.match-item__name {
  &.is-giver {
    font-size: 1.1rem;
    font-weight: bold;
  }
  &.is-recipient {
    opacity: 0.8;
  }
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
