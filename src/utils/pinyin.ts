// Pinyin lookup table for Chinese characters used in SVG titles
const PINYIN_MAP: Record<string, string> = {
  "丁": "ding", "万": "wan", "三": "san", "上": "shang", "下": "xia",
  "不": "bu", "与": "yu", "世": "shi", "业": "ye", "东": "dong",
  "严": "yan", "中": "zhong", "丰": "feng", "临": "lin", "丸": "wan",
  "丹": "dan", "为": "wei", "丽": "li", "义": "yi", "之": "zhi",
  "乌": "wu", "乎": "hu", "乐": "le", "九": "jiu", "书": "shu",
  "乾": "qian", "事": "shi", "云": "yun", "互": "hu", "五": "wu",
  "亚": "ya", "交": "jiao", "产": "chan", "京": "jing", "亮": "liang",
  "人": "ren", "今": "jin", "仑": "lun", "他": "ta", "付": "fu",
  "任": "ren", "份": "fen", "企": "qi", "众": "zhong", "优": "you",
  "伙": "huo", "会": "hui", "传": "chuan", "伴": "ban", "低": "di",
  "体": "ti", "余": "yu", "作": "zuo", "促": "cu", "保": "bao",
  "信": "xin", "倍": "bei", "候": "hou", "借": "jie", "健": "jian",
  "储": "chu", "儿": "er", "元": "yuan", "光": "guang", "克": "ke",
  "公": "gong", "六": "liu", "兰": "lan", "关": "guan", "兴": "xing",
  "其": "qi", "内": "nei", "再": "zai", "农": "nong", "冰": "bing",
  "冷": "leng", "冻": "dong", "减": "jian", "凡": "fan", "凤": "feng",
  "凯": "kai", "出": "chu", "刀": "dao", "创": "chuang", "初": "chu",
  "别": "bie", "刻": "ke", "剧": "ju", "力": "li", "动": "dong",
  "勒": "le", "勘": "kan", "包": "bao", "化": "hua", "北": "bei",
  "区": "qu", "医": "yi", "千": "qian", "半": "ban", "华": "hua",
  "南": "nan", "博": "bo", "卡": "ka", "卫": "wei", "即": "ji",
  "卷": "juan", "厂": "chang", "原": "yuan", "厦": "xia", "友": "you",
  "发": "fa", "口": "kou", "古": "gu", "可": "ke", "台": "tai",
  "号": "hao", "司": "si", "合": "he", "吉": "ji", "同": "tong",
  "后": "hou", "吟": "yin", "呗": "bei", "周": "zhou", "和": "he",
  "哈": "ha", "哔": "bi", "哩": "li", "唐": "tang", "商": "shang",
  "喜": "xi", "嘉": "jia", "嘴": "zui", "四": "si", "团": "tuan",
  "国": "guo", "圣": "sheng", "地": "di", "圳": "zhen", "坊": "fang",
  "城": "cheng", "基": "ji", "堂": "tang", "塔": "ta", "增": "zeng",
  "墨": "mo", "士": "shi", "复": "fu", "夏": "xia", "外": "wai",
  "多": "duo", "大": "da", "天": "tian", "太": "tai", "央": "yang",
  "头": "tou", "夸": "kua", "奇": "qi", "奈": "nai", "契": "qi",
  "奥": "ao", "好": "hao", "妆": "zhuang", "妙": "miao", "姆": "mu",
  "威": "wei", "娇": "jiao", "娜": "na", "媒": "mei", "子": "zi",
  "字": "zi", "学": "xue", "宁": "ning", "宇": "yu", "安": "an",
  "宏": "hong", "宙": "zhou", "定": "ding", "宜": "yi", "宝": "bao",
  "实": "shi", "客": "ke", "害": "hai", "家": "jia", "容": "rong",
  "宾": "bin", "密": "mi", "富": "fu", "寒": "han", "对": "dui",
  "导": "dao", "寿": "shou", "小": "xiao", "少": "shao", "尔": "er",
  "尘": "chen", "尼": "ni", "展": "zhan", "山": "shan", "岛": "dao",
  "岭": "ling", "峡": "xia", "川": "chuan", "州": "zhou", "工": "gong",
  "巨": "ju", "巴": "ba", "市": "shi", "师": "shi", "希": "xi",
  "帝": "di", "干": "gan", "平": "ping", "幸": "xing", "广": "guang",
  "庄": "zhuang", "庆": "qing", "库": "ku", "庙": "miao", "府": "fu",
  "度": "du", "康": "kang", "廊": "lang", "建": "jian", "开": "kai",
  "引": "yin", "张": "zhang", "强": "qiang", "彩": "cai", "影": "ying",
  "微": "wei", "德": "de", "徽": "hui", "快": "kuai", "思": "si",
  "性": "xing", "恒": "heng", "息": "xi", "悦": "yue", "意": "yi",
  "慧": "hui", "懂": "dong", "戈": "ge", "戏": "xi", "成": "cheng",
  "手": "shou", "扑": "pu", "承": "cheng", "技": "ji", "抖": "dou",
  "抚": "fu", "报": "bao", "拉": "la", "招": "zhao", "持": "chi",
  "振": "zhen", "控": "kong", "播": "bo", "擎": "qing", "支": "zhi",
  "放": "fang", "政": "zheng", "教": "jiao", "文": "wen", "斗": "dou",
  "斯": "si", "新": "xin", "方": "fang", "施": "shi", "旅": "lv",
  "族": "zu", "无": "wu", "日": "ri", "旦": "dan", "旭": "xu",
  "旱": "han", "时": "shi", "明": "ming", "昆": "kun", "易": "yi",
  "星": "xing", "春": "chun", "昱": "yu", "晋": "jin", "晨": "chen",
  "普": "pu", "智": "zhi", "暨": "ji", "暴": "bao", "曲": "qu",
  "月": "yue", "有": "you", "朗": "lang", "朝": "chao", "木": "mu",
  "本": "ben", "术": "shu", "机": "ji", "村": "cun", "条": "tiao",
  "杨": "yang", "杭": "hang", "杰": "jie", "极": "ji", "构": "gou",
  "林": "lin", "枝": "zhi", "枣": "zao", "染": "ran", "柳": "liu",
  "柴": "chai", "标": "biao", "格": "ge", "桂": "gui", "梦": "meng",
  "梵": "fan", "森": "sen", "植": "zhi", "樊": "fan", "橙": "cheng",
  "欧": "ou", "正": "zheng", "武": "wu", "比": "bi", "毛": "mao",
  "氏": "shi", "民": "min", "气": "qi", "氧": "yang", "氪": "ke",
  "水": "shui", "汇": "hui", "汉": "han", "江": "jiang", "污": "wu",
  "汤": "tang", "汽": "qi", "沂": "yi", "沙": "sha", "沧": "cang",
  "河": "he", "油": "you", "治": "zhi", "沿": "yan", "泉": "quan",
  "法": "fa", "波": "bo", "泰": "tai", "泸": "lu", "洁": "jie",
  "洋": "yang", "洛": "luo", "津": "jin", "洪": "hong", "流": "liu",
  "测": "ce", "济": "ji", "浓": "nong", "浙": "zhe", "浦": "pu",
  "浩": "hao", "浪": "lang", "浮": "fu", "海": "hai", "消": "xiao",
  "涝": "lao", "润": "run", "液": "ye", "深": "shen", "混": "hun",
  "清": "qing", "渤": "bo", "温": "wen", "港": "gang", "湖": "hu",
  "湘": "xiang", "湾": "wan", "源": "yuan", "溪": "xi", "滇": "dian",
  "滨": "bin", "漾": "yang", "潍": "wei", "潮": "chao", "澳": "ao",
  "火": "huo", "灰": "hui", "灵": "ling", "灾": "zai", "炎": "yan",
  "烟": "yan", "热": "re", "焦": "jiao", "照": "zhao", "爱": "ai",
  "牌": "pai", "牙": "ya", "牛": "niu", "物": "wu", "玉": "yu",
  "玖": "jiu", "玛": "ma", "现": "xian", "珀": "po", "珊": "shan",
  "珠": "zhu", "球": "qiu", "理": "li", "瑚": "hu", "瑞": "rui",
  "瓜": "gua", "瓣": "ban", "甘": "gan", "生": "sheng", "用": "yong",
  "电": "dian", "画": "hua", "疆": "jiang", "疗": "liao", "白": "bai",
  "百": "bai", "的": "de", "皇": "huang", "盈": "ying", "益": "yi",
  "盘": "pan", "盛": "sheng", "目": "mu", "知": "zhi", "石": "shi",
  "研": "yan", "础": "chu", "碧": "bi", "磁": "ci", "社": "she",
  "祉": "zhi", "祥": "xiang", "福": "fu", "秀": "xiu", "秋": "qiu",
  "科": "ke", "秦": "qin", "积": "ji", "移": "yi", "程": "cheng",
  "稠": "chou", "究": "jiu", "穷": "qiong", "穹": "qiong", "空": "kong",
  "立": "li", "童": "tong", "竹": "zhu", "等": "deng", "米": "mi",
  "粤": "yue", "粮": "liang", "系": "xi", "紫": "zi", "红": "hong",
  "约": "yue", "纪": "ji", "纸": "zhi", "线": "xian", "绍": "shao",
  "经": "jing", "结": "jie", "续": "xu", "维": "wei", "绵": "mian",
  "网": "wang", "罗": "luo", "美": "mei", "羽": "yu", "翻": "fan",
  "老": "lao", "联": "lian", "肃": "su", "肌": "ji", "股": "gu",
  "肤": "fu", "育": "yu", "能": "neng", "脉": "mai", "脑": "nao",
  "腾": "teng", "臣": "chen", "自": "zi", "臭": "chou", "舒": "shu",
  "航": "hang", "良": "liang", "节": "jie", "芙": "fu", "芝": "zhi",
  "芦": "lu", "芭": "ba", "芯": "xin", "花": "hua", "苏": "su",
  "茂": "mao", "范": "fan", "茱": "zhu", "茵": "yin", "茶": "cha",
  "草": "cao", "荣": "rong", "药": "yao", "莉": "li", "莎": "sha",
  "莞": "guan", "莫": "mo", "莱": "lai", "莲": "lian", "营": "ying",
  "萨": "sa", "葫": "hu", "蒙": "meng", "蓄": "xu", "蓝": "lan",
  "蔻": "kou", "藏": "cang", "虎": "hu", "蚁": "yi", "蚂": "ma",
  "蜓": "ting", "蜻": "qing", "蝶": "die", "融": "rong", "螺": "luo",
  "行": "xing", "衡": "heng", "西": "xi", "视": "shi", "计": "ji",
  "讯": "xun", "设": "she", "识": "shi", "译": "yi", "诗": "shi",
  "语": "yu", "诺": "nuo", "谜": "mi", "谢": "xie", "谱": "pu",
  "豆": "dou", "负": "fu", "贡": "gong", "财": "cai", "责": "ze",
  "货": "huo", "质": "zhi", "贫": "pin", "贵": "gui", "贸": "mao",
  "费": "fei", "资": "zi", "赛": "sai", "赫": "he", "超": "chao",
  "路": "lu", "跳": "tiao", "车": "che", "辽": "liao", "达": "da",
  "迈": "mai", "运": "yun", "进": "jin", "远": "yuan", "连": "lian",
  "迪": "di", "适": "shi", "通": "tong", "遂": "sui", "道": "dao",
  "邢": "xing", "邮": "you", "邯": "han", "郑": "zheng", "部": "bu",
  "郸": "dan", "都": "du", "鄂": "e", "酷": "ku", "里": "li",
  "重": "zhong", "金": "jin", "钉": "ding", "钥": "yao", "铁": "tie",
  "铭": "ming", "银": "yin", "链": "lian", "锁": "suo", "锦": "jin",
  "长": "chang", "门": "men", "问": "wen", "阜": "fu", "防": "fang",
  "阳": "yang", "阿": "a", "际": "ji", "陆": "lu", "降": "jiang",
  "限": "xian", "陕": "shan", "院": "yuan", "险": "xian", "隆": "long",
  "雅": "ya", "集": "ji", "雨": "yu", "雪": "xue", "零": "ling",
  "雷": "lei", "雹": "bao", "雾": "wu", "霜": "shuang", "霾": "mai",
  "青": "qing", "靖": "jing", "面": "mian", "鞍": "an", "韦": "wei",
  "音": "yin", "韵": "yun", "顶": "ding", "顺": "shun", "频": "pin",
  "颜": "yan", "额": "e", "风": "feng", "飞": "fei", "饥": "ji",
  "饮": "yin", "饶": "rao", "饿": "e", "首": "shou", "香": "xiang",
  "马": "ma", "骄": "jiao", "鱼": "yu", "鲁": "lu", "鸣": "ming",
  "鹅": "e", "鹏": "peng", "麟": "lin", "麻": "ma", "黄": "huang",
  "黎": "li", "黛": "dai", "齐": "qi", "龙": "long"
};

/**
 * Convert Chinese text to pinyin (full, no tones).
 * Non-Chinese characters are kept as-is.
 * Example: "小米" → "xiaomi", "华为" → "huawei"
 */
export function toPinyin(text: string): string {
  let result = '';
  for (const ch of text) {
    const py = PINYIN_MAP[ch];
    result += py || ch;
  }
  return result.toLowerCase();
}

/**
 * Get pinyin initials (first letter of each Chinese character).
 * Example: "小米" → "xm", "华为" → "hw"
 */
export function getPinyinInitials(text: string): string {
  let result = '';
  for (const ch of text) {
    const py = PINYIN_MAP[ch];
    if (py) {
      result += py[0];
    }
  }
  return result.toLowerCase();
}

/**
 * Check if a search query matches a title via pinyin.
 * Matches against: original title, full pinyin, pinyin initials.
 */
export function pinyinMatch(title: string, query: string): boolean {
  const q = query.toLowerCase();
  // Direct title match (original behavior)
  if (title.toLowerCase().includes(q)) return true;
  // Full pinyin match
  if (toPinyin(title).includes(q)) return true;
  // Pinyin initials match
  if (getPinyinInitials(title).includes(q)) return true;
  return false;
}
