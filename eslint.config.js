import pluginVue from "eslint-plugin-vue";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue,js,cjs,mjs}"],
  },
  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/coverage/**", "**/test-results/**", "**/playwright-report/**"],
  },
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  {
    name: "app/tests",
    files: ["**/__tests__/**", "**/*.spec.ts"],
    rules: {
      // Component mounting in tests relies on `as any` casts.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  skipFormatting
);
