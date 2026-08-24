import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.resolve(__dirname, '../resource/sony_lenses_calibrated_complete.csv');
const outputJsonPath = path.resolve(__dirname, '../src/data/lenses.json');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseCSV() {
  if (!fs.existsSync(csvFilePath)) {
    console.error(`CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(csvFilePath, 'utf-8');
  const lines = raw.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    console.error('CSV file is empty');
    process.exit(1);
  }

  const header = parseCSVLine(lines[0]);
  console.log(`Found header columns (${header.length}):`, header);

  const lenses = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < header.length) {
      continue;
    }

    const brandZh = cols[0] || '';
    const brandEn = cols[1] || '';
    const name = cols[2] || '';
    const type = cols[3] || '定焦'; // 定焦 / 变焦
    const focalMin = parseFloat(cols[4]) || 0;
    const focalMax = parseFloat(cols[5]) || 0;
    const focalDesc = cols[6] || '';
    const apertureDesc = cols[7] || '';
    const maxAperture = parseFloat(cols[8]) || 0;
    const focusType = cols[9] || '自动对焦 (AF)';
    const isAF = focusType.includes('AF') || focusType.includes('自动');
    const ossDesc = cols[10] || '不支持防抖';
    const hasOSS = ossDesc.includes('支持防抖') || ossDesc.includes('支持');
    const sharpnessStar = cols[11] || '';
    const sharpnessScore = parseFloat(cols[12]) || 0;
    const uniformityScore = parseFloat(cols[13]) || 0;
    const wideOpenScore = parseFloat(cols[14]) || 0;
    const caControlScore = parseFloat(cols[15]) || 0;
    const bokehScore = parseFloat(cols[16]) || 0;
    const distortionScore = parseFloat(cols[17]) || 0;
    const overallScore = parseFloat(cols[18]) || 0;
    const portabilityScore = parseFloat(cols[19]) || 0;
    const valueScore = parseFloat(cols[20]) || 0;
    const releaseDate = cols[21] || '';
    const minFocusDist = cols[22] || '';
    const weightG = parseFloat(cols[23]) || 0;
    const lengthMm = parseFloat(cols[24]) || 0;
    const filterThread = cols[25] || '';
    const priceCny = parseFloat(cols[26]) || 0;

    // 标签分析
    const isMacro = name.toLowerCase().includes('macro') || name.includes('微距');
    const isGM = brandZh.includes('GM') || name.includes(' GM');
    const isG = (brandZh.includes(' (Sony G)') || name.includes(' G ')) && !isGM;
    const isZeiss = brandZh.includes('Zeiss') || brandEn.toLowerCase().includes('zeiss');
    const isPZ = name.includes('PZ') || name.includes('电动');
    const isCine = name.includes(' T') || name.includes('Cine') || name.includes('电影');

    // 品牌大类归一化
    let brandCategory = 'other';
    const brandLower = (brandZh + ' ' + brandEn).toLowerCase();
    if (brandLower.includes('sony') || brandLower.includes('索尼')) {
      brandCategory = 'sony';
    } else if (brandLower.includes('sigma') || brandLower.includes('适马')) {
      brandCategory = 'sigma';
    } else if (brandLower.includes('tamron') || brandLower.includes('腾龙')) {
      brandCategory = 'tamron';
    } else if (brandLower.includes('zeiss') || brandLower.includes('蔡司')) {
      brandCategory = 'zeiss';
    } else if (brandLower.includes('samyang') || brandLower.includes('森养') || brandLower.includes('rokinon')) {
      brandCategory = 'samyang';
    } else if (brandLower.includes('viltrox') || brandLower.includes('唯卓仕')) {
      brandCategory = 'viltrox';
    } else if (brandLower.includes('laowa') || brandLower.includes('老蛙')) {
      brandCategory = 'laowa';
    } else if (brandLower.includes('voigtlander') || brandLower.includes('福伦达')) {
      brandCategory = 'voigtlander';
    } else if (brandLower.includes('ttartisan') || brandLower.includes('铭匠')) {
      brandCategory = 'ttartisan';
    } else if (brandLower.includes('7artisans') || brandLower.includes('七工匠')) {
      brandCategory = '7artisans';
    } else if (brandLower.includes('yongnuo') || brandLower.includes('永诺')) {
      brandCategory = 'yongnuo';
    }

    // 焦段类别分类
    const focalCategory = [];
    if (focalMin <= 24 || (focalMin < 28 && focalMax <= 28)) focalCategory.push('ultra-wide'); // 超广角
    if ((focalMin >= 24 && focalMin <= 35) || (focalMin <= 28 && focalMax >= 35)) focalCategory.push('wide'); // 广角
    if ((focalMin >= 35 && focalMin <= 60) || (focalMin <= 35 && focalMax >= 50)) focalCategory.push('standard'); // 标准/人文
    if ((focalMin >= 70 && focalMin <= 135) || (focalMin <= 70 && focalMax >= 135)) focalCategory.push('telephoto'); // 中远摄人像
    if (focalMax > 135 || focalMin > 135) focalCategory.push('super-telephoto'); // 远摄/超远摄

    const id = `lens-${i}-${name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;

    lenses.push({
      id,
      index: i,
      name,
      brandZh,
      brandEn,
      brandCategory,
      type, // 定焦 | 变焦
      focalMin,
      focalMax,
      focalDesc,
      focalCategory,
      apertureDesc,
      maxAperture,
      focusType,
      isAF,
      ossDesc,
      hasOSS,
      sharpnessStar,
      sharpnessScore,
      uniformityScore,
      wideOpenScore,
      caControlScore,
      bokehScore,
      distortionScore,
      overallScore,
      portabilityScore,
      valueScore,
      releaseDate,
      minFocusDist,
      weightG,
      lengthMm,
      filterThread,
      priceCny,
      isGM,
      isG,
      isZeiss,
      isMacro,
      isPZ,
      isCine,
    });
  }

  const outputDir = path.dirname(outputJsonPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputJsonPath, JSON.stringify(lenses, null, 2), 'utf-8');
  console.log(`Successfully generated ${lenses.length} lenses to ${outputJsonPath}`);
}

parseCSV();
