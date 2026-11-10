// Flat ESLint config for the VibeForge app.
//
// Scope: `eslint src scripts`. Generated artifacts (`.next`, `shots`), the
// design notes in `docs/` and the Next-generated `next-env.d.ts` are not source
// we lint. Browser/Node host globals are declared by hand so the config has no
// dependency on the `globals` package (not a direct dependency of this repo).
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

const nodeGlobals = {
  process: "readonly",
  console: "readonly",
  Buffer: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  fetch: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  queueMicrotask: "readonly",
  structuredClone: "readonly",
  TextEncoder: "readonly",
  TextDecoder: "readonly",
  AbortController: "readonly",
  AbortSignal: "readonly",
  performance: "readonly",
  crypto: "readonly",
};

// Some QA scripts run snippets inside `page.evaluate(...)`; those callbacks are
// parsed by ESLint as ordinary source, so the browser globals they use must be
// declared as well.
const browserGlobals = {
  window: "readonly",
  document: "readonly",
  getComputedStyle: "readonly",
  localStorage: "readonly",
  navigator: "readonly",
  requestAnimationFrame: "readonly",
  cancelAnimationFrame: "readonly",
};

export default tseslint.config(
  {
    ignores: [".next/**", "node_modules/**", "shots/**", "docs/**", "next-env.d.ts"],
    linterOptions: {
      // Two source comments disable `@typescript-eslint/no-implied-eval`, which
      // needs type-aware linting (not enabled here — it would require a full
      // project service run). Keep them as documentation instead of reporting
      // them as "unused disable directives".
      reportUnusedDisableDirectives: "off",
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TypeScript itself resolves globals; the base rule double-reports and
      // does not understand TS-only syntax. The TS-aware rule is enabled by
      // typescript-eslint's recommended config.
      "no-unused-vars": "off",
      "no-undef": "off",
      // Kept as a warning (not an error): a few unused identifiers remain in
      // generated/reference business code that this task must not modify.
      // Underscore-prefixed params mark intentionally unused callback args.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "none",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...nodeGlobals, ...browserGlobals },
    },
    rules: {
      // QA scripts carry a couple of pre-existing unused helpers; keep them
      // visible as warnings instead of blocking the lint gate (the scripts are
      // outside this task's write scope).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { args: "none", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
);
