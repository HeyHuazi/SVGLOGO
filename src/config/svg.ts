/*
 * [INPUT]: 无运行时依赖，集中定义 SVG 入库与构建门禁参数
 * [OUTPUT]: 对外提供 SVG_SIZE_LIMIT_BYTES 与 SVG_TARGET_HEIGHT
 * [POS]: config 的 SVG 质量真相源，被 admin 入库和 scripts/check-size 共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export const SVG_SIZE_LIMIT_BYTES = 200_000;
export const SVG_TARGET_HEIGHT = 46;
