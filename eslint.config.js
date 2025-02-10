import eslintPluginVue from "eslint-plugin-vue";
import tsParser from "@typescript-eslint/parser";
import * as vueParser from "vue-eslint-parser";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: ["node_modules", "dist", ".nuxt"],
  },
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".vue"],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      vue: eslintPluginVue,
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/html-indent": ["error", 2],
      "vue/html-self-closing": "error",
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/no-unused-components": "warn",
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: 3,
          multiline: 1,
        },
      ],
    },
  },
  prettier,
];
