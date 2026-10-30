import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/lenses.json');

// 虚假镜头/AI幻觉黑名单关键词或全名
const FAKE_LENS_PATTERNS = [
  /FE 50-150mm F2\.0 GM/i,
  /FE 100-400mm F4\.5 GM OSS AF/i,
  /35mm F1\.2 DG II Art/i,
  /35mm F1\.4 DG HSM Art II/i,
  /135mm F1\.4 DG Art/i,
  /200mm F2 DG OS Sports/i,
  /20-200mm F3\.5-6\.3 DG Contemporary/i,
  /300-600mm F4 DG OS Sports/i,
  /12-20mm F2\.8 AF/i,
  /16-30mm F2\.8 Di III VXD G2/i,
  /35-100mm F\/2\.8 Di III VXD/i,
  /16mm F2\.8 PE AF/i,
  /35mm F1\.8 PE AF/i,
  /85mm F1\.8 PE AF/i,
  /14-24mm F2\.8 AF/i && /samyang/i,
  /60-180mm F2\.8 AF/i,
  /AF 14mm F4\.0 Air/i,
  /AF 26mm F2\.8 EVO/i,
  /AF 35\/1\.2 LAB\(N\)/i,
  /AF 35\/1\.8 EVO/i,
  /AF 50\/2\.0 Air/i,
  /AF 55\/1\.8 EVO/i,
  /AF 85\/1\.4 Pro/i,
  /135mm F1\.8 MAX AF/i,
  /10mm F2\.5 Fisheye AF/i,
  /SEPTON 40mm F\/2/i,
  /Portrait Heliar 75mm F\/1\.8/i,
  /75mm F1\.8 AF/i && /voigtlander/i,
  /12mm F2\.8 Fisheye AF/i,
  /50mm F1\.8 Neo AF/i,
  /85mm F1\.8 Neo AF/i,
  /150mm F5\.6 Reflex AF/i,
  /24-50mm F2\.8 AF/i && /thypoch/i,
  /50mm F1\.2 MS AF/i,
  /85mm F1\.2 MS AF/i,
  /85mm F1\.2 Moonlit AF/i,
  /55mm F1\.8 VE 三周年纪念版/i,
  /85mm F1\.8 AF 三周年纪念版/i,
  /Otus ML/i,
];

function isFakeLens(lens) {
  // 检查上市时间异常未来的虚构镜头
  if (lens.releaseDate && parseFloat(lens.releaseDate) > 2026.11) {
    return true;
  }
  for (const pattern of FAKE_LENS_PATTERNS) {
    if (pattern.test(lens.name)) {
      return true;
    }
  }
  return false;
}

// 市场二手/新品/香港价格估算与校准规则
function calibrateMarketPrices(lens) {
  const msrp = lens.priceCny > 0 ? lens.priceCny : 3000;
  const releaseYear = parseFloat(lens.releaseDate) || 2020;
  const ageYears = Math.max(0, 2026.7 - releaseYear);

  let priceUsed = 0;
  let priceNew = 0;
  let priceHk = 0;

  // 特殊镜头精确行情映射 (元)
  const preciseMarket = {
    // 索尼原厂热门
    'FE 50mm F1.8 AF': { used: 950, new: 1450, hk: 1400, msrp: 1700 },
    'FE 85mm F1.8 AF': { used: 1850, new: 2450, hk: 2350, msrp: 3600 },
    'FE 35mm F1.8 AF': { used: 2600, new: 3500, hk: 3300, msrp: 4300 },
    'FE 28mm F2 AF': { used: 1100, new: 1800, hk: 1750, msrp: 2600 },
    'FE 28-60mm F4-5.6 AF': { used: 850, new: 1350, hk: 1300, msrp: 1600 },
    'FE 28-70mm F3.5-5.6 OSS AF': { used: 650, new: 1100, hk: 1050, msrp: 1750 },
    'FE 24-105mm F4 G OSS AF': { used: 4600, new: 5900, hk: 5800, msrp: 7000 },
    'FE 20-70mm F4 G AF': { used: 5200, new: 6400, hk: 6200, msrp: 7200 },
    'FE 20mm F1.8 G AF': { used: 4100, new: 5200, hk: 5000, msrp: 7500 },
    'FE 24mm F2.8 G AF': { used: 2300, new: 3100, hk: 3000, msrp: 4700 },
    'FE 40mm F2.5 G AF': { used: 2500, new: 3300, hk: 3200, msrp: 4700 },
    'FE 50mm F2.5 G AF': { used: 2500, new: 3300, hk: 3200, msrp: 4700 },
    'FE 90mm F2.8 Macro G OSS AF': { used: 3900, new: 5300, hk: 5200, msrp: 6900 },
    'FE 70-200mm F4 G OSS AF': { used: 4100, new: 5800, hk: 5600, msrp: 7800 },
    'FE 70-200mm F4 Macro G OSS II AF': { used: 7600, new: 8900, hk: 8800, msrp: 9870 },
    'FE 200-600mm F5.6-6.3 G OSS AF': { used: 8800, new: 10500, hk: 10200, msrp: 11500 },
    'FE 16-35mm F4 ZA OSS AF': { used: 2800, new: 4200, hk: 4100, msrp: 7600 },
    'FE 24-70mm F4 ZA OSS AF': { used: 1900, new: 3100, hk: 3000, msrp: 5400 },
    'FE 35mm F2.8 ZA AF': { used: 1700, new: 2600, hk: 2500, msrp: 3900 },
    'FE 55mm F1.8 ZA AF': { used: 2000, new: 2800, hk: 2700, msrp: 3800 },
    'FE 14mm F1.8 GM AF': { used: 6800, new: 8800, hk: 8600, msrp: 11300 },
    'FE 24mm F1.4 GM AF': { used: 5500, new: 7600, hk: 7400, msrp: 10300 },
    'FE 35mm F1.4 GM AF': { used: 6800, new: 8600, hk: 8400, msrp: 10700 },
    'FE 50mm F1.2 GM AF': { used: 10200, new: 12600, hk: 12200, msrp: 15500 },
    'FE 50mm F1.4 GM AF': { used: 6800, new: 8200, hk: 8000, msrp: 9300 },
    'FE 85mm F1.4 GM AF': { used: 4600, new: 6800, hk: 6500, msrp: 11000 },
    'FE 85mm F1.4 GM II AF': { used: 10800, new: 12200, hk: 11800, msrp: 12400 },
    'FE 135mm F1.8 GM AF': { used: 7200, new: 9200, hk: 9000, msrp: 13500 },
    'FE 16-35mm F2.8 GM AF': { used: 7200, new: 9500, hk: 9200, msrp: 14500 },
    'FE 16-35mm F2.8 GM II AF': { used: 12800, new: 14800, hk: 14200, msrp: 16500 },
    'FE 24-70mm F2.8 GM AF': { used: 5800, new: 8600, hk: 8200, msrp: 15000 },
    'FE 24-70mm F2.8 GM II AF': { used: 11600, new: 13600, hk: 13200, msrp: 15500 },
    'FE 70-200mm F2.8 GM OSS AF': { used: 6800, new: 9500, hk: 9200, msrp: 16000 },
    'FE 70-200mm F2.8 GM OSS II AF': { used: 14500, new: 16800, hk: 16200, msrp: 18999 },
    'FE 100-400mm F4.5-5.6 GM OSS AF': { used: 10500, new: 13200, hk: 12800, msrp: 16000 },

    // 适马热门
    '14mm F1.4 DG DN AF': { used: 6800, new: 8200, hk: 8000, msrp: 9300 },
    '15mm F1.4 DG DN Fisheye AF': { used: 9200, new: 11500, hk: 11000, msrp: 13000 },
    '20mm F1.4 DG DN Art AF': { used: 4300, new: 5300, hk: 5100, msrp: 6000 },
    '24mm F1.4 DG DN Art AF': { used: 3900, new: 4800, hk: 4600, msrp: 5200 },
    '35mm F1.2 DG DN Art AF': { used: 5200, new: 6800, hk: 6600, msrp: 7700 },
    '35mm F1.4 DG DN AF': { used: 3900, new: 4800, hk: 4600, msrp: 5600 },
    '50mm F1.2 DG DN AF': { used: 7600, new: 9200, hk: 8900, msrp: 9999 },
    '50mm F1.4 DG DN AF': { used: 3800, new: 4600, hk: 4400, msrp: 5000 },
    '85mm F1.4 DG DN AF': { used: 4500, new: 5600, hk: 5400, msrp: 6800 },
    '105mm F2.8 DG DN Macro AF': { used: 3700, new: 4600, hk: 4400, msrp: 5200 },
    '14-24mm F2.8 DG DN Art AF': { used: 5200, new: 6600, hk: 6400, msrp: 7900 },
    '16-28mm F2.8 DG DN Contemporary AF': { used: 3800, new: 4600, hk: 4400, msrp: 5200 },
    '24-70mm F2.8 DG DN Art AF': { used: 4500, new: 5600, hk: 5400, msrp: 6800 },
    '24-70mm F2.8 DG DN II Art AF': { used: 6800, new: 7999, hk: 7800, msrp: 7999 },
    '28-70mm F2.8 DG DN Contemporary AF': { used: 3400, new: 4200, hk: 4000, msrp: 4800 },
    '28-45mm F1.8 DG DN Art AF': { used: 6800, new: 7999, hk: 7800, msrp: 7999 },
    '28-105mm F2.8 DG DN Art AF': { used: 7800, new: 8999, hk: 8800, msrp: 9499 },
    '70-200mm F2.8 DG DN OS Sports AF': { used: 7600, new: 9200, hk: 8900, msrp: 10500 },
    '100-400mm F5-6.3 DG DN Contemporary AF': { used: 4100, new: 5100, hk: 4900, msrp: 5800 },
    '500mm F5.6 DG DN OS Sports AF': { used: 16500, new: 18999, hk: 18500, msrp: 19999 },

    // 腾龙热门
    '17-28mm F2.8 Di III RXD AF': { used: 3400, new: 4500, hk: 4300, msrp: 5000 },
    '20-40mm F2.8 Di III VXD AF': { used: 3200, new: 4100, hk: 3900, msrp: 5000 },
    '28-75mm F2.8 Di III RXD AF': { used: 3100, new: 4200, hk: 4000, msrp: 5200 },
    '28-75mm F2.8 Di III VXD G2 AF': { used: 4200, new: 4999, hk: 4800, msrp: 6200 },
    '28-200mm F2.8-5.6 Di III RXD AF': { used: 3800, new: 4800, hk: 4600, msrp: 5500 },
    '35-150mm F2-2.8 Di III VXD AF': { used: 7800, new: 9800, hk: 9400, msrp: 10700 },
    '70-180mm F2.8 Di III VXD AF': { used: 4500, new: 5800, hk: 5500, msrp: 6600 },
    '70-180mm F2.8 Di III VC VXD G2 AF': { used: 6800, new: 7999, hk: 7700, msrp: 9000 },
    '50-400mm F4.5-6.3 Di III VC VXD AF': { used: 6200, new: 7500, hk: 7200, msrp: 9000 },
    '150-500mm F5-6.7 Di III VC VXD AF': { used: 5500, new: 6800, hk: 6500, msrp: 8000 },

    // 唯卓仕热门
    'AF 16/1.8 FE': { used: 2400, new: 3199, hk: 3100, msrp: 3500 },
    'AF 20/2.8 Air FE': { used: 620, new: 899, hk: 880, msrp: 900 },
    'AF 24/1.8 FE': { used: 1300, new: 1850, hk: 1800, msrp: 2000 },
    'AF 28/4.5 FE Pancake': { used: 320, new: 439, hk: 430, msrp: 439 },
    'AF 35/1.8 FE': { used: 1300, new: 1850, hk: 1800, msrp: 2000 },
    'AF 40/2.5 Air FE': { used: 580, new: 799, hk: 780, msrp: 799 },
    'AF 50/1.8 FE': { used: 1200, new: 1750, hk: 1700, msrp: 1900 },
    'AF 85/1.8 PFU RMBH STM FE II': { used: 1050, new: 1550, hk: 1500, msrp: 1600 },
    'AF 135/1.8 LAB FE': { used: 4100, new: 4999, hk: 4800, msrp: 4999 },

    // 老蛙热门
    '10mm F2.8 Zero-D AF': { used: 3800, new: 4780, hk: 4600, msrp: 4980 },
    '9mm F5.6 W-Dreamer MF': { used: 3200, new: 4180, hk: 4000, msrp: 4580 },
    '15mm F2 Zero-D MF': { used: 2600, new: 3600, hk: 3500, msrp: 4980 },
  };

  // 匹配已知精确行情
  for (const [key, val] of Object.entries(preciseMarket)) {
    if (lens.name.includes(key) || key.includes(lens.name)) {
      priceUsed = val.used;
      priceNew = val.new;
      priceHk = val.hk;
      const finalMsrp = val.msrp || msrp;
      return { priceUsed, priceNew, priceHk, priceMsrp: finalMsrp, priceCny: priceNew };
    }
  }

  // 通用算法估算（根据镜头档次与发售年限）
  let depreciationFactor = 0.85;
  if (ageYears > 8) depreciationFactor = 0.45;
  else if (ageYears > 5) depreciationFactor = 0.55;
  else if (ageYears > 3) depreciationFactor = 0.68;
  else if (ageYears > 1.5) depreciationFactor = 0.78;
  else depreciationFactor = 0.88;

  if (lens.isGM) depreciationFactor = Math.min(0.92, depreciationFactor + 0.12);
  if (!lens.isAF) depreciationFactor = Math.max(0.35, depreciationFactor - 0.15); // 手动副厂贬值较快

  priceUsed = Math.round((msrp * depreciationFactor) / 50) * 50;
  priceNew = Math.round((msrp * Math.min(1.0, depreciationFactor * 1.25 + 0.1)) / 50) * 50;
  priceHk = Math.round(priceNew * 1.08 / 100) * 100;

  // 保证二手 < 新品 <= 发售
  if (priceUsed >= priceNew) priceUsed = Math.round(priceNew * 0.75 / 50) * 50;
  if (priceUsed <= 0) priceUsed = Math.round(msrp * 0.5 / 50) * 50;
  if (priceNew <= 0) priceNew = msrp;

  return {
    priceUsed,
    priceNew,
    priceHk,
    priceMsrp: msrp,
    priceCny: priceNew,
  };
}

// 评分规范化与纠真规则 (严控子项在 1.0 ~ 5.0 之间)
function calibrateScores(lens) {
  let {
    sharpnessScore = 3.5,
    uniformityScore = 3.2,
    wideOpenScore = 3.3,
    caControlScore = 3.3,
    bokehScore = 3.5,
    distortionScore = 3.5,
  } = lens;

  const n = lens.name;

  // 1. 唯卓仕 16mm F1.8 (严重低估纠真)
  if (n.includes('16/1.8') && lens.brandCategory === 'viltrox') {
    sharpnessScore = 4.7;
    uniformityScore = 4.5;
    wideOpenScore = 4.6;
    caControlScore = 4.6;
    bokehScore = 4.3;
    distortionScore = 4.4;
  }
  // 2. 腾龙 35-150mm F2-2.8 (严重低估纠真)
  else if (n.includes('35-150mm') && lens.brandCategory === 'tamron') {
    sharpnessScore = 4.6;
    uniformityScore = 4.4;
    wideOpenScore = 4.5;
    caControlScore = 4.5;
    bokehScore = 4.7;
    distortionScore = 4.2;
  }
  // 3. 腾龙 28-75mm G2 (纠真)
  else if (n.includes('28-75mm') && n.includes('G2') && lens.brandCategory === 'tamron') {
    sharpnessScore = 4.4;
    uniformityScore = 4.2;
    wideOpenScore = 4.3;
    caControlScore = 4.3;
    bokehScore = 4.1;
    distortionScore = 4.2;
  }
  // 4. 适马 14mm F1.4 DG DN Art (严重低估纠真)
  else if (n.includes('14mm F1.4 DG DN') && lens.brandCategory === 'sigma') {
    sharpnessScore = 4.7;
    uniformityScore = 4.5;
    wideOpenScore = 4.6;
    caControlScore = 4.6;
    bokehScore = 4.2;
    distortionScore = 4.5;
  }
  // 5. 适马 24-70mm DG DN II Art (更新顶级标变)
  else if (n.includes('24-70mm F2.8 DG DN II') && lens.brandCategory === 'sigma') {
    sharpnessScore = 4.8;
    uniformityScore = 4.7;
    wideOpenScore = 4.7;
    caControlScore = 4.7;
    bokehScore = 4.4;
    distortionScore = 4.3;
  }
  // 6. 适马 50mm F1.2 DG DN Art
  else if (n.includes('50mm F1.2 DG DN') && lens.brandCategory === 'sigma') {
    sharpnessScore = 4.8;
    uniformityScore = 4.7;
    wideOpenScore = 4.8;
    caControlScore = 4.7;
    bokehScore = 4.9;
    distortionScore = 4.5;
  }
  // 7. 适马 85mm F1.4 DG DN Art
  else if (n.includes('85mm F1.4 DG DN') && lens.brandCategory === 'sigma') {
    sharpnessScore = 4.7;
    uniformityScore = 4.6;
    wideOpenScore = 4.7;
    caControlScore = 4.7;
    bokehScore = 4.7;
    distortionScore = 4.4;
  }
  // 8. 索尼 FE 24-70 F4 ZA (老蓝标画质疲软纠真)
  else if (n.includes('24-70mm F4 ZA')) {
    sharpnessScore = 3.1;
    uniformityScore = 2.6;
    wideOpenScore = 2.7;
    caControlScore = 2.8;
    bokehScore = 2.8;
    distortionScore = 2.7;
  }
  // 9. 索尼 FE 50mm F1.8 (小痰盂拉风箱)
  else if (n.includes('FE 50mm F1.8 AF')) {
    sharpnessScore = 3.2;
    uniformityScore = 2.6;
    wideOpenScore = 2.8;
    caControlScore = 2.8;
    bokehScore = 3.6;
    distortionScore = 3.0;
  }
  // 10. 索尼 FE 85mm F1.8 (原厂平民神镜)
  else if (n.includes('FE 85mm F1.8 AF')) {
    sharpnessScore = 4.2;
    uniformityScore = 3.8;
    wideOpenScore = 3.9;
    caControlScore = 3.6;
    bokehScore = 4.3;
    distortionScore = 3.8;
  }
  // 11. 索尼 FE 55mm F1.8 ZA
  else if (n.includes('FE 55mm F1.8 ZA AF')) {
    sharpnessScore = 4.3;
    uniformityScore = 3.8;
    wideOpenScore = 4.0;
    caControlScore = 3.5;
    bokehScore = 4.2;
    distortionScore = 3.8;
  }

  // 严禁任何子项超过 5.0 或低于 1.0 (归一化缩放)
  sharpnessScore = Math.max(1.0, Math.min(5.0, sharpnessScore > 5.0 ? 4.9 : sharpnessScore));
  uniformityScore = Math.max(1.0, Math.min(5.0, uniformityScore > 5.0 ? 4.8 : uniformityScore));
  wideOpenScore = Math.max(1.0, Math.min(5.0, wideOpenScore > 5.0 ? 4.9 : wideOpenScore));
  caControlScore = Math.max(1.0, Math.min(5.0, caControlScore > 5.0 ? 4.8 : caControlScore));
  bokehScore = Math.max(1.0, Math.min(5.0, bokehScore > 5.0 ? 4.9 : bokehScore));
  distortionScore = Math.max(1.0, Math.min(5.0, distortionScore > 5.0 ? 4.6 : distortionScore));

  // 精准客观加权总分计算 (满分 100)
  // 锐度(35%) + 一致性(25%) + 全开(20%) + 色散(10%) + 虚化(6%) + 畸变(4%)
  const weightedSum =
    sharpnessScore * 0.35 +
    uniformityScore * 0.25 +
    wideOpenScore * 0.20 +
    caControlScore * 0.10 +
    bokehScore * 0.06 +
    distortionScore * 0.04;
  
  // 映射到 0~100 分
  const overallScore = Math.round((weightedSum / 5.0) * 1000) / 10;

  // 锐度星级重置
  let sharpnessStar = '★★★';
  if (sharpnessScore >= 4.8) sharpnessStar = '★★★★★★';
  else if (sharpnessScore >= 4.4) sharpnessStar = '★★★★★+';
  else if (sharpnessScore >= 4.0) sharpnessStar = '★★★★★';
  else if (sharpnessScore >= 3.6) sharpnessStar = '★★★★+';
  else if (sharpnessScore >= 3.0) sharpnessStar = '★★★★';
  else if (sharpnessScore >= 2.5) sharpnessStar = '★★★+';

  return {
    sharpnessStar,
    sharpnessScore: Math.round(sharpnessScore * 10) / 10,
    uniformityScore: Math.round(uniformityScore * 10) / 10,
    wideOpenScore: Math.round(wideOpenScore * 10) / 10,
    caControlScore: Math.round(caControlScore * 10) / 10,
    bokehScore: Math.round(bokehScore * 10) / 10,
    distortionScore: Math.round(distortionScore * 10) / 10,
    overallScore,
  };
}

// 计算便携指数与性价比指数
function calculateIndexes(lens, priceUsed, priceNew) {
  // 1. 便携指数 (0~100)
  const weight = lens.weightG || 500;
  let portability = 100 - (weight / 1500) * 80;
  if (weight <= 150) portability = 98;
  else if (weight <= 250) portability = 93;
  else if (weight <= 400) portability = 86;
  else if (weight <= 600) portability = 74;
  else if (weight <= 850) portability = 58;
  else if (weight <= 1200) portability = 38;
  else portability = Math.max(10, Math.round(100 - (weight / 2500) * 90));
  const portabilityScore = Math.max(10, Math.min(99, Math.round(portability * 10) / 10));

  // 2. 性价比指数 (0~100)
  // 基于综合画质 / 当前二手价与新品价合理比值
  const effectivePrice = priceUsed > 0 ? (priceUsed * 0.6 + priceNew * 0.4) : (priceNew || 5000);
  const priceFactor = Math.log10(Math.max(300, effectivePrice)); // 2.5 ~ 4.5
  // 分子为画质，分母受价格对数影响
  let rawValue = (lens.overallScore / (priceFactor * 18)) * 22;
  
  // 针对高性价比爆款修正
  if (priceUsed <= 1500 && lens.overallScore >= 60) rawValue += 15;
  if (priceUsed <= 2500 && lens.overallScore >= 75) rawValue += 10;
  if (priceUsed <= 4500 && lens.overallScore >= 88) rawValue += 8;

  const valueScore = Math.max(20, Math.min(98, Math.round(rawValue * 10) / 10));

  return { portabilityScore, valueScore };
}

function run() {
  const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Initial lens count: ${rawData.length}`);

  // 1. 过滤虚构/幻觉镜头
  const cleanedList = rawData.filter((lens) => !isFakeLens(lens));
  console.log(`After removing fake/phantom lenses: ${cleanedList.length}`);

  // 2. 补充适马今日新品 (2026-09-08发布)
  // 85mm F1.2 DG Art
  const sigma85 = {
    id: 'lens-sigma-85mm-f12-dg-art',
    index: 0,
    name: '85mm F1.2 DG DN Art AF',
    brandZh: '适马 (Sigma)',
    brandEn: 'Sigma',
    brandCategory: 'sigma',
    type: '定焦',
    focalMin: 85,
    focalMax: 85,
    focalDesc: '85mm',
    focalCategory: ['telephoto'],
    apertureDesc: 'F1.2',
    maxAperture: 1.2,
    focusType: '自动对焦 (AF)',
    isAF: true,
    ossDesc: '不支持防抖',
    hasOSS: false,
    releaseDate: '2026.9',
    minFocusDist: '84',
    weightG: 905,
    lengthMm: 121.7,
    filterThread: '82',
    priceMsrp: 10999,
    priceNew: 10999,
    priceUsed: 0,
    priceHk: 12500,
    priceCny: 10999,
    officialUrl: 'https://www.sigma-global.com/en/lenses/a026_85_12/',
    isGM: false,
    isG: false,
    isZeiss: false,
    isMacro: false,
    isPZ: false,
    isCine: false,
    sharpnessStar: '★★★★★★',
    sharpnessScore: 4.9,
    uniformityScore: 4.8,
    wideOpenScore: 4.9,
    caControlScore: 4.8,
    bokehScore: 4.9,
    distortionScore: 4.6,
    overallScore: 97.2,
    portabilityScore: 48,
    valueScore: 78,
  };

  // 20-60mm F2.8-4 DG Contemporary
  const sigma2060 = {
    id: 'lens-sigma-20-60mm-f28-4-dg-contemporary',
    index: 0,
    name: '20-60mm F2.8-4 DG Contemporary AF',
    brandZh: '适马 (Sigma)',
    brandEn: 'Sigma',
    brandCategory: 'sigma',
    type: '变焦',
    focalMin: 20,
    focalMax: 60,
    focalDesc: '20-60mm',
    focalCategory: ['ultra-wide', 'wide', 'standard'],
    apertureDesc: 'F2.8-4',
    maxAperture: 2.8,
    focusType: '自动对焦 (AF)',
    isAF: true,
    ossDesc: '不支持防抖',
    hasOSS: false,
    releaseDate: '2026.9',
    minFocusDist: '15.8',
    weightG: 375,
    lengthMm: 88.0,
    filterThread: '67',
    priceMsrp: 5899,
    priceNew: 5899,
    priceUsed: 0,
    priceHk: 6600,
    priceCny: 5899,
    officialUrl: 'https://www.sigma-global.com/en/lenses/c026_20_60_28_4/',
    isGM: false,
    isG: false,
    isZeiss: false,
    isMacro: true, // 1:2.3近摄
    isPZ: false,
    isCine: false,
    sharpnessStar: '★★★★★',
    sharpnessScore: 4.3,
    uniformityScore: 4.1,
    wideOpenScore: 4.2,
    caControlScore: 4.3,
    bokehScore: 3.9,
    distortionScore: 4.1,
    overallScore: 84.5,
    portabilityScore: 89,
    valueScore: 86,
  };

  const processedList = [];

  for (let i = 0; i < cleanedList.length; i++) {
    const lens = cleanedList[i];

    // 校准评分
    const scoreCalib = calibrateScores(lens);
    // 校准价格体系
    const priceCalib = calibrateMarketPrices(lens);
    // 校准便携与性价比
    const indexCalib = calculateIndexes(
      { ...lens, ...scoreCalib },
      priceCalib.priceUsed,
      priceCalib.priceNew
    );

    processedList.push({
      ...lens,
      index: i + 1,
      ...scoreCalib,
      ...priceCalib,
      ...indexCalib,
    });
  }

  // 加入两款新品 (排在最前面)
  processedList.unshift(sigma85, sigma2060);

  // 重新对 index 编号
  processedList.forEach((lens, idx) => {
    lens.index = idx + 1;
  });

  fs.writeFileSync(jsonPath, JSON.stringify(processedList, null, 2), 'utf-8');
  console.log(`Successfully upgraded database with ${processedList.length} real calibrated lenses to ${jsonPath}`);
}

run();
