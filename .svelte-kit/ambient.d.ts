
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
	export const NVM_INC: string;
	export const npm_package_scripts_check_links: string;
	export const npm_package_devDependencies__tailwindcss_typography: string;
	export const npm_package_devDependencies_prettier: string;
	export const npm_package_dependencies_bits_ui: string;
	export const TERM_PROGRAM: string;
	export const npm_package_scripts_build_figma: string;
	export const npm_package_devDependencies_eslint_plugin_svelte: string;
	export const npm_package_scripts_onlybuild: string;
	export const npm_package_scripts_build_plugin: string;
	export const NODE: string;
	export const NVM_CD_FLAGS: string;
	export const npm_package_devDependencies_prettier_plugin_svelte: string;
	export const npm_package_devDependencies_typescript: string;
	export const INIT_CWD: string;
	export const SHELL: string;
	export const TERM: string;
	export const npm_package_devDependencies_vite: string;
	export const TMPDIR: string;
	export const isArchMatched: string;
	export const HOMEBREW_REPOSITORY: string;
	export const npm_package_dependencies_svelte_sonner: string;
	export const npm_package_devDependencies_esbuild: string;
	export const npm_package_scripts_lint: string;
	export const TERM_PROGRAM_VERSION: string;
	export const VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
	export const MallocNanoZone: string;
	export const ZDOTDIR: string;
	export const npm_package_dependencies_lucide_svelte: string;
	export const npm_package_private: string;
	export const npm_package_dependencies__upstash_redis: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_config_registry: string;
	export const USER: string;
	export const NVM_DIR: string;
	export const npm_package_description: string;
	export const npm_package_license: string;
	export const npm_package_scripts_check_watch: string;
	export const COMMAND_MODE: string;
	export const npm_package_scripts_prebuild: string;
	export const npm_package_devDependencies_mdsvex: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const SSH_AUTH_SOCK: string;
	export const SCRCPY_SERVER_PATH: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const VSCODE_PROFILE_INITIALIZED: string;
	export const npm_package_dependencies__figma_plugin_typings: string;
	export const npm_package_devDependencies_eslint: string;
	export const npm_package_devDependencies_postcss: string;
	export const npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
	export const npm_package_devDependencies_tslib: string;
	export const npm_execpath: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_package_config_siteURL: string;
	export const npm_config_frozen_lockfile: string;
	export const npm_package_dependencies_tailwind_merge: string;
	export const npm_package_devDependencies__typescript_eslint_parser: string;
	export const PATH: string;
	export const LaunchInstanceID: string;
	export const npm_package_json: string;
	export const __CFBundleIdentifier: string;
	export const USER_ZDOTDIR: string;
	export const npm_package_author: string;
	export const npm_package_dependencies_downloadjs: string;
	export const PWD: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_command: string;
	export const TERM_PRODUCT: string;
	export const npm_package_scripts_preview: string;
	export const npm_package_dependencies_rehype_pretty_code: string;
	export const npm_lifecycle_event: string;
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
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const npm_package_keywords_3: string;
	export const npm_package_devDependencies_vitest: string;
	export const npm_package_dependencies__svgr_plugin_jsx: string;
	export const npm_package_dependencies_jszip: string;
	export const npm_package_devDependencies_eslint_config_prettier: string;
	export const npm_config_node_gyp: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_devDependencies_sveltekit_search_params: string;
	export const VSCODE_INJECTION: string;
	export const npm_package_dependencies__upstash_ratelimit: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const HOME: string;
	export const SHLVL: string;
	export const npm_package_type: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const npm_package_scripts_test: string;
	export const HOMEBREW_PREFIX: string;
	export const npm_package_scripts_check_size: string;
	export const LOGNAME: string;
	export const npm_package_scripts_format: string;
	export const npm_lifecycle_script: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const npm_package_devDependencies_prettier_plugin_tailwindcss: string;
	export const NVM_BIN: string;
	export const BUN_INSTALL: string;
	export const npm_package_scripts_fix_viewbox: string;
	export const npm_config_user_agent: string;
	export const HOMEBREW_CELLAR: string;
	export const INFOPATH: string;
	export const GIT_ASKPASS: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const OSLogRateLimit: string;
	export const SECURITYSESSIONID: string;
	export const COLORTERM: string;
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
		NVM_INC: string;
		npm_package_scripts_check_links: string;
		npm_package_devDependencies__tailwindcss_typography: string;
		npm_package_devDependencies_prettier: string;
		npm_package_dependencies_bits_ui: string;
		TERM_PROGRAM: string;
		npm_package_scripts_build_figma: string;
		npm_package_devDependencies_eslint_plugin_svelte: string;
		npm_package_scripts_onlybuild: string;
		npm_package_scripts_build_plugin: string;
		NODE: string;
		NVM_CD_FLAGS: string;
		npm_package_devDependencies_prettier_plugin_svelte: string;
		npm_package_devDependencies_typescript: string;
		INIT_CWD: string;
		SHELL: string;
		TERM: string;
		npm_package_devDependencies_vite: string;
		TMPDIR: string;
		isArchMatched: string;
		HOMEBREW_REPOSITORY: string;
		npm_package_dependencies_svelte_sonner: string;
		npm_package_devDependencies_esbuild: string;
		npm_package_scripts_lint: string;
		TERM_PROGRAM_VERSION: string;
		VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
		MallocNanoZone: string;
		ZDOTDIR: string;
		npm_package_dependencies_lucide_svelte: string;
		npm_package_private: string;
		npm_package_dependencies__upstash_redis: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_config_registry: string;
		USER: string;
		NVM_DIR: string;
		npm_package_description: string;
		npm_package_license: string;
		npm_package_scripts_check_watch: string;
		COMMAND_MODE: string;
		npm_package_scripts_prebuild: string;
		npm_package_devDependencies_mdsvex: string;
		PNPM_SCRIPT_SRC_DIR: string;
		SSH_AUTH_SOCK: string;
		SCRCPY_SERVER_PATH: string;
		__CF_USER_TEXT_ENCODING: string;
		VSCODE_PROFILE_INITIALIZED: string;
		npm_package_dependencies__figma_plugin_typings: string;
		npm_package_devDependencies_eslint: string;
		npm_package_devDependencies_postcss: string;
		npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
		npm_package_devDependencies_tslib: string;
		npm_execpath: string;
		npm_package_devDependencies_svelte: string;
		npm_package_config_siteURL: string;
		npm_config_frozen_lockfile: string;
		npm_package_dependencies_tailwind_merge: string;
		npm_package_devDependencies__typescript_eslint_parser: string;
		PATH: string;
		LaunchInstanceID: string;
		npm_package_json: string;
		__CFBundleIdentifier: string;
		USER_ZDOTDIR: string;
		npm_package_author: string;
		npm_package_dependencies_downloadjs: string;
		PWD: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_command: string;
		TERM_PRODUCT: string;
		npm_package_scripts_preview: string;
		npm_package_dependencies_rehype_pretty_code: string;
		npm_lifecycle_event: string;
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
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		npm_package_keywords_3: string;
		npm_package_devDependencies_vitest: string;
		npm_package_dependencies__svgr_plugin_jsx: string;
		npm_package_dependencies_jszip: string;
		npm_package_devDependencies_eslint_config_prettier: string;
		npm_config_node_gyp: string;
		XPC_SERVICE_NAME: string;
		npm_package_version: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_devDependencies_sveltekit_search_params: string;
		VSCODE_INJECTION: string;
		npm_package_dependencies__upstash_ratelimit: string;
		npm_package_devDependencies_autoprefixer: string;
		npm_package_devDependencies_svelte_check: string;
		HOME: string;
		SHLVL: string;
		npm_package_type: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		npm_package_scripts_test: string;
		HOMEBREW_PREFIX: string;
		npm_package_scripts_check_size: string;
		LOGNAME: string;
		npm_package_scripts_format: string;
		npm_lifecycle_script: string;
		VSCODE_GIT_IPC_HANDLE: string;
		npm_package_devDependencies_prettier_plugin_tailwindcss: string;
		NVM_BIN: string;
		BUN_INSTALL: string;
		npm_package_scripts_fix_viewbox: string;
		npm_config_user_agent: string;
		HOMEBREW_CELLAR: string;
		INFOPATH: string;
		GIT_ASKPASS: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		OSLogRateLimit: string;
		SECURITYSESSIONID: string;
		COLORTERM: string;
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
