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
    <!-- NOTE: Must use 'v-show' to prevent remounting vee-validate fields (would reset form) -->
    <div v-show="!viewingMatches" class="form__names elevation-2 mb-6">
      <NameInput
        v-for="(field, idx) in nameEntryFields"
        :key="field.value.id ?? field.key"
        ref="nameInputRefs"
        :alone="nameEntryFields.length <= 1"
        :disabled="drawingNames"
        :editor-state="editorState"
        :exclusions="!!field.value.exclusions.length"
        :name="`names[${idx}]`"
        :selectable="managingExclusionsIdx !== null && managingExclusionsIdx !== idx"
        :selected="managingExclusionsEntry?.exclusions.includes(field.value.id) ?? false"
        @manage-exclusions="handleManageExclusions(idx)"
        @move="(direction) => handleMove(direction, idx)"
        @remove="nameEntryHelpers.remove(idx)"
        @select="handleToggleExclusion(field.value.id)"
      />
    </div>
    <VAlert class="form__warning mb-4" type="warning">
      Exclusions are currently unsupported!
    </VAlert>
    <ActionBar class="form__actions">
      <template #left>
        <VBtn
          v-if="!viewingMatches"
          color="secondary"
          :disabled="drawingNames || editorState === 'exclusions'"
          :prepend-icon="mdiAdd"
          @click="handleAddEntry"
        >
          Add
        </VBtn>
        <VBtn v-else color="secondary" :prepend-icon="mdiEdit" @click="clearDrawnNames">
          Edit
        </VBtn>
      </template>
      <template #right>
        <VBtn
          color="warning"
          :disabled="drawingNames"
          :variant="!viewingMatches ? 'text' : undefined"
          @click="resetDialog.show()"
        >
          Reset
        </VBtn>
        <VBtn
          v-if="!viewingMatches"
          color="secondary"
          :loading="drawingNames"
          :prepend-icon="mdiGenerate"
          @click="handleDrawNames"
        >
          Draw Names!
        </VBtn>
      </template>
    </ActionBar>
    <div v-if="viewingMatches" class="form matches">
      <NameMatch
        v-for="match in drawnNames"
        :key="match.giver.id"
        :names="[match.giver, match.recipient]"
        type="giver-recipient"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiPlus as mdiAdd, mdiPencil as mdiEdit, mdiVote as mdiGenerate } from "@mdi/js";
import { v4 as uuidv4 } from "uuid";
import { useFieldArray, useForm } from "vee-validate";
import { computed, nextTick, ref } from "vue";
import * as yup from "yup";

import { ConfirmDialog } from "@components/dialog";
import { NameInput, NameMatch } from "@components/editor";
import { ActionBar } from "@components/layout";
import { useDialog } from "@composables";
import { matchGiverRecipients } from "@utilities";

import type { EditorState } from "@typings/editor.types";
import type { GiverRecipient, Name } from "@typings/name.types";

interface NameEntry extends Name {
  exclusions: string[];
}

const resetDialog = useDialog();

const editorState = computed<EditorState>(() => {
  if (drawnNames.value.length) return "display";
  if (managingExclusionsIdx.value !== null) return "exclusions";
  return "edit";
});
const viewingMatches = computed(() => !!drawnNames.value.length);

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
    names: [
      createNameEntry({ name: "Kendall" }),
      createNameEntry({ name: "Kyle" }),
      createNameEntry({ name: "Tanya" }),
      createNameEntry({ name: "Phil" }),
      createNameEntry({ name: "Sandra" }),
    ],
  },
  validationSchema: namesSchema,
});

const managingExclusionsIdx = ref<number | null>(null);
const managingExclusionsEntry = computed(() =>
  managingExclusionsIdx.value !== null
    ? nameEntryFields.value[managingExclusionsIdx.value].value
    : null,
);

/** Manage excluded matches for a name */
const handleManageExclusions = (idx: number) => {
  if (editorState.value === "display") return;

  if (managingExclusionsIdx.value === idx) {
    managingExclusionsIdx.value = null;
  } else {
    managingExclusionsIdx.value = idx;
  }
};

/** Toggle whether a potential match is excluded or possible for a name */
const handleToggleExclusion = (id: string) => {
  if (managingExclusionsIdx.value === null) return;

  const currentFieldRef = nameEntryFields.value[managingExclusionsIdx.value];
  const currentExclusions = currentFieldRef.value.exclusions;
  if (currentExclusions.includes(id)) {
    currentFieldRef.value.exclusions = currentExclusions.filter((e) => e !== id);
  } else {
    currentFieldRef.value.exclusions = [...currentExclusions, id];
  }
};

const { fields: nameEntryFields, ...nameEntryHelpers } = useFieldArray<NameEntry>("names");

const handleAddEntry = () => {
  // TODO: Only create if there are no empty rows previous
  nameEntryHelpers.push(createNameEntry());
};

const handleReset = () => {
  resetForm();

  managingExclusionsIdx.value = null;
  clearDrawnNames();
};

/** Whether names are currently being drawn (pseudo-process) */
const drawingNames = ref(false);
const drawnNames = ref<GiverRecipient[]>([]);
const handleDrawNames = submitForm(async (data) => {
  drawingNames.value = true;

  drawnNames.value = await matchGiverRecipients(data.names);

  drawingNames.value = false;
});

const clearDrawnNames = () => {
  drawnNames.value = [];
};

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

    handleAddEntry();
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

.form__names {
  background-color: $color-white;
}

.form__warning {
  flex: 0 0 content;
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
