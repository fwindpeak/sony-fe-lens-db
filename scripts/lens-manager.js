import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/lenses.json');
const csvOutputPath = path.resolve(__dirname, '../resource/sony_lenses_calibrated_complete.csv');
const sqliteSqlPath = path.resolve(__dirname, '../dist/lenses.sql');
const sqliteDbPath = path.resolve(__dirname, '../dist/lenses.db');

function loadLenses() {
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at ${jsonPath}`);
  }
  return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
}

// 1. 数据校验器
export function validateDatabase() {
  const lenses = loadLenses();
  console.log(`\n🔍 开始全面校验索尼 FE 镜头数据库 (共 ${lenses.length} 款镜头)...`);

  const errors = [];
  const warnings = [];
  const seenIds = new Set();
  const seenNames = new Set();

  lenses.forEach((lens, idx) => {
    const loc = `[#${lens.index || idx + 1}] ${lens.name || '未知镜头'}`;

    // 必填字段检查
    if (!lens.id) errors.push(`${loc}: 缺失 id`);
    if (!lens.name) errors.push(`${loc}: 缺失 name`);
    if (!lens.brandCategory) errors.push(`${loc}: 缺失 brandCategory`);

    // 重复性检查
    if (lens.id) {
      if (seenIds.has(lens.id)) errors.push(`${loc}: 重复的 id "${lens.id}"`);
      seenIds.add(lens.id);
    }
    if (lens.name) {
      if (seenNames.has(lens.name)) warnings.push(`${loc}: 重复的镜头名称 "${lens.name}"`);
      seenNames.add(lens.name);
    }

    // 评分区间合法性检查 (严格严控在 1.0 ~ 5.0)
    const scoreFields = [
      'sharpnessScore',
      'uniformityScore',
      'wideOpenScore',
      'caControlScore',
      'bokehScore',
      'distortionScore',
    ];

    scoreFields.forEach((field) => {
      const val = lens[field];
      if (typeof val !== 'number' || isNaN(val)) {
        errors.push(`${loc}: 字段 ${field} 不是有效数字 (${val})`);
      } else if (val < 1.0 || val > 5.0) {
        errors.push(`${loc}: 评分越界！${field} = ${val} (必须在 1.0 ~ 5.0 之间)`);
      }
    });

    if (lens.overallScore < 0 || lens.overallScore > 100 || isNaN(lens.overallScore)) {
      errors.push(`${loc}: overallScore 越界 (${lens.overallScore})`);
    }

    // 价格逻辑检查
    if (lens.priceUsed && lens.priceNew && lens.priceUsed > lens.priceNew * 1.05) {
      warnings.push(`${loc}: 二手价格 (¥${lens.priceUsed}) 高于新品价格 (¥${lens.priceNew})`);
    }
  });

  if (warnings.length > 0) {
    console.log(`⚠️  发现 ${warnings.length} 条数据告警:`);
    warnings.slice(0, 10).forEach((w) => console.log('   ' + w));
    if (warnings.length > 10) console.log(`   ... 还有 ${warnings.length - 10} 条`);
  }

  if (errors.length > 0) {
    console.error(`❌ 校验失败！发现 ${errors.length} 处严重错误:`);
    errors.forEach((e) => console.error('   ' + e));
    process.exit(1);
  } else {
    console.log(`✅ 校验通过！0 处错误，数据完整合规，评分指标全部严控在 1.0~5.0 范围内。\n`);
  }
}

// 2. 导出为 CSV 文件
export function exportToCSV() {
  const lenses = loadLenses();
  console.log(`\n📦 正在导出为规范 CSV 格式: ${csvOutputPath}...`);

  const headers = [
    '品牌',
    '品牌英文',
    '镜头名称',
    '类型',
    '焦段_Min',
    '焦段_Max',
    '焦段描述',
    '光圈描述',
    '最大光圈数值',
    '对焦方式',
    '光学防抖',
    '锐度星级',
    '综合加权锐度均值',
    '全画面一致性评分',
    '全开可用度评分',
    '色散控制评分',
    '虚化氛围评分',
    '畸变暗角控制评分',
    '综合光学总分_100',
    '便携指数',
    '性价比指数',
    '上市时间',
    '最近对焦距离_cm',
    '重量_g',
    '镜头长度_mm',
    '滤镜口径_mm',
    '参考价格_元',
    '二手参考价_元',
    '全新参考价_元',
    '香港参考价_HKD',
    '官方指导价_元',
    '官网链接',
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = [headers.join(',')];

  lenses.forEach((lens) => {
    const row = [
      escapeCSV(lens.brandZh),
      escapeCSV(lens.brandEn),
      escapeCSV(lens.name),
      escapeCSV(lens.type),
      escapeCSV(lens.focalMin),
      escapeCSV(lens.focalMax),
      escapeCSV(lens.focalDesc),
      escapeCSV(lens.apertureDesc),
      escapeCSV(lens.maxAperture),
      escapeCSV(lens.focusType),
      escapeCSV(lens.ossDesc),
      escapeCSV(lens.sharpnessStar),
      escapeCSV(lens.sharpnessScore),
      escapeCSV(lens.uniformityScore),
      escapeCSV(lens.wideOpenScore),
      escapeCSV(lens.caControlScore),
      escapeCSV(lens.bokehScore),
      escapeCSV(lens.distortionScore),
      escapeCSV(lens.overallScore),
      escapeCSV(lens.portabilityScore),
      escapeCSV(lens.valueScore),
      escapeCSV(lens.releaseDate),
      escapeCSV(lens.minFocusDist),
      escapeCSV(lens.weightG),
      escapeCSV(lens.lengthMm),
      escapeCSV(lens.filterThread),
      escapeCSV(lens.priceCny),
      escapeCSV(lens.priceUsed || 0),
      escapeCSV(lens.priceNew || lens.priceCny),
      escapeCSV(lens.priceHk || 0),
      escapeCSV(lens.priceMsrp || lens.priceCny),
      escapeCSV(lens.officialUrl || ''),
    ];
    rows.push(row.join(','));
  });

  const dir = path.dirname(csvOutputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(csvOutputPath, '\ufeff' + rows.join('\n'), 'utf-8'); // 加 BOM 保证 Excel 不乱码
  console.log(`✅ 成功导出 ${lenses.length} 款镜头数据至 CSV 文件！\n`);
}

// 3. 导出为 SQLite 数据库
export function exportToSQLite() {
  const lenses = loadLenses();
  const distDir = path.dirname(sqliteDbPath);
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  console.log(`\n🗄️ 正在生成 SQLite 数据库: ${sqliteDbPath}...`);

  const escapeSQL = (val) => {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return val ? 1 : 0;
    if (Array.isArray(val)) return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
    return `'${String(val).replace(/'/g, "''")}'`;
  };

  const sqlStatements = [
    'BEGIN TRANSACTION;',
    'DROP TABLE IF EXISTS lenses;',
    `CREATE TABLE lenses (
      id TEXT PRIMARY KEY,
      index_num INTEGER,
      name TEXT NOT NULL,
      brand_zh TEXT,
      brand_en TEXT,
      brand_category TEXT,
      type TEXT,
      focal_min REAL,
      focal_max REAL,
      focal_desc TEXT,
      focal_category TEXT,
      aperture_desc TEXT,
      max_aperture REAL,
      focus_type TEXT,
      is_af INTEGER,
      oss_desc TEXT,
      has_oss INTEGER,
      sharpness_star TEXT,
      sharpness_score REAL,
      uniformity_score REAL,
      wide_open_score REAL,
      ca_control_score REAL,
      bokeh_score REAL,
      distortion_score REAL,
      overall_score REAL,
      portability_score REAL,
      value_score REAL,
      release_date TEXT,
      min_focus_dist TEXT,
      weight_g REAL,
      length_mm REAL,
      filter_thread TEXT,
      price_cny REAL,
      price_used REAL,
      price_new REAL,
      price_hk REAL,
      price_msrp REAL,
      official_url TEXT,
      is_gm INTEGER,
      is_g INTEGER,
      is_zeiss INTEGER,
      is_macro INTEGER,
      is_pz INTEGER,
      is_cine INTEGER
    );`,
    'CREATE INDEX IF NOT EXISTS idx_brand ON lenses(brand_category);',
    'CREATE INDEX IF NOT EXISTS idx_type ON lenses(type);',
    'CREATE INDEX IF NOT EXISTS idx_overall_score ON lenses(overall_score);',
    'CREATE INDEX IF NOT EXISTS idx_price_used ON lenses(price_used);',
  ];

  lenses.forEach((l) => {
    const vals = [
      escapeSQL(l.id),
      escapeSQL(l.index),
      escapeSQL(l.name),
      escapeSQL(l.brandZh),
      escapeSQL(l.brandEn),
      escapeSQL(l.brandCategory),
      escapeSQL(l.type),
      escapeSQL(l.focalMin),
      escapeSQL(l.focalMax),
      escapeSQL(l.focalDesc),
      escapeSQL(l.focalCategory),
      escapeSQL(l.apertureDesc),
      escapeSQL(l.maxAperture),
      escapeSQL(l.focusType),
      escapeSQL(l.isAF),
      escapeSQL(l.ossDesc),
      escapeSQL(l.hasOSS),
      escapeSQL(l.sharpnessStar),
      escapeSQL(l.sharpnessScore),
      escapeSQL(l.uniformityScore),
      escapeSQL(l.wideOpenScore),
      escapeSQL(l.caControlScore),
      escapeSQL(l.bokehScore),
      escapeSQL(l.distortionScore),
      escapeSQL(l.overallScore),
      escapeSQL(l.portabilityScore),
      escapeSQL(l.valueScore),
      escapeSQL(l.releaseDate),
      escapeSQL(l.minFocusDist),
      escapeSQL(l.weightG),
      escapeSQL(l.lengthMm),
      escapeSQL(l.filterThread),
      escapeSQL(l.priceCny),
      escapeSQL(l.priceUsed || 0),
      escapeSQL(l.priceNew || l.priceCny),
      escapeSQL(l.priceHk || 0),
      escapeSQL(l.priceMsrp || l.priceCny),
      escapeSQL(l.officialUrl || ''),
      escapeSQL(l.isGM),
      escapeSQL(l.isG),
      escapeSQL(l.isZeiss),
      escapeSQL(l.isMacro),
      escapeSQL(l.isPZ),
      escapeSQL(l.isCine),
    ];
    sqlStatements.push(`INSERT INTO lenses VALUES (${vals.join(', ')});`);
  });

  sqlStatements.push('COMMIT;');

  const sqlContent = sqlStatements.join('\n');
  fs.writeFileSync(sqliteSqlPath, sqlContent, 'utf-8');

  try {
    if (fs.existsSync(sqliteDbPath)) {
      fs.unlinkSync(sqliteDbPath);
    }
    execSync(`sqlite3 "${sqliteDbPath}" < "${sqliteSqlPath}"`);
    console.log(`✅ 成功生成 SQLite 数据库文件: ${sqliteDbPath}`);
    console.log(`✅ 同步生成 SQL 导入文件: ${sqliteSqlPath}\n`);
  } catch (err) {
    console.warn(`⚠️  调用本地 sqlite3 生成 .db 失败，但 .sql 脚本已成功生成: ${sqliteSqlPath}`, err.message);
  }
}

// 主入口
const arg = process.argv[2] || '--validate';

if (arg === '--validate') {
  validateDatabase();
} else if (arg === '--export-csv') {
  exportToCSV();
} else if (arg === '--export-sqlite') {
  exportToSQLite();
} else if (arg === '--all') {
  validateDatabase();
  exportToCSV();
  exportToSQLite();
} else {
  console.log(`
使用方法:
  node scripts/lens-manager.js --validate       校验数据库合法性
  node scripts/lens-manager.js --export-csv    导出为规范 CSV 格式
  node scripts/lens-manager.js --export-sqlite 导出为 SQLite 数据库
  node scripts/lens-manager.js --all           执行全部校验与双导出
  `);
}
