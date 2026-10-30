import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/lenses.json');

// 从 git 提交 37f8256 提取线上原始 481 款镜头的 CSV
function getOriginalCSV() {
  return execSync('git show 37f8256:resource/sony_lenses_calibrated_complete.csv', { encoding: 'utf-8' });
}

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

// 官网链接解析器
function getOfficialUrl(name, brandCategory, brandZh, brandEn) {
  const n = name.toLowerCase();
  const bZh = brandZh || '';
  const bEn = brandEn || '';

  if (brandCategory === 'sony') {
    if (n.includes('400mm f4.5 gm') || n.includes('400mm f4.5')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel400f45gm';
    if (n.includes('600mm f6.3 gm') || n.includes('600mm f6.3')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel600f63gm';
    if (n.includes('8-14mm f3.5') || n.includes('8-14mm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel0814g';
    if (n.includes('14mm f1.8 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel14f18gm';
    if (n.includes('24mm f1.4 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel24f14gm';
    if (n.includes('35mm f1.4 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel35f14gm';
    if (n.includes('50mm f1.2 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel50f12gm';
    if (n.includes('50mm f1.4 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel50f14gm';
    if (n.includes('85mm f1.4 gm ii')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel85f14gm2';
    if (n.includes('85mm f1.4 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel85f14gm';
    if (n.includes('100mm f2.8 stf gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel100f28gm';
    if (n.includes('135mm f1.8 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel135f18gm';
    if (n.includes('300mm f2.8 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel300f28gm';
    if (n.includes('400mm f2.8 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel400f28gm';
    if (n.includes('600mm f4 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel600f40gm';
    if (n.includes('12-24mm f2.8 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel1224gm';
    if (n.includes('16-35mm f2.8 gm ii')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel1635gm2';
    if (n.includes('16-35mm f2.8 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel1635gm';
    if (n.includes('24-70mm f2.8 gm ii')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel2470gm2';
    if (n.includes('24-70mm f2.8 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel2470gm';
    if (n.includes('28-70mm f2.0 gm') || n.includes('28-70mm f2 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel2870gm';
    if (n.includes('70-200mm f2.8 gm ii') || n.includes('70-200mm f2.8 gm oss ii')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel70200gm2';
    if (n.includes('70-200mm f2.8 gm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel70200gm';
    if (n.includes('100-400mm f4.5-5.6 gm') || n.includes('100-400mm')) return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel100400gm';
    return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/';
  }

  if (brandCategory === 'sigma') {
    if (n.includes('50mm f1.4 cl')) return 'https://www.sigma-global.com/en/lenses/c026_50_14/';
    if (n.includes('85mm f1.2')) return 'https://www.sigma-global.com/en/lenses/a026_85_12/';
    if (n.includes('20-60mm')) return 'https://www.sigma-global.com/en/lenses/c026_20_60_28_4/';
    if (n.includes('14mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a023_14_14/';
    if (n.includes('15mm f1.4') || n.includes('diagonal fisheye')) return 'https://www.sigma-global.com/en/lenses/a024_15_14_fisheye/';
    if (n.includes('20mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a022_20_14/';
    if (n.includes('24mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a022_24_14/';
    if (n.includes('35mm f1.2 dg dn')) return 'https://www.sigma-global.com/en/lenses/a019_35_12/';
    if (n.includes('35mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a021_35_14/';
    if (n.includes('50mm f1.2 dg dn')) return 'https://www.sigma-global.com/en/lenses/a024_50_12/';
    if (n.includes('50mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a023_50_14/';
    if (n.includes('85mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a020_85_14/';
    if (n.includes('105mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/a020_105_28_macro/';
    if (n.includes('14-24mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/a019_14_24_28/';
    if (n.includes('24-70mm f2.8 dg dn ii')) return 'https://www.sigma-global.com/en/lenses/a024_24_70_28/';
    if (n.includes('24-70mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/a019_24_70_28/';
    if (n.includes('28-45mm f1.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/a024_28_45_18/';
    if (n.includes('28-105mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/a024_28_105_28/';
    if (n.includes('70-200mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/s023_70_200_28/';
    return 'https://www.sigma-global.com/en/lenses/';
  }

  if (brandCategory === 'tamron') {
    if (n.includes('28-75mm') && (n.includes('g2') || n.includes('vxd'))) return 'https://www.tamron.com/global/consumer/lenses/a063/';
    if (n.includes('35-150mm')) return 'https://www.tamron.com/global/consumer/lenses/a058/';
    if (n.includes('70-180mm') && n.includes('g2')) return 'https://www.tamron.com/global/consumer/lenses/a065/';
    if (n.includes('50-400mm')) return 'https://www.tamron.com/global/consumer/lenses/a067/';
    return 'https://www.tamron.com/global/consumer/lenses/';
  }

  if (brandCategory === 'viltrox') {
    if (n.includes('35') && n.includes('1.4') && n.includes('pro')) return 'https://viltrox.com/products/af-35mm-f1-4-fe';
    if (n.includes('16') && n.includes('1.8')) return 'https://viltrox.com/products/viltrox-af-16mm-f1-8-fe';
    if (n.includes('85') && n.includes('1.4')) return 'https://viltrox.com/products/af-85mm-f1-4-pro-fe';
    if (n.includes('135') && n.includes('1.8')) return 'https://viltrox.com/products/af-135mm-f1-8-lab-fe';
    return 'https://viltrox.com.cn/';
  }

  return 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/';
}

// 市场行情校准
function getMarketPrices(lens) {
  const msrp = lens.priceCny > 0 ? lens.priceCny : 3000;
  const releaseYear = parseFloat(lens.releaseDate) || 2020;
  const ageYears = Math.max(0, 2026.7 - releaseYear);

  let priceUsed = 0;
  let priceNew = 0;
  let priceHk = 0;

  const preciseMarket = {
    // 索尼
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

    // 适马
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

    // 腾龙
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

    // 唯卓仕
    'AF 16/1.8 FE': { used: 2400, new: 3199, hk: 3100, msrp: 3500 },
    'AF 20/2.8 Air FE': { used: 620, new: 899, hk: 880, msrp: 900 },
    'AF 24/1.8 FE': { used: 1300, new: 1850, hk: 1800, msrp: 2000 },
    'AF 28/4.5 FE Pancake': { used: 320, new: 439, hk: 430, msrp: 439 },
    'AF 35/1.8 FE': { used: 1300, new: 1850, hk: 1800, msrp: 2000 },
    'AF 40/2.5 Air FE': { used: 580, new: 799, hk: 780, msrp: 799 },
    'AF 50/1.8 FE': { used: 1200, new: 1750, hk: 1700, msrp: 1900 },
    'AF 85/1.8 PFU RMBH STM FE II': { used: 1050, new: 1550, hk: 1500, msrp: 1600 },
    'AF 85/1.4 Pro': { used: 2400, new: 3259, hk: 3200, msrp: 3259 },
    'AF 135/1.8 LAB FE': { used: 4100, new: 4999, hk: 4800, msrp: 4999 },

    // 老蛙
    '10mm F2.8 Zero-D AF': { used: 3800, new: 4780, hk: 4600, msrp: 4980 },
    '9mm F5.6 W-Dreamer MF': { used: 3200, new: 4180, hk: 4000, msrp: 4580 },
    '15mm F2 Zero-D MF': { used: 2600, new: 3600, hk: 3500, msrp: 4980 },
  };

  for (const [key, val] of Object.entries(preciseMarket)) {
    if (lens.name.includes(key) || key.includes(lens.name)) {
      priceUsed = val.used;
      priceNew = val.new;
      priceHk = val.hk;
      const finalMsrp = val.msrp || msrp;
      return { priceUsed, priceNew, priceHk, priceMsrp: finalMsrp, priceCny: priceNew };
    }
  }

  let depreciationFactor = 0.82;
  if (ageYears > 8) depreciationFactor = 0.45;
  else if (ageYears > 5) depreciationFactor = 0.55;
  else if (ageYears > 3) depreciationFactor = 0.68;
  else if (ageYears > 1.5) depreciationFactor = 0.78;
  else depreciationFactor = 0.88;

  if (lens.isGM) depreciationFactor = Math.min(0.92, depreciationFactor + 0.12);
  if (!lens.isAF) depreciationFactor = Math.max(0.35, depreciationFactor - 0.15);

  priceUsed = Math.round((msrp * depreciationFactor) / 50) * 50;
  priceNew = Math.round((msrp * Math.min(1.0, depreciationFactor * 1.25 + 0.1)) / 50) * 50;
  priceHk = Math.round(priceNew * 1.08 / 100) * 100;

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

// 评分规范化与纠真 (封顶 5.0，消灭破音溢出)
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

  if (n.includes('16/1.8') && lens.brandCategory === 'viltrox') {
    sharpnessScore = 4.7;
    uniformityScore = 4.5;
    wideOpenScore = 4.6;
    caControlScore = 4.6;
    bokehScore = 4.3;
    distortionScore = 4.4;
  } else if (n.includes('85/1.4 Pro') && lens.brandCategory === 'viltrox') {
    sharpnessScore = 4.6;
    uniformityScore = 4.3;
    wideOpenScore = 4.4;
    caControlScore = 4.3;
    bokehScore = 4.8;
    distortionScore = 4.3;
  } else if (n.includes('35-150mm') && lens.brandCategory === 'tamron') {
    sharpnessScore = 4.6;
    uniformityScore = 4.4;
    wideOpenScore = 4.5;
    caControlScore = 4.5;
    bokehScore = 4.7;
    distortionScore = 4.2;
  } else if (n.includes('28-75mm') && n.includes('G2') && lens.brandCategory === 'tamron') {
    sharpnessScore = 4.4;
    uniformityScore = 4.2;
    wideOpenScore = 4.3;
    caControlScore = 4.3;
    bokehScore = 4.1;
    distortionScore = 4.2;
  } else if (n.includes('14mm F1.4 DG DN') && lens.brandCategory === 'sigma') {
    sharpnessScore = 4.7;
    uniformityScore = 4.5;
    wideOpenScore = 4.6;
    caControlScore = 4.6;
    bokehScore = 4.2;
    distortionScore = 4.5;
  } else if (n.includes('24-70mm F2.8 DG DN II') && lens.brandCategory === 'sigma') {
    sharpnessScore = 4.8;
    uniformityScore = 4.7;
    wideOpenScore = 4.7;
    caControlScore = 4.7;
    bokehScore = 4.4;
    distortionScore = 4.3;
  } else if (n.includes('50mm F1.2 DG DN') && lens.brandCategory === 'sigma') {
    sharpnessScore = 4.8;
    uniformityScore = 4.7;
    wideOpenScore = 4.8;
    caControlScore = 4.7;
    bokehScore = 4.9;
    distortionScore = 4.5;
  } else if (n.includes('85mm F1.4 DG DN') && lens.brandCategory === 'sigma') {
    sharpnessScore = 4.7;
    uniformityScore = 4.6;
    wideOpenScore = 4.7;
    caControlScore = 4.7;
    bokehScore = 4.7;
    distortionScore = 4.4;
  } else if (n.includes('24-70mm F4 ZA')) {
    sharpnessScore = 3.1;
    uniformityScore = 2.6;
    wideOpenScore = 2.7;
    caControlScore = 2.8;
    bokehScore = 2.8;
    distortionScore = 2.7;
  } else if (n.includes('FE 50mm F1.8 AF')) {
    sharpnessScore = 3.2;
    uniformityScore = 2.6;
    wideOpenScore = 2.8;
    caControlScore = 2.8;
    bokehScore = 3.6;
    distortionScore = 3.0;
  } else if (n.includes('FE 85mm F1.8 AF')) {
    sharpnessScore = 4.2;
    uniformityScore = 3.8;
    wideOpenScore = 3.9;
    caControlScore = 3.6;
    bokehScore = 4.3;
    distortionScore = 3.8;
  } else if (n.includes('FE 55mm F1.8 ZA AF')) {
    sharpnessScore = 4.3;
    uniformityScore = 3.8;
    wideOpenScore = 4.0;
    caControlScore = 3.5;
    bokehScore = 4.2;
    distortionScore = 3.8;
  }

  // 严禁子项越界 (>5.0 或 <1.0)
  sharpnessScore = Math.max(1.0, Math.min(5.0, sharpnessScore > 5.0 ? 4.9 : sharpnessScore));
  uniformityScore = Math.max(1.0, Math.min(5.0, uniformityScore > 5.0 ? 4.8 : uniformityScore));
  wideOpenScore = Math.max(1.0, Math.min(5.0, wideOpenScore > 5.0 ? 4.9 : wideOpenScore));
  caControlScore = Math.max(1.0, Math.min(5.0, caControlScore > 5.0 ? 4.8 : caControlScore));
  bokehScore = Math.max(1.0, Math.min(5.0, bokehScore > 5.0 ? 4.9 : bokehScore));
  distortionScore = Math.max(1.0, Math.min(5.0, distortionScore > 5.0 ? 4.6 : distortionScore));

  const weightedSum =
    sharpnessScore * 0.35 +
    uniformityScore * 0.25 +
    wideOpenScore * 0.20 +
    caControlScore * 0.10 +
    bokehScore * 0.06 +
    distortionScore * 0.04;

  const overallScore = Math.round((weightedSum / 5.0) * 1000) / 10;

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

function calculateIndexes(lens, priceUsed, priceNew) {
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

  const effectivePrice = priceUsed > 0 ? (priceUsed * 0.6 + priceNew * 0.4) : (priceNew || 5000);
  const priceFactor = Math.log10(Math.max(300, effectivePrice));
  let rawValue = (lens.overallScore / (priceFactor * 18)) * 22;

  if (priceUsed <= 1500 && lens.overallScore >= 60) rawValue += 15;
  if (priceUsed <= 2500 && lens.overallScore >= 75) rawValue += 10;
  if (priceUsed <= 4500 && lens.overallScore >= 88) rawValue += 8;

  const valueScore = Math.max(20, Math.min(98, Math.round(rawValue * 10) / 10));
  return { portabilityScore, valueScore };
}

function restoreAndUpgrade() {
  const csvText = getOriginalCSV();
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  console.log(`Original CSV lines: ${lines.length} (Expected: 1 header + 481 lenses)`);

  const header = parseCSVLine(lines[0]);
  const originalLenses = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < header.length) continue;

    const brandZh = cols[0] || '';
    const brandEn = cols[1] || '';
    const name = cols[2] || '';
    const type = cols[3] || '定焦';
    const focalMin = parseFloat(cols[4]) || 0;
    const focalMax = parseFloat(cols[5]) || 0;
    const focalDesc = cols[6] || '';
    const apertureDesc = cols[7] || '';
    const maxAperture = parseFloat(cols[8]) || 0;
    const focusType = cols[9] || '自动对焦 (AF)';
    const isAF = !focusType.includes('手动') && !focusType.includes('MF') && (focusType.includes('AF') || focusType.includes('自动'));
    const ossDesc = cols[10] || '不支持防抖';
    const hasOSS = !ossDesc.includes('不支持') && !ossDesc.includes('无') && (ossDesc.includes('支持') || ossDesc.includes('防抖') || ossDesc.includes('OSS') || ossDesc.includes('VC') || ossDesc.includes('OS'));
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
    let weightG = parseFloat(cols[23]) || 0;
    const lengthMm = parseFloat(cols[24]) || 0;
    let filterThread = cols[25] || '';
    const priceCny = parseFloat(cols[26]) || 0;

    const isMacro = name.toLowerCase().includes('macro') || name.includes('微距');
    const isGM = brandZh.includes('GM') || name.includes(' GM');
    const isG = (brandZh.includes(' (Sony G)') || name.includes(' G ')) && !isGM;
    const isZeiss = brandZh.includes('Zeiss') || brandEn.toLowerCase().includes('zeiss');
    const isPZ = name.includes('PZ') || name.includes('电动');
    const isCine = name.includes(' T') || name.includes('Cine') || name.includes('电影');

    let brandCategory = 'other';
    const brandLower = (brandZh + ' ' + brandEn).toLowerCase();
    if (brandLower.includes('sony') || brandLower.includes('索尼')) brandCategory = 'sony';
    else if (brandLower.includes('sigma') || brandLower.includes('适马')) brandCategory = 'sigma';
    else if (brandLower.includes('tamron') || brandLower.includes('腾龙')) brandCategory = 'tamron';
    else if (brandLower.includes('zeiss') || brandLower.includes('蔡司')) brandCategory = 'zeiss';
    else if (brandLower.includes('samyang') || brandLower.includes('森养') || brandLower.includes('rokinon')) brandCategory = 'samyang';
    else if (brandLower.includes('viltrox') || brandLower.includes('唯卓仕')) brandCategory = 'viltrox';
    else if (brandLower.includes('laowa') || brandLower.includes('老蛙')) brandCategory = 'laowa';
    else if (brandLower.includes('voigtlander') || brandLower.includes('福伦达')) brandCategory = 'voigtlander';
    else if (brandLower.includes('ttartisan') || brandLower.includes('铭匠')) brandCategory = 'ttartisan';
    else if (brandLower.includes('7artisans') || brandLower.includes('七工匠')) brandCategory = '7artisans';
    else if (brandLower.includes('yongnuo') || brandLower.includes('永诺')) brandCategory = 'yongnuo';
    else if (brandLower.includes('thypoch') || brandLower.includes('叙')) brandCategory = 'thypoch';

    const focalCategory = [];
    if (focalMin <= 24 || (focalMin < 28 && focalMax <= 28)) focalCategory.push('ultra-wide');
    if ((focalMin >= 24 && focalMin <= 35) || (focalMin <= 28 && focalMax >= 35)) focalCategory.push('wide');
    if ((focalMin >= 35 && focalMin <= 60) || (focalMin <= 35 && focalMax >= 50)) focalCategory.push('standard');
    if ((focalMin >= 70 && focalMin <= 135) || (focalMin <= 70 && focalMax >= 135)) focalCategory.push('telephoto');
    if (focalMax > 135 || focalMin > 135) focalCategory.push('super-telephoto');

    const officialUrl = getOfficialUrl(name, brandCategory, brandZh, brandEn);
    const id = `lens-${i}-${name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;

    const rawLens = {
      id,
      index: i,
      name,
      brandZh,
      brandEn,
      brandCategory,
      type,
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
      officialUrl,
      isGM,
      isG,
      isZeiss,
      isMacro,
      isPZ,
      isCine,
    };

    // 科学校准评分、价格与指数
    const scoreCalib = calibrateScores(rawLens);
    const priceCalib = getMarketPrices(rawLens);
    const indexCalib = calculateIndexes(
      { ...rawLens, ...scoreCalib },
      priceCalib.priceUsed,
      priceCalib.priceNew
    );

    originalLenses.push({
      ...rawLens,
      ...scoreCalib,
      ...priceCalib,
      ...indexCalib,
    });
  }

  console.log(`Successfully parsed and calibrated ${originalLenses.length} original lenses!`);

  // 2. 补充今天（2026-09-08）适马刚刚发布的 2 款新品
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
    priceMsrp: 9388,
    priceNew: 9388,
    priceUsed: 0,
    priceHk: 10100,
    priceCny: 9388,
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
    priceMsrp: 4999,
    priceNew: 4999,
    priceUsed: 0,
    priceHk: 5400,
    priceCny: 4999,
    officialUrl: 'https://www.sigma-global.com/en/lenses/c026_20_60_28_4/',
    isGM: false,
    isG: false,
    isZeiss: false,
    isMacro: true,
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

  const sony400 = {
    id: 'lens-sony-fe-400mm-f45-gm-oss-af',
    index: 0,
    name: 'FE 400mm F4.5 GM OSS AF',
    brandZh: '索尼 (Sony GM)',
    brandEn: 'Sony',
    brandCategory: 'sony',
    type: '定焦',
    focalMin: 400,
    focalMax: 400,
    focalDesc: '400mm',
    focalCategory: ['super-telephoto'],
    apertureDesc: 'F4.5',
    maxAperture: 4.5,
    focusType: '自动对焦 (AF)',
    isAF: true,
    ossDesc: '支持防抖',
    hasOSS: true,
    sharpnessStar: '★★★★★★',
    sharpnessScore: 4.9,
    uniformityScore: 4.9,
    wideOpenScore: 4.9,
    caControlScore: 4.8,
    bokehScore: 4.5,
    distortionScore: 4.8,
    overallScore: 97.2,
    portabilityScore: 38,
    valueScore: 60.6,
    releaseDate: '2026.9',
    minFocusDist: '250',
    weightG: 994,
    lengthMm: 242,
    filterThread: '95',
    priceCny: 19999,
    officialUrl: 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel400f45gm',
    isGM: true,
    isG: false,
    isZeiss: false,
    isMacro: false,
    isPZ: false,
    isCine: false,
    priceUsed: 0,
    priceNew: 19999,
    priceHk: 21800,
    priceMsrp: 19999,
  };

  const sony600 = {
    id: 'lens-sony-fe-600mm-f63-gm-oss-af',
    index: 0,
    name: 'FE 600mm F6.3 GM OSS AF',
    brandZh: '索尼 (Sony GM)',
    brandEn: 'Sony',
    brandCategory: 'sony',
    type: '定焦',
    focalMin: 600,
    focalMax: 600,
    focalDesc: '600mm',
    focalCategory: ['super-telephoto'],
    apertureDesc: 'F6.3',
    maxAperture: 6.3,
    focusType: '自动对焦 (AF)',
    isAF: true,
    ossDesc: '支持防抖',
    hasOSS: true,
    sharpnessStar: '★★★★★★',
    sharpnessScore: 4.8,
    uniformityScore: 4.8,
    wideOpenScore: 4.8,
    caControlScore: 4.8,
    bokehScore: 4.3,
    distortionScore: 4.8,
    overallScore: 95.4,
    portabilityScore: 38,
    valueScore: 59.3,
    releaseDate: '2026.9',
    minFocusDist: '350',
    weightG: 995,
    lengthMm: 263,
    filterThread: '95',
    priceCny: 26999,
    officialUrl: 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel600f63gm',
    isGM: true,
    isG: false,
    isZeiss: false,
    isMacro: false,
    isPZ: false,
    isCine: false,
    priceUsed: 0,
    priceNew: 26999,
    priceHk: 29500,
    priceMsrp: 26999,
  };

  const sony814 = {
    id: 'lens-sony-fe-8-14mm-f35-g-fisheye-af',
    index: 0,
    name: 'FE 8-14mm F3.5 G Fisheye AF',
    brandZh: '索尼 (Sony G)',
    brandEn: 'Sony',
    brandCategory: 'sony',
    type: '变焦',
    focalMin: 8,
    focalMax: 14,
    focalDesc: '8-14mm',
    focalCategory: ['ultra-wide'],
    apertureDesc: 'F3.5',
    maxAperture: 3.5,
    focusType: '自动对焦 (AF)',
    isAF: true,
    ossDesc: '不支持防抖',
    hasOSS: false,
    sharpnessStar: '★★★★★+',
    sharpnessScore: 4.5,
    uniformityScore: 4.2,
    wideOpenScore: 4.4,
    caControlScore: 4.3,
    bokehScore: 3.8,
    distortionScore: 2.5,
    overallScore: 85.3,
    portabilityScore: 86,
    valueScore: 50.6,
    releaseDate: '2026.9',
    minFocusDist: '15',
    weightG: 314,
    lengthMm: 82.8,
    filterThread: '后置',
    priceCny: 11999,
    officialUrl: 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel0814g',
    isGM: false,
    isG: true,
    isZeiss: false,
    isMacro: false,
    isPZ: false,
    isCine: false,
    priceUsed: 0,
    priceNew: 11999,
    priceHk: 12900,
    priceMsrp: 11999,
  };

  const sigma50cl = {
    id: 'lens-sigma-50mm-f14-cl-dg-contemporary-af',
    index: 0,
    name: '50mm F1.4 CL DG Contemporary AF',
    brandZh: '适马 (Sigma)',
    brandEn: 'Sigma',
    brandCategory: 'sigma',
    type: '定焦',
    focalMin: 50,
    focalMax: 50,
    focalDesc: '50mm',
    focalCategory: ['standard'],
    apertureDesc: 'F1.4',
    maxAperture: 1.4,
    focusType: '自动对焦 (AF)',
    isAF: true,
    ossDesc: '不支持防抖',
    hasOSS: false,
    sharpnessStar: '★★★★★+',
    sharpnessScore: 4.4,
    uniformityScore: 4.1,
    wideOpenScore: 4.2,
    caControlScore: 4.2,
    bokehScore: 4.6,
    distortionScore: 4.3,
    overallScore: 85.5,
    portabilityScore: 86,
    valueScore: 53.5,
    releaseDate: '2026.10',
    minFocusDist: '45',
    weightG: 375,
    lengthMm: 56.0,
    filterThread: '52',
    priceCny: 4699,
    officialUrl: 'https://www.sigma-global.com/en/lenses/c026_50_14/',
    isGM: false,
    isG: false,
    isZeiss: false,
    isMacro: false,
    isPZ: false,
    isCine: false,
    priceUsed: 0,
    priceNew: 4699,
    priceHk: 5100,
    priceMsrp: 4699,
  };

  const viltrox35pro = {
    id: 'lens-viltrox-af-35mm-f14-pro-fe',
    index: 0,
    name: 'AF 35/1.4 Pro FE',
    brandZh: '唯卓仕',
    brandEn: 'Viltrox',
    brandCategory: 'viltrox',
    type: '定焦',
    focalMin: 35,
    focalMax: 35,
    focalDesc: '35mm',
    focalCategory: ['wide', 'standard'],
    apertureDesc: 'F1.4',
    maxAperture: 1.4,
    focusType: '自动对焦 (AF)',
    isAF: true,
    ossDesc: '不支持防抖',
    hasOSS: false,
    sharpnessStar: '★★★★★+',
    sharpnessScore: 4.7,
    uniformityScore: 4.5,
    wideOpenScore: 4.6,
    caControlScore: 4.5,
    bokehScore: 4.6,
    distortionScore: 4.4,
    overallScore: 91.8,
    portabilityScore: 58,
    valueScore: 68.5,
    releaseDate: '2026.10',
    minFocusDist: '30',
    weightG: 780,
    lengthMm: 111.5,
    filterThread: '77',
    priceCny: 3899,
    officialUrl: 'https://viltrox.com/products/af-35mm-f1-4-fe',
    isGM: false,
    isG: false,
    isZeiss: false,
    isMacro: false,
    isPZ: false,
    isCine: false,
    priceUsed: 0,
    priceNew: 3899,
    priceHk: 4200,
    priceMsrp: 3899,
  };

  // 置顶加入全新镜头
  const finalList = [
    sony400,
    sony600,
    sony814,
    sigma50cl,
    viltrox35pro,
    sigma85,
    sigma2060,
    ...originalLenses,
  ];

  // 重新按 1..N 编号
  finalList.forEach((lens, idx) => {
    lens.index = idx + 1;
  });

  console.log(`Final total lens count: ${finalList.length} (Original 481 + 7 New = ${finalList.length})`);

  fs.writeFileSync(jsonPath, JSON.stringify(finalList, null, 2), 'utf-8');
  console.log(`Successfully wrote ${finalList.length} lenses to ${jsonPath}`);
}

restoreAndUpgrade();
