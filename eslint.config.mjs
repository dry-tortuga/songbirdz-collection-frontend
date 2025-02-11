import globals from "globals";
import pluginJs from "@eslint/js";
import { fixupConfigRules } from "@eslint/compat";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import tseslint from "typescript-eslint";

export default tseslint.config([
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	tseslint.configs.recommended,
	...fixupConfigRules(pluginReactConfig),
]);
