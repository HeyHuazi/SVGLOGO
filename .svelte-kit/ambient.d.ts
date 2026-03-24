
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const SVGL_API_REQUESTS: string;
	export const UPSTASH_REDIS_URL: string;
	export const UPSTASH_REDIS_TOKEN: string;
	export const CRAFT_IS_PACKAGED: string;
	export const NVM_INC: string;
	export const npm_package_scripts_check_links: string;
	export const npm_package_devDependencies__tailwindcss_typography: string;
	export const CRAFT_AGENT_VERSION: string;
	export const npm_package_devDependencies_prettier: string;
	export const npm_package_dependencies_bits_ui: string;
	export const npm_package_scripts_build_figma: string;
	export const npm_package_devDependencies_eslint_plugin_svelte: string;
	export const npm_package_scripts_onlybuild: string;
	export const npm_package_scripts_build_plugin: string;
	export const NODE: string;
	export const NVM_CD_FLAGS: string;
	export const npm_package_devDependencies_prettier_plugin_svelte: string;
	export const npm_package_devDependencies_typescript: string;
	export const INIT_CWD: string;
	export const TERM: string;
	export const SHELL: string;
	export const npm_package_devDependencies_vite: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const npm_package_dependencies_svelte_sonner: string;
	export const npm_package_devDependencies_esbuild: string;
	export const npm_package_scripts_lint: string;
	export const npm_package_scripts_scan_svg: string;
	export const npm_package_devDependencies_concurrently: string;
	export const npm_package_scripts_dev: string;
	export const MallocNanoZone: string;
	export const npm_package_dependencies_lucide_svelte: string;
	export const CRAFT_PI_MODEL_PROVIDER: string;
	export const npm_package_private: string;
	export const npm_package_dependencies__upstash_redis: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_config_registry: string;
	export const CRAFT_CLI_ENTRY: string;
	export const CRAFT_BUN: string;
	export const GIT_TERMINAL_PROMPT: string;
	export const NVM_DIR: string;
	export const USER: string;
	export const npm_package_description: string;
	export const CRAFT_DEBUG: string;
	export const CRAFT_COMMANDS_ENTRY: string;
	export const npm_package_license: string;
	export const npm_package_scripts_check_watch: string;
	export const CRAFT_PI_MODEL_API: string;
	export const CRAFT_SCRIPTS: string;
	export const COMMAND_MODE: string;
	export const npm_package_scripts_prebuild: string;
	export const npm_package_devDependencies_mdsvex: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const SCRCPY_SERVER_PATH: string;
	export const SSH_AUTH_SOCK: string;
	export const npm_package_scripts_predev: string;
	export const npm_package_scripts_migrate_svg: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_package_dependencies__figma_plugin_typings: string;
	export const npm_package_devDependencies_eslint: string;
	export const npm_package_devDependencies_postcss: string;
	export const npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
	export const npm_package_devDependencies_tslib: string;
	export const npm_execpath: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_package_devDependencies_tsx: string;
	export const npm_package_config_siteURL: string;
	export const ANTHROPIC_DEFAULT_HAIKU_MODEL: string;
	export const npm_config_frozen_lockfile: string;
	export const npm_package_scripts_generate_svg: string;
	export const npm_package_dependencies_tailwind_merge: string;
	export const npm_package_devDependencies__typescript_eslint_parser: string;
	export const PATH: string;
	export const npm_package_dependencies__svgr_core: string;
	export const CRAFT_CLI_DOC_PATH: string;
	export const CRAFT_UV: string;
	export const CRAFT_RESOURCES_BASE: string;
	export const __CFBundleIdentifier: string;
	export const npm_package_author: string;
	export const npm_package_dependencies_downloadjs: string;
	export const PWD: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_command: string;
	export const npm_package_scripts_preview: string;
	export const npm_package_dependencies_rehype_pretty_code: string;
	export const npm_lifecycle_event: string;
	export const CRAFT_PI_MODEL_BASE_URL: string;
	export const LANG: string;
	export const npm_package_name: string;
	export const npm_package_keywords_0: string;
	export const npm_package_dependencies__svelte_dev_pretty_code: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_keywords_1: string;
	export const npm_package_dependencies_mode_watcher: string;
	export const NODE_PATH: string;
	export const npm_package_keywords_2: string;
	export const npm_package_scripts_build: string;
	export const npm_package_scripts_dev_figma: string;
	export const XPC_FLAGS: string;
	export const npm_package_keywords_3: string;
	export const npm_package_devDependencies_vitest: string;
	export const npm_package_dependencies__svgr_plugin_jsx: string;
	export const CRAFT_APP_ROOT: string;
	export const APPLE_SUPPRESS_DEVELOPER_TOOL_POPUP: string;
	export const npm_package_dependencies_jszip: string;
	export const npm_package_devDependencies_yaml: string;
	export const npm_package_devDependencies_eslint_config_prettier: string;
	export const npm_config_node_gyp: string;
	export const CRAFT_SESSION_DIR: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_devDependencies_sveltekit_search_params: string;
	export const npm_package_dependencies__upstash_ratelimit: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const SHLVL: string;
	export const HOME: string;
	export const npm_package_type: string;
	export const npm_package_scripts_test: string;
	export const HOMEBREW_PREFIX: string;
	export const npm_package_scripts_check_size: string;
	export const LOGNAME: string;
	export const npm_package_scripts_format: string;
	export const npm_package_devDependencies__sveltejs_adapter_cloudflare: string;
	export const npm_lifecycle_script: string;
	export const npm_package_devDependencies_prettier_plugin_tailwindcss: string;
	export const CRAFT_WORKSPACE_PATH: string;
	export const npm_package_devDependencies_wrangler: string;
	export const BUN_INSTALL: string;
	export const NVM_BIN: string;
	export const npm_package_scripts_fix_viewbox: string;
	export const npm_config_user_agent: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const npm_package_dependencies_clsx: string;
	export const CRAFT_COMMANDS_DOC_PATH: string;
	export const OSLogRateLimit: string;
	export const npm_package_scripts_host: string;
	export const npm_package_devDependencies__types_downloadjs: string;
	export const npm_package_dependencies_shiki: string;
	export const npm_package_scripts_check: string;
	export const npm_node_execpath: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_51LA_ID: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		SVGL_API_REQUESTS: string;
		UPSTASH_REDIS_URL: string;
		UPSTASH_REDIS_TOKEN: string;
		CRAFT_IS_PACKAGED: string;
		NVM_INC: string;
		npm_package_scripts_check_links: string;
		npm_package_devDependencies__tailwindcss_typography: string;
		CRAFT_AGENT_VERSION: string;
		npm_package_devDependencies_prettier: string;
		npm_package_dependencies_bits_ui: string;
		npm_package_scripts_build_figma: string;
		npm_package_devDependencies_eslint_plugin_svelte: string;
		npm_package_scripts_onlybuild: string;
		npm_package_scripts_build_plugin: string;
		NODE: string;
		NVM_CD_FLAGS: string;
		npm_package_devDependencies_prettier_plugin_svelte: string;
		npm_package_devDependencies_typescript: string;
		INIT_CWD: string;
		TERM: string;
		SHELL: string;
		npm_package_devDependencies_vite: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		npm_package_dependencies_svelte_sonner: string;
		npm_package_devDependencies_esbuild: string;
		npm_package_scripts_lint: string;
		npm_package_scripts_scan_svg: string;
		npm_package_devDependencies_concurrently: string;
		npm_package_scripts_dev: string;
		MallocNanoZone: string;
		npm_package_dependencies_lucide_svelte: string;
		CRAFT_PI_MODEL_PROVIDER: string;
		npm_package_private: string;
		npm_package_dependencies__upstash_redis: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_config_registry: string;
		CRAFT_CLI_ENTRY: string;
		CRAFT_BUN: string;
		GIT_TERMINAL_PROMPT: string;
		NVM_DIR: string;
		USER: string;
		npm_package_description: string;
		CRAFT_DEBUG: string;
		CRAFT_COMMANDS_ENTRY: string;
		npm_package_license: string;
		npm_package_scripts_check_watch: string;
		CRAFT_PI_MODEL_API: string;
		CRAFT_SCRIPTS: string;
		COMMAND_MODE: string;
		npm_package_scripts_prebuild: string;
		npm_package_devDependencies_mdsvex: string;
		PNPM_SCRIPT_SRC_DIR: string;
		SCRCPY_SERVER_PATH: string;
		SSH_AUTH_SOCK: string;
		npm_package_scripts_predev: string;
		npm_package_scripts_migrate_svg: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_package_dependencies__figma_plugin_typings: string;
		npm_package_devDependencies_eslint: string;
		npm_package_devDependencies_postcss: string;
		npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
		npm_package_devDependencies_tslib: string;
		npm_execpath: string;
		npm_package_devDependencies_svelte: string;
		npm_package_devDependencies_tsx: string;
		npm_package_config_siteURL: string;
		ANTHROPIC_DEFAULT_HAIKU_MODEL: string;
		npm_config_frozen_lockfile: string;
		npm_package_scripts_generate_svg: string;
		npm_package_dependencies_tailwind_merge: string;
		npm_package_devDependencies__typescript_eslint_parser: string;
		PATH: string;
		npm_package_dependencies__svgr_core: string;
		CRAFT_CLI_DOC_PATH: string;
		CRAFT_UV: string;
		CRAFT_RESOURCES_BASE: string;
		__CFBundleIdentifier: string;
		npm_package_author: string;
		npm_package_dependencies_downloadjs: string;
		PWD: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_command: string;
		npm_package_scripts_preview: string;
		npm_package_dependencies_rehype_pretty_code: string;
		npm_lifecycle_event: string;
		CRAFT_PI_MODEL_BASE_URL: string;
		LANG: string;
		npm_package_name: string;
		npm_package_keywords_0: string;
		npm_package_dependencies__svelte_dev_pretty_code: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_keywords_1: string;
		npm_package_dependencies_mode_watcher: string;
		NODE_PATH: string;
		npm_package_keywords_2: string;
		npm_package_scripts_build: string;
		npm_package_scripts_dev_figma: string;
		XPC_FLAGS: string;
		npm_package_keywords_3: string;
		npm_package_devDependencies_vitest: string;
		npm_package_dependencies__svgr_plugin_jsx: string;
		CRAFT_APP_ROOT: string;
		APPLE_SUPPRESS_DEVELOPER_TOOL_POPUP: string;
		npm_package_dependencies_jszip: string;
		npm_package_devDependencies_yaml: string;
		npm_package_devDependencies_eslint_config_prettier: string;
		npm_config_node_gyp: string;
		CRAFT_SESSION_DIR: string;
		XPC_SERVICE_NAME: string;
		npm_package_version: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_devDependencies_sveltekit_search_params: string;
		npm_package_dependencies__upstash_ratelimit: string;
		npm_package_devDependencies_autoprefixer: string;
		npm_package_devDependencies_svelte_check: string;
		SHLVL: string;
		HOME: string;
		npm_package_type: string;
		npm_package_scripts_test: string;
		HOMEBREW_PREFIX: string;
		npm_package_scripts_check_size: string;
		LOGNAME: string;
		npm_package_scripts_format: string;
		npm_package_devDependencies__sveltejs_adapter_cloudflare: string;
		npm_lifecycle_script: string;
		npm_package_devDependencies_prettier_plugin_tailwindcss: string;
		CRAFT_WORKSPACE_PATH: string;
		npm_package_devDependencies_wrangler: string;
		BUN_INSTALL: string;
		NVM_BIN: string;
		npm_package_scripts_fix_viewbox: string;
		npm_config_user_agent: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		npm_package_dependencies_clsx: string;
		CRAFT_COMMANDS_DOC_PATH: string;
		OSLogRateLimit: string;
		npm_package_scripts_host: string;
		npm_package_devDependencies__types_downloadjs: string;
		npm_package_dependencies_shiki: string;
		npm_package_scripts_check: string;
		npm_node_execpath: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_51LA_ID: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
