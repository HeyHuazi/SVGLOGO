
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
	export const CRAFT_IS_PACKAGED: string;
	export const CRAFT_AGENT_VERSION: string;
	export const NODE: string;
	export const INIT_CWD: string;
	export const NVM_CD_FLAGS: string;
	export const SHELL: string;
	export const TERM: string;
	export const TMPDIR: string;
	export const HOMEBREW_REPOSITORY: string;
	export const npm_config_global_prefix: string;
	export const MallocNanoZone: string;
	export const COLOR: string;
	export const npm_config_noproxy: string;
	export const npm_config_registry: string;
	export const CRAFT_PI_MODEL_PROVIDER: string;
	export const npm_config_local_prefix: string;
	export const GIT_TERMINAL_PROMPT: string;
	export const CRAFT_BUN: string;
	export const CRAFT_CLI_ENTRY: string;
	export const USER: string;
	export const NVM_DIR: string;
	export const http_proxy: string;
	export const CRAFT_COMMANDS_ENTRY: string;
	export const CRAFT_DEBUG: string;
	export const COMMAND_MODE: string;
	export const CRAFT_SCRIPTS: string;
	export const CRAFT_PI_MODEL_API: string;
	export const npm_config_globalconfig: string;
	export const SSH_AUTH_SOCK: string;
	export const SCRCPY_SERVER_PATH: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_execpath: string;
	export const YOUMIND_API_KEY: string;
	export const npm_package_config_siteURL: string;
	export const ANTHROPIC_DEFAULT_HAIKU_MODEL: string;
	export const PATH: string;
	export const npm_package_json: string;
	export const LaunchInstanceID: string;
	export const _: string;
	export const npm_config_userconfig: string;
	export const npm_config_init_module: string;
	export const __CFBundleIdentifier: string;
	export const CRAFT_RESOURCES_BASE: string;
	export const CRAFT_UV: string;
	export const CRAFT_CLI_DOC_PATH: string;
	export const npm_command: string;
	export const PWD: string;
	export const npm_lifecycle_event: string;
	export const EDITOR: string;
	export const npm_package_name: string;
	export const LANG: string;
	export const CRAFT_PI_MODEL_BASE_URL: string;
	export const npm_config_npm_version: string;
	export const XPC_FLAGS: string;
	export const APPLE_SUPPRESS_DEVELOPER_TOOL_POPUP: string;
	export const CRAFT_APP_ROOT: string;
	export const npm_config_node_gyp: string;
	export const HTTPS_PROXY: string;
	export const https_proxy: string;
	export const npm_package_version: string;
	export const XPC_SERVICE_NAME: string;
	export const CRAFT_SESSION_DIR: string;
	export const HOME: string;
	export const SHLVL: string;
	export const HOMEBREW_PREFIX: string;
	export const HTTP_PROXY: string;
	export const npm_config_cache: string;
	export const LOGNAME: string;
	export const npm_lifecycle_script: string;
	export const CRAFT_WORKSPACE_PATH: string;
	export const NVM_BIN: string;
	export const BUN_INSTALL: string;
	export const npm_config_user_agent: string;
	export const HOMEBREW_CELLAR: string;
	export const INFOPATH: string;
	export const CRAFT_COMMANDS_DOC_PATH: string;
	export const OSLogRateLimit: string;
	export const SECURITYSESSIONID: string;
	export const npm_node_execpath: string;
	export const npm_config_prefix: string;
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
		CRAFT_IS_PACKAGED: string;
		CRAFT_AGENT_VERSION: string;
		NODE: string;
		INIT_CWD: string;
		NVM_CD_FLAGS: string;
		SHELL: string;
		TERM: string;
		TMPDIR: string;
		HOMEBREW_REPOSITORY: string;
		npm_config_global_prefix: string;
		MallocNanoZone: string;
		COLOR: string;
		npm_config_noproxy: string;
		npm_config_registry: string;
		CRAFT_PI_MODEL_PROVIDER: string;
		npm_config_local_prefix: string;
		GIT_TERMINAL_PROMPT: string;
		CRAFT_BUN: string;
		CRAFT_CLI_ENTRY: string;
		USER: string;
		NVM_DIR: string;
		http_proxy: string;
		CRAFT_COMMANDS_ENTRY: string;
		CRAFT_DEBUG: string;
		COMMAND_MODE: string;
		CRAFT_SCRIPTS: string;
		CRAFT_PI_MODEL_API: string;
		npm_config_globalconfig: string;
		SSH_AUTH_SOCK: string;
		SCRCPY_SERVER_PATH: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_execpath: string;
		YOUMIND_API_KEY: string;
		npm_package_config_siteURL: string;
		ANTHROPIC_DEFAULT_HAIKU_MODEL: string;
		PATH: string;
		npm_package_json: string;
		LaunchInstanceID: string;
		_: string;
		npm_config_userconfig: string;
		npm_config_init_module: string;
		__CFBundleIdentifier: string;
		CRAFT_RESOURCES_BASE: string;
		CRAFT_UV: string;
		CRAFT_CLI_DOC_PATH: string;
		npm_command: string;
		PWD: string;
		npm_lifecycle_event: string;
		EDITOR: string;
		npm_package_name: string;
		LANG: string;
		CRAFT_PI_MODEL_BASE_URL: string;
		npm_config_npm_version: string;
		XPC_FLAGS: string;
		APPLE_SUPPRESS_DEVELOPER_TOOL_POPUP: string;
		CRAFT_APP_ROOT: string;
		npm_config_node_gyp: string;
		HTTPS_PROXY: string;
		https_proxy: string;
		npm_package_version: string;
		XPC_SERVICE_NAME: string;
		CRAFT_SESSION_DIR: string;
		HOME: string;
		SHLVL: string;
		HOMEBREW_PREFIX: string;
		HTTP_PROXY: string;
		npm_config_cache: string;
		LOGNAME: string;
		npm_lifecycle_script: string;
		CRAFT_WORKSPACE_PATH: string;
		NVM_BIN: string;
		BUN_INSTALL: string;
		npm_config_user_agent: string;
		HOMEBREW_CELLAR: string;
		INFOPATH: string;
		CRAFT_COMMANDS_DOC_PATH: string;
		OSLogRateLimit: string;
		SECURITYSESSIONID: string;
		npm_node_execpath: string;
		npm_config_prefix: string;
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
