/*
 * [INPUT]: 依赖投稿标题或用户输入的候选文件名
 * [OUTPUT]: 对外提供文件名建议、具体错误诊断与强制校验，统一浏览器预检和服务端路径安全边界
 * [POS]: routes/admin/lib 的共享文件名规则，确保 UI 提示与本地入库事务使用同一判定
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const BRAND_NAMES: Record<string, string> = {
  特斯拉: 'Tesla',
  特斯拉汽车: 'Tesla',
  中汽研: 'CATARC',
  迅雷云盘: 'Thunder',
  大华: 'Dahua',
  海康威视: 'Hikvision',
  宇视: 'Uniview',
  天地伟业: 'Tiandy',
  江西天然气: 'JiangxiGas',
  拓德科技: 'TuodeTech',
  火山引擎: 'VolcEngine',
  零跑: 'Leapmotor',
  零跑汽车: 'Leapmotor',
  大众: 'Volkswagen',
  玛莎拉蒂: 'Maserati',
  华南农业大学: 'SCAU'
};

export function suggestSvgFilename(title: string): string {
  const cleanTitle = title.replace(/(?:logo|标志)$/i, '').trim();
  const mapped = BRAND_NAMES[cleanTitle] ?? BRAND_NAMES[title];
  const basename = mapped ?? cleanTitle.replace(/[^\p{L}\p{N}_-]/gu, '');
  return `${basename || 'Logo'}.svg`;
}

export function getSvgFilenameError(filename: string): string | undefined {
  const value = filename.trim();
  if (!value || value === '.svg') return '文件名不能为空';
  if (value.includes('/') || value.includes('\\') || value.includes('..')) return '文件名不能包含路径、斜杠或 ..';
  if (/^[.]/.test(value) || /[\u0000-\u001f\u007f]/.test(value)) return '文件名不能以点开头或包含控制字符';
  if (!/\.svg$/iu.test(value)) return '文件名必须以 .svg 结尾';
  if (!/^[\p{L}\p{N}_.-]+\.svg$/iu.test(value)) return '文件名只能包含中英文、数字、下划线、短横线和点';
  return undefined;
}

export function validateSvgFilename(filename: string): string {
  const value = filename.trim();
  const error = getSvgFilenameError(value);
  if (error) throw new Error(error);
  return value;
}
