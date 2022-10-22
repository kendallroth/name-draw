<template>
  <div class="home">
    <div class="form">
      <div class="form__names">
        <NameInput
          v-for="(field, idx) in nameEntryFields"
          :key="field.value.id ?? field.key"
          :alone="nameEntryFields.length <= 1"
          :name="`names[${idx}]`"
          @remove="nameEntryHelpers.remove(idx)"
        />
      </div>
      <ActionBar class="form__actions">
        <template #left>
          <button class="button" @click="addEntry">
            <SvgIcon class="is-left" :path="mdiAdd" />
            Add
          </button>
          <button class="button" disabled>Add Many</button>
          <button class="button" @click="handleReset">Reset</button>
        </template>
        <template #right>
          <button class="button" @click="drawNames">
            <SvgIcon class="is-left" :path="mdiGenerate" />
            Draw Names!
          </button>
        </template>
      </ActionBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiPlus as mdiAdd, mdiVote as mdiGenerate } from "@mdi/js";
import { v4 as uuidv4 } from "uuid";
import { useFieldArray, useForm } from "vee-validate";
import * as yup from "yup";

import { NameInput } from "@components/form";
import { SvgIcon } from "@components/icon";
import { ActionBar } from "@components/layout";

type NameEntry = {
  id: string;
  name: string;
  exclusions: string[];
};

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

const drawNames = handleSubmit(async (data) => {
  console.log("Submitted", data);
  alert(`Names: ${data.names.map((n) => n.name).join(", ")}`);
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
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
  .name-input {
    &:first-child {
      input[type="text"] {
        border-top-left-radius: spacing(1);
      }
      button:last-of-type {
        border-top-right-radius: spacing(1);
      }
    }
    &:last-child {
      input[type="text"] {
        border-bottom-left-radius: spacing(1);
      }
      button:last-of-type {
        border-bottom-right-radius: spacing(1);
      }
    }
    &:not(:last-child) {
      border-bottom: 1px solid $color-primary;
    }
  }
}
</style>
