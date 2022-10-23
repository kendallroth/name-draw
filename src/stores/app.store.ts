import { defineStore } from "pinia";
import { ref } from "vue";

import type { AppTheme } from "@typings/app.types";

export const useAppStore = defineStore("app", () => {
  const theme = ref<AppTheme>("light");
  const setTheme = (themeName: AppTheme) => {
    theme.value = themeName;
  };

  return {
    setTheme,
    theme,
  };
});
