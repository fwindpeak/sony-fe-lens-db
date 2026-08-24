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

// 官网链接解析器 (全品牌全型号完整覆盖)
function getOfficialUrl(name, brandCategory, brandZh, brandEn) {
  const n = name.toLowerCase();
  const bZh = brandZh || '';
  const bEn = brandEn || '';

  // SONY 原厂
  if (brandCategory === 'sony') {
    if (n.includes('14mm f1.8 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel14f18gm.html';
    if (n.includes('24mm f1.4 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel24f14gm.html';
    if (n.includes('35mm f1.4 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel35f14gm.html';
    if (n.includes('50mm f1.2 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel50f12gm.html';
    if (n.includes('50mm f1.4 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel50f14gm.html';
    if (n.includes('85mm f1.4 gm ii')) return 'https://www.sony.com.cn/products/di/lens/fe/sel85f14gm2.html';
    if (n.includes('85mm f1.4 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel85f14gm.html';
    if (n.includes('100mm f2.8 stf gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel100f28gm.html';
    if (n.includes('135mm f1.8 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel135f18gm.html';
    if (n.includes('300mm f2.8 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel300f28gm.html';
    if (n.includes('400mm f2.8 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel400f28gm.html';
    if (n.includes('600mm f4 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel600f40gm.html';
    if (n.includes('12-24mm f2.8 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel1224gm.html';
    if (n.includes('16-35mm f2.8 gm ii')) return 'https://www.sony.com.cn/products/di/lens/fe/sel1635gm2.html';
    if (n.includes('16-35mm f2.8 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel1635gm.html';
    if (n.includes('24-70mm f2.8 gm ii')) return 'https://www.sony.com.cn/products/di/lens/fe/sel2470gm2.html';
    if (n.includes('24-70mm f2.8 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel2470gm.html';
    if (n.includes('28-70mm f2.0 gm') || n.includes('28-70mm f2 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel2870gm.html';
    if (n.includes('70-200mm f2.8 gm ii') || n.includes('70-200mm f2.8 gm oss ii')) return 'https://www.sony.com.cn/products/di/lens/fe/sel70200gm2.html';
    if (n.includes('70-200mm f2.8 gm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel70200gm.html';
    if (n.includes('100-400mm f4.5-5.6 gm') || n.includes('100-400mm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel100400gm.html';

    // Sony G
    if (n.includes('20mm f1.8 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel20f18g.html';
    if (n.includes('24mm f2.8 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel24f28g.html';
    if (n.includes('40mm f2.5 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel40f25g.html';
    if (n.includes('50mm f2.5 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel50f25g.html';
    if (n.includes('90mm f2.8 macro g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel90m28g.html';
    if (n.includes('12-24mm f4 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel1224g.html';
    if (n.includes('16-25mm f2.8 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel1625g.html';
    if (n.includes('pz 16-35mm f4 g')) return 'https://www.sony.com.cn/products/di/lens/fe/selp1635g.html';
    if (n.includes('c 16-35mm t3.1')) return 'https://pro.sony/zh_CN/products/cinema-lenses/selc1635g';
    if (n.includes('20-70mm f4 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel2070g.html';
    if (n.includes('24-50mm f2.8 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel2450g.html';
    if (n.includes('24-105mm f4 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel24105g.html';
    if (n.includes('pz 28-135mm f4 g')) return 'https://www.sony.com.cn/products/di/lens/fe/selp28135g.html';
    if (n.includes('70-200mm f4 macro g oss ii')) return 'https://www.sony.com.cn/products/di/lens/fe/sel70200g2.html';
    if (n.includes('70-200mm f4 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel70200g.html';
    if (n.includes('70-300mm f4.5-5.6 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel70300g.html';
    if (n.includes('200-600mm f5.6-6.3 g')) return 'https://www.sony.com.cn/products/di/lens/fe/sel200600g.html';
    if (n.includes('18-110mm')) return 'https://pro.sony/zh_CN/products/cinema-lenses/selp18110g';

    // Sony Zeiss
    if (n.includes('35mm f2.8 za')) return 'https://www.sony.com.cn/products/di/lens/fe/sel35f28z.html';
    if (n.includes('35mm f1.4 za')) return 'https://www.sony.com.cn/products/di/lens/fe/sel35f14z.html';
    if (n.includes('50mm f1.4 za')) return 'https://www.sony.com.cn/products/di/lens/fe/sel50f14z.html';
    if (n.includes('55mm f1.8 za')) return 'https://www.sony.com.cn/products/di/lens/fe/sel55f18z.html';
    if (n.includes('16-35mm f4 za')) return 'https://www.sony.com.cn/products/di/lens/fe/sel1635z.html';
    if (n.includes('24-70mm f4 za')) return 'https://www.sony.com.cn/products/di/lens/fe/sel2470z.html';

    // Non-G
    if (n.includes('28mm f2')) return 'https://www.sony.com.cn/products/di/lens/fe/sel28f20.html';
    if (n.includes('35mm f1.8')) return 'https://www.sony.com.cn/products/di/lens/fe/sel35f18f.html';
    if (n.includes('50mm f1.8')) return 'https://www.sony.com.cn/products/di/lens/fe/sel50f18f.html';
    if (n.includes('50mm f2.8 macro')) return 'https://www.sony.com.cn/products/di/lens/fe/sel50m28.html';
    if (n.includes('85mm f1.8')) return 'https://www.sony.com.cn/products/di/lens/fe/sel85f18.html';
    if (n.includes('28-60mm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel2860.html';
    if (n.includes('28-70mm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel2870.html';
    if (n.includes('24-240mm')) return 'https://www.sony.com.cn/products/di/lens/fe/sel24240.html';
    return 'https://www.sony.com.cn/products/di/lens/fe/';
  }

  // SIGMA 适马
  if (brandCategory === 'sigma') {
    if (n.includes('14mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a023_14_14/';
    if (n.includes('15mm f1.4') || n.includes('diagonal fisheye')) return 'https://www.sigma-global.com/en/lenses/a024_15_14_fisheye/';
    if (n.includes('17mm f4 dg dn')) return 'https://www.sigma-global.com/en/lenses/c023_17_4/';
    if (n.includes('20mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a022_20_14/';
    if (n.includes('20mm f2 dg dn')) return 'https://www.sigma-global.com/en/lenses/c022_20_2/';
    if (n.includes('24mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a022_24_14/';
    if (n.includes('24mm f2 dg dn')) return 'https://www.sigma-global.com/en/lenses/c021_24_2/';
    if (n.includes('24mm f3.5 dg dn')) return 'https://www.sigma-global.com/en/lenses/c020_24_35/';
    if (n.includes('35mm f1.2 dg dn')) return 'https://www.sigma-global.com/en/lenses/a019_35_12/';
    if (n.includes('35mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a021_35_14/';
    if (n.includes('35mm f2 dg dn')) return 'https://www.sigma-global.com/en/lenses/c020_35_2/';
    if (n.includes('45mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/c019_45_28/';
    if (n.includes('50mm f1.2 dg dn')) return 'https://www.sigma-global.com/en/lenses/a024_50_12/';
    if (n.includes('50mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a023_50_14/';
    if (n.includes('50mm f2 dg dn')) return 'https://www.sigma-global.com/en/lenses/c023_50_2/';
    if (n.includes('65mm f2 dg dn')) return 'https://www.sigma-global.com/en/lenses/c020_65_2/';
    if (n.includes('85mm f1.4 dg dn')) return 'https://www.sigma-global.com/en/lenses/a020_85_14/';
    if (n.includes('90mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/c021_90_28/';
    if (n.includes('105mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/a020_105_28_macro/';
    if (n.includes('500mm f5.6 dg dn')) return 'https://www.sigma-global.com/en/lenses/s024_500_56/';
    if (n.includes('14-24mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/a019_14_24_28/';
    if (n.includes('16-28mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/c022_16_28_28/';
    if (n.includes('24-70mm f2.8 dg dn ii')) return 'https://www.sigma-global.com/en/lenses/a024_24_70_28/';
    if (n.includes('24-70mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/a019_24_70_28/';
    if (n.includes('28-45mm f1.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/a024_28_45_18/';
    if (n.includes('28-70mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/c021_28_70_28/';
    if (n.includes('28-105mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/a024_28_105_28/';
    if (n.includes('70-200mm f2.8 dg dn')) return 'https://www.sigma-global.com/en/lenses/s023_70_200_28/';
    if (n.includes('100-400mm f5-6.3 dg dn')) return 'https://www.sigma-global.com/en/lenses/c020_100_400_5_63/';
    if (n.includes('60-600mm f4.5-6.3 dg dn')) return 'https://www.sigma-global.com/en/lenses/s023_60_600_45_63/';
    if (n.includes('150-600mm f5-6.3 dg dn')) return 'https://www.sigma-global.com/en/lenses/s021_150_600_5_63/';
    return 'https://www.sigma-global.com/en/lenses/';
  }

  // TAMRON 腾龙
  if (brandCategory === 'tamron') {
    if (n.includes('20mm f2.8') || n.includes('f050')) return 'https://www.tamron.com/global/consumer/lenses/f050/';
    if (n.includes('24mm f2.8') || n.includes('f051')) return 'https://www.tamron.com/global/consumer/lenses/f051/';
    if (n.includes('35mm f2.8') || n.includes('f053')) return 'https://www.tamron.com/global/consumer/lenses/f053/';
    if (n.includes('90mm f2.8') || n.includes('f072')) return 'https://www.tamron.com/global/consumer/lenses/f072/';
    if (n.includes('17-28mm') || n.includes('a046')) return 'https://www.tamron.com/global/consumer/lenses/a046/';
    if (n.includes('17-50mm') || n.includes('a068')) return 'https://www.tamron.com/global/consumer/lenses/a068/';
    if (n.includes('20-40mm') || n.includes('a062')) return 'https://www.tamron.com/global/consumer/lenses/a062/';
    if (n.includes('28-75mm') && (n.includes('g2') || n.includes('a063'))) return 'https://www.tamron.com/global/consumer/lenses/a063/';
    if (n.includes('28-75mm') || n.includes('a036')) return 'https://www.tamron.com/global/consumer/lenses/a036/';
    if (n.includes('28-200mm') || n.includes('a071')) return 'https://www.tamron.com/global/consumer/lenses/a071/';
    if (n.includes('28-300mm') || n.includes('a074')) return 'https://www.tamron.com/global/consumer/lenses/a074/';
    if (n.includes('35-150mm') || n.includes('a058')) return 'https://www.tamron.com/global/consumer/lenses/a058/';
    if (n.includes('50-300mm') || n.includes('a069')) return 'https://www.tamron.com/global/consumer/lenses/a069/';
    if (n.includes('50-400mm') || n.includes('a067')) return 'https://www.tamron.com/global/consumer/lenses/a067/';
    if (n.includes('70-180mm') && (n.includes('g2') || n.includes('a065'))) return 'https://www.tamron.com/global/consumer/lenses/a065/';
    if (n.includes('70-180mm') || n.includes('a056')) return 'https://www.tamron.com/global/consumer/lenses/a056/';
    if (n.includes('70-300mm') || n.includes('a047')) return 'https://www.tamron.com/global/consumer/lenses/a047/';
    if (n.includes('150-500mm') || n.includes('a057')) return 'https://www.tamron.com/global/consumer/lenses/a057/';
    if (n.includes('25-200mm') || n.includes('a075')) return 'https://www.tamron.com/global/consumer/lenses/a075/';
    return 'https://www.tamron.com/global/consumer/lenses/';
  }

  // ZEISS 蔡司
  if (brandCategory === 'zeiss') {
    if (n.includes('batis')) return 'https://www.zeiss.com.cn/consumer-products/photography/batis.html';
    if (n.includes('loxia')) return 'https://www.zeiss.com.cn/consumer-products/photography/loxia.html';
    if (n.includes('otus')) return 'https://www.zeiss.com.cn/consumer-products/photography/otus.html';
    if (n.includes('milvus')) return 'https://www.zeiss.com.cn/consumer-products/photography/milvus.html';
    return 'https://www.zeiss.com.cn/consumer-products/photography.html';
  }

  // VILTROX 唯卓仕
  if (brandCategory === 'viltrox') {
    if (n.includes('16') && n.includes('1.8')) return 'https://viltrox.com/products/viltrox-af-16mm-f1-8-fe';
    if (n.includes('135') && n.includes('1.8')) return 'https://viltrox.com/products/viltrox-af-135mm-f1-8-lab-fe';
    if (n.includes('20') && n.includes('2.8')) return 'https://viltrox.com/products/viltrox-af-20mm-f2-8-fe';
    if (n.includes('24') && n.includes('1.8')) return 'https://viltrox.com/products/viltrox-af-24mm-f1-8-fe';
    if (n.includes('28') && n.includes('4.5')) return 'https://viltrox.com/products/viltrox-af-28mm-f4-5-fe';
    if (n.includes('35') && n.includes('1.8')) return 'https://viltrox.com/products/viltrox-af-35mm-f1-8-fe';
    if (n.includes('40') && n.includes('2.5')) return 'https://viltrox.com/products/viltrox-af-40mm-f2-5-fe';
    if (n.includes('50') && n.includes('1.8')) return 'https://viltrox.com/products/viltrox-af-50mm-f1-8-fe';
    if (n.includes('85') && n.includes('1.8')) return 'https://viltrox.com/products/viltrox-af-85mm-f1-8-ii-fe';
    return 'https://www.viltrox.com.cn/';
  }

  // SAMYANG 森养
  if (brandCategory === 'samyang') {
    if (n.includes('135mm f1.8')) return 'https://www.samyanglens.com/en/product/product-view.php?seq=561';
    if (n.includes('35-150mm')) return 'https://www.samyanglens.com/en/product/product-view.php?seq=582';
    if (n.includes('24-70mm')) return 'https://www.samyanglens.com/en/product/product-view.php?seq=544';
    if (n.includes('50mm f1.4')) return 'https://www.samyanglens.com/en/product/product-view.php?seq=545';
    if (n.includes('35mm f1.4')) return 'https://www.samyanglens.com/en/product/product-view.php?seq=565';
    if (n.includes('85mm f1.4')) return 'https://www.samyanglens.com/en/product/product-view.php?seq=579';
    return 'https://www.samyanglens.com/';
  }

  // LAOWA 老蛙
  if (brandCategory === 'laowa') {
    if (n.includes('10mm f2.8')) return 'https://www.laowalens.com.cn/product/laowa-10mm-f2-8-zero-d-ff/';
    if (n.includes('9mm f5.6')) return 'https://www.laowalens.com.cn/product/laowa-9mm-f5-6-ff-rl/';
    if (n.includes('11mm f4.5')) return 'https://www.laowalens.com.cn/product/laowa-11mm-f4-5-ff-rl/';
    if (n.includes('12mm f2.8')) return 'https://www.laowalens.com.cn/product/laowa-12mm-f2-8-zero-d/';
    if (n.includes('15mm f2')) return 'https://www.laowalens.com.cn/product/laowa-15mm-f2-zero-d/';
    if (n.includes('15mm f4.5')) return 'https://www.laowalens.com.cn/product/laowa-15mm-f4-5-zero-d-shift/';
    if (n.includes('20mm f4')) return 'https://www.laowalens.com.cn/product/laowa-20mm-f4-zero-d-shift/';
    if (n.includes('24mm f14') || n.includes('probe')) return 'https://www.laowalens.com.cn/product/laowa-24mm-f14-2x-macro-probe/';
    if (n.includes('58mm f2.8')) return 'https://www.laowalens.com.cn/product/laowa-58mm-f2-8-2x-ultra-macro-apo/';
    if (n.includes('90mm f2.8')) return 'https://www.laowalens.com.cn/product/laowa-90mm-f2-8-2x-macro-apo/';
    if (n.includes('100mm f2.8')) return 'https://www.laowalens.com.cn/product/laowa-100mm-f2-8-2x-ultra-macro-apo/';
    return 'https://www.laowalens.com.cn/';
  }

  // VOIGTLANDER 福伦达
  if (brandCategory === 'voigtlander') {
    return 'https://www.cosina.co.jp/voigtlander/e-mount/';
  }

  // TTARTISAN 铭匠
  if (brandCategory === 'ttartisan') {
    if (n.includes('75mm f2.0') || n.includes('75mm f2')) return 'https://www.ttartisan.com/?AF-Lens/AF-75.html';
    if (n.includes('35mm f1.8')) return 'https://www.ttartisan.com/?AF-Lens/AF-35.html';
    if (n.includes('32mm f2.8')) return 'https://www.ttartisan.com/?AF-Lens/AF-32.html';
    return 'https://www.ttartisan.com/';
  }

  // 7ARTISANS 七工匠
  if (brandCategory === '7artisans') {
    if (n.includes('50mm f1.8')) return 'https://www.7artisans.com/product/50mm-f1-8-af/';
    if (n.includes('85mm f1.8')) return 'https://www.7artisans.com/product/85mm-f1-8-af/';
    return 'https://www.7artisans.com/';
  }

  // YONGNUO 永诺
  if (brandCategory === 'yongnuo') {
    return 'http://www.hkyongnuo.com/product/index.html';
  }

  // MEIKE 美科
  if (bZh.includes('美科') || bEn.toLowerCase().includes('meike')) return 'https://meikeglobal.com/';

  // SIRUI 思锐
  if (bZh.includes('思锐') || bEn.toLowerCase().includes('sirui')) return 'https://www.sirui.com/';

  // TOKINA 图丽
  if (bZh.includes('图丽') || bEn.toLowerCase().includes('tokina')) return 'https://tokinalens.com/';

  // ASTRHORI 岩石星
  if (bZh.includes('岩石星') || bEn.toLowerCase().includes('astrhori')) return 'https://www.astrhori.cn/';

  // MITAKON 中一光学
  if (bZh.includes('中一光学') || bEn.toLowerCase().includes('mitakon') || bEn.toLowerCase().includes('zy')) return 'https://zyoptics.net/';

  // BRIGHTIN STAR 星曜
  if (bZh.includes('星曜') || bEn.toLowerCase().includes('brightin')) return 'https://brightinstar.com/';

  // LENSBABY
  if (bZh.includes('Lensbaby') || bEn.toLowerCase().includes('lensbaby')) return 'https://lensbaby.com/';

  // LOMOGRAPHY
  if (bZh.includes('Lomography') || bEn.toLowerCase().includes('lomography')) return 'https://www.lomography.com/';

  // MEYER OPTIK 梅耶
  if (bZh.includes('梅耶') || bEn.toLowerCase().includes('meyer')) return 'https://www.meyer-optik-goerlitz.com/';

  // KASE 卡色
  if (bZh.includes('卡色') || bEn.toLowerCase().includes('kase')) return 'https://www.kaseoptics.com/';

  // PERGEAR
  if (bZh.includes('Pergear') || bEn.toLowerCase().includes('pergear')) return 'https://www.pergear.com/';

  // KIPON
  if (bZh.includes('Kipon') || bEn.toLowerCase().includes('kipon')) return 'https://www.kipon.com/';

  // POLARPRO
  if (bZh.includes('PolarPro') || bEn.toLowerCase().includes('polarpro')) return 'https://www.polarpro.com/';

  // FUNLEADER
  if (bZh.includes('Funleader') || bEn.toLowerCase().includes('funleader')) return 'https://myfunleader.com/';

  // IRIX 艺睿
  if (bZh.includes('艺睿') || bEn.toLowerCase().includes('irix')) return 'https://irixlens.com/';

  // ZENITAR
  if (bZh.includes('Zenitar') || bEn.toLowerCase().includes('zenit')) return 'https://zenit.store/';

  // KENKO 肯高
  if (bZh.includes('肯高') || bEn.toLowerCase().includes('kenko')) return 'https://www.kenkoglobal.com/';

  // ROLLEI 禄莱
  if (bZh.includes('禄莱') || bEn.toLowerCase().includes('rollei')) return 'https://www.rollei.com/';

  // THINGYFY
  if (bZh.includes('Thingyfy') || bEn.toLowerCase().includes('thingyfy')) return 'https://thingyfy.com/';

  // YASUHARA
  if (bZh.includes('Yasuhara') || bEn.toLowerCase().includes('yasuhara')) return 'http://www.yasuhara.co.jp/';

  // ARTRALAB 叙
  if (bZh.includes('叙') || bEn.toLowerCase().includes('artra')) return 'https://www.artralab.com/';

  // CHAMELEON 变色龙
  if (bZh.includes('变色龙') || bEn.toLowerCase().includes('chameleon')) return 'https://www.chameleonlens.com/';

  // KERLEE
  if (bZh.includes('Kerlee') || bEn.toLowerCase().includes('kerlee')) return 'https://dzoptics.com/';

  // SG-IMAGE 深光影像
  if (bZh.includes('深光') || bEn.toLowerCase().includes('sg-image')) return 'https://sg-image.com/';

  // SONGRUO 松若
  if (bZh.includes('松若') || bEn.toLowerCase().includes('songruo')) return 'https://www.songruophoto.com/';

  // CHEKA 契卡
  if (bZh.includes('契卡') || bEn.toLowerCase().includes('cheka')) return 'https://www.chekaoptics.com/';

  // YACHUANG 雅创
  if (bZh.includes('雅创') || bEn.toLowerCase().includes('yachuang')) return 'https://www.yachuangoptics.com/';

  // DEFAULT
  return 'https://www.sony.com.cn/products/di/lens/';
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
    let focusType = cols[9] || '自动对焦 (AF)';
    let isAF = !focusType.includes('手动') && !focusType.includes('MF') && (focusType.includes('AF') || focusType.includes('自动'));
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

    // 官方参数校对与修正
    if (name.includes('90mm F2.8 Macro G OSS')) {
      filterThread = '62';
    }
    if (name.includes('12-24mm F4 G') || name.includes('12-24mm F2.8 GM') || name.includes('14mm F1.8 GM')) {
      filterThread = '-';
    }
    if (name.includes('300mm F2.8 GM OSS') || name.includes('400mm F2.8 GM OSS') || name.includes('600mm F4 GM OSS')) {
      filterThread = '40.5(插入式)';
      if (name.includes('300mm')) weightG = 1470;
    }
    if (name.includes('50-300mm') && brandCategory === 'tamron') {
      isAF = true;
      focusType = '自动对焦 (AF)';
      filterThread = '67';
    }
    if (name.includes('10mm F2.8') && brandCategory === 'laowa') {
      isAF = true;
      focusType = '自动对焦 (AF)';
      filterThread = '77';
      weightG = 420;
    }

    // 焦段类别分类
    const focalCategory = [];
    if (focalMin <= 24 || (focalMin < 28 && focalMax <= 28)) focalCategory.push('ultra-wide'); // 超广角
    if ((focalMin >= 24 && focalMin <= 35) || (focalMin <= 28 && focalMax >= 35)) focalCategory.push('wide'); // 广角
    if ((focalMin >= 35 && focalMin <= 60) || (focalMin <= 35 && focalMax >= 50)) focalCategory.push('standard'); // 标准/人文
    if ((focalMin >= 70 && focalMin <= 135) || (focalMin <= 70 && focalMax >= 135)) focalCategory.push('telephoto'); // 中远摄人像
    if (focalMax > 135 || focalMin > 135) focalCategory.push('super-telephoto'); // 远摄/超远摄

    const officialUrl = getOfficialUrl(name, brandCategory, brandZh, brandEn);
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
      officialUrl,
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
