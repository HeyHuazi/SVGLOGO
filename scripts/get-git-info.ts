import { execSync } from 'child_process';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// 配置
const CONFIG_PATH = join(process.cwd(), 'src', 'config', 'git-info.json');

// 获取最新的 git 提交时间
function getLatestCommitDate(): string {
  try {
    // 获取最新的提交时间（包含时区信息）
    const gitLog = execSync('git log -1 --format="%ci"', { encoding: 'utf-8' }).trim();
    
    // 解析日期并格式化为 YYYY-MM-DD（保留原始时区的日期）
    const date = new Date(gitLog);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    console.log(`✅ 最新 git 提交时间: ${formattedDate}`);
    console.log(`   原始时间: ${gitLog}`);
    
    return formattedDate;
  } catch (error) {
    console.warn('⚠️  无法获取 git 提交时间，使用当前日期作为回退');
    console.warn(`   错误: ${error instanceof Error ? error.message : String(error)}`);
    
    // 回退到当前日期
    const fallbackDate = new Date().toISOString().split('T')[0];
    console.log(`   回退日期: ${fallbackDate}`);
    
    return fallbackDate;
  }
}

// 写入配置文件
async function writeConfig(commitDate: string): Promise<void> {
  const config = {
    lastCommitDate: commitDate
  };
  
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`📝 配置已写入: ${CONFIG_PATH}`);
}

// 主函数
async function main(): Promise<void> {
  console.log('🔍 获取 git 提交信息...\n');
  
  const commitDate = getLatestCommitDate();
  await writeConfig(commitDate);
  
  console.log('\n✨ 完成！');
}

main().catch(console.error);
