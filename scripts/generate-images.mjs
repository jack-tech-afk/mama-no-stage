import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const heroDir = join(process.cwd(), 'public/images/heroes');
if (!existsSync(heroDir)) mkdirSync(heroDir, { recursive: true });

// Stage configs with warm, mama-friendly colors and cute SVG illustrations
const stages = {
  'trying': {
    label: '妊活',
    bg: ['#FFF0F5', '#FFE4EC'],
    accent: '#FF69B4',
    icon: `<g transform="translate(900,180) scale(0.8)">
      <circle cx="60" cy="60" r="55" fill="#FFB6C1" opacity="0.6"/>
      <path d="M60 25 C60 25, 30 50, 30 75 C30 95, 50 110, 60 110 C70 110, 90 95, 90 75 C90 50, 60 25, 60 25Z" fill="#FF69B4" opacity="0.8"/>
      <circle cx="45" cy="140" r="20" fill="#FFD1DC"/>
      <circle cx="75" cy="140" r="20" fill="#FFD1DC"/>
    </g>`
  },
  'trimester-1': {
    label: '妊娠初期',
    bg: ['#FFF8F0', '#FFE8D6'],
    accent: '#FF8C69',
    icon: `<g transform="translate(880,160) scale(0.9)">
      <circle cx="60" cy="50" r="30" fill="#FFDAB9"/>
      <ellipse cx="60" cy="120" rx="35" ry="45" fill="#FFB347" opacity="0.6"/>
      <circle cx="50" cy="42" r="3" fill="#333"/>
      <circle cx="70" cy="42" r="3" fill="#333"/>
      <path d="M52 58 Q60 65, 68 58" stroke="#333" fill="none" stroke-width="2"/>
      <path d="M35 85 Q25 70, 15 80" stroke="#FFDAB9" fill="none" stroke-width="8" stroke-linecap="round"/>
    </g>`
  },
  'trimester-2': {
    label: '妊娠中期',
    bg: ['#F0FFF0', '#E8F5E9'],
    accent: '#66BB6A',
    icon: `<g transform="translate(870,150) scale(0.9)">
      <circle cx="60" cy="45" r="30" fill="#FFDAB9"/>
      <ellipse cx="60" cy="130" rx="42" ry="52" fill="#A5D6A7" opacity="0.6"/>
      <circle cx="65" cy="135" r="20" fill="#FFDAB9" opacity="0.4"/>
      <circle cx="50" cy="37" r="3" fill="#333"/>
      <circle cx="70" cy="37" r="3" fill="#333"/>
      <path d="M52 53 Q60 60, 68 53" stroke="#333" fill="none" stroke-width="2"/>
    </g>`
  },
  'trimester-3': {
    label: '妊娠後期',
    bg: ['#F8F0FF', '#EDE7F6'],
    accent: '#9C27B0',
    icon: `<g transform="translate(860,140) scale(0.9)">
      <circle cx="60" cy="40" r="32" fill="#FFDAB9"/>
      <ellipse cx="60" cy="135" rx="48" ry="58" fill="#CE93D8" opacity="0.5"/>
      <circle cx="68" cy="140" r="25" fill="#FFDAB9" opacity="0.3"/>
      <circle cx="50" cy="32" r="3" fill="#333"/>
      <circle cx="70" cy="32" r="3" fill="#333"/>
      <path d="M52 48 Q60 56, 68 48" stroke="#333" fill="none" stroke-width="2"/>
      <path d="M30 100 Q18 85, 10 95" stroke="#FFDAB9" fill="none" stroke-width="8" stroke-linecap="round"/>
    </g>`
  },
  'newborn': {
    label: '新生児',
    bg: ['#F0F8FF', '#E3F2FD'],
    accent: '#42A5F5',
    icon: `<g transform="translate(870,160) scale(0.85)">
      <circle cx="60" cy="40" r="28" fill="#FFDAB9"/>
      <ellipse cx="60" cy="110" rx="35" ry="40" fill="#90CAF9" opacity="0.5"/>
      <circle cx="50" cy="33" r="3" fill="#333"/>
      <circle cx="70" cy="33" r="3" fill="#333"/>
      <path d="M52 47 Q60 53, 68 47" stroke="#333" fill="none" stroke-width="2"/>
      <ellipse cx="130" cy="100" rx="22" ry="18" fill="#FFE0B2"/>
      <circle cx="130" cy="85" r="14" fill="#FFE0B2"/>
      <circle cx="126" cy="82" r="2" fill="#333"/>
      <circle cx="134" cy="82" r="2" fill="#333"/>
      <path d="M60 85 Q95 70, 115 90" stroke="#FFDAB9" fill="none" stroke-width="7" stroke-linecap="round"/>
    </g>`
  },
  'infant': {
    label: '乳児',
    bg: ['#FFFFF0', '#FFF9C4'],
    accent: '#FFA726',
    icon: `<g transform="translate(880,170) scale(0.9)">
      <circle cx="60" cy="50" r="30" fill="#FFE0B2"/>
      <ellipse cx="60" cy="115" rx="28" ry="32" fill="#FFCC80" opacity="0.5"/>
      <circle cx="50" cy="43" r="3" fill="#333"/>
      <circle cx="70" cy="43" r="3" fill="#333"/>
      <path d="M48 58 Q60 68, 72 58" stroke="#333" fill="none" stroke-width="2"/>
      <path d="M35 130 Q30 155, 45 160" stroke="#FFE0B2" fill="none" stroke-width="7" stroke-linecap="round"/>
      <path d="M85 130 Q90 155, 75 160" stroke="#FFE0B2" fill="none" stroke-width="7" stroke-linecap="round"/>
    </g>`
  },
  'age-1': {
    label: '1歳',
    bg: ['#FFF3E0', '#FFE0B2'],
    accent: '#FF7043',
    icon: `<g transform="translate(880,165) scale(0.9)">
      <circle cx="60" cy="45" r="28" fill="#FFE0B2"/>
      <rect x="35" y="80" width="50" height="55" rx="10" fill="#FF8A65" opacity="0.5"/>
      <circle cx="50" cy="38" r="3" fill="#333"/>
      <circle cx="70" cy="38" r="3" fill="#333"/>
      <path d="M48 53 Q60 63, 72 53" stroke="#333" fill="none" stroke-width="2"/>
      <line x1="38" y1="135" x2="32" y2="170" stroke="#FFE0B2" stroke-width="7" stroke-linecap="round"/>
      <line x1="82" y1="135" x2="88" y2="170" stroke="#FFE0B2" stroke-width="7" stroke-linecap="round"/>
    </g>`
  },
  'age-2': {
    label: '2歳',
    bg: ['#E8F5E9', '#C8E6C9'],
    accent: '#4CAF50',
    icon: `<g transform="translate(880,165) scale(0.9)">
      <circle cx="60" cy="45" r="28" fill="#FFE0B2"/>
      <rect x="33" y="78" width="54" height="55" rx="10" fill="#81C784" opacity="0.5"/>
      <circle cx="50" cy="38" r="3" fill="#333"/>
      <circle cx="70" cy="38" r="3" fill="#333"/>
      <path d="M48 53 Q60 63, 72 53" stroke="#333" fill="none" stroke-width="2"/>
      <path d="M90 90 L110 75" stroke="#FFE0B2" stroke-width="7" stroke-linecap="round"/>
      <circle cx="115" cy="70" r="10" fill="#FFF176"/>
    </g>`
  },
  'age-3': {
    label: '3歳',
    bg: ['#E3F2FD', '#BBDEFB'],
    accent: '#2196F3',
    icon: `<g transform="translate(880,160) scale(0.9)">
      <circle cx="60" cy="45" r="28" fill="#FFE0B2"/>
      <rect x="33" y="78" width="54" height="55" rx="10" fill="#64B5F6" opacity="0.5"/>
      <circle cx="50" cy="38" r="3" fill="#333"/>
      <circle cx="70" cy="38" r="3" fill="#333"/>
      <path d="M48 53 Q60 63, 72 53" stroke="#333" fill="none" stroke-width="2"/>
      <rect x="100" y="80" width="25" height="35" rx="5" fill="#EF9A9A"/>
      <rect x="95" y="120" width="35" height="8" rx="3" fill="#A5D6A7"/>
    </g>`
  },
  'preschool': {
    label: '4〜6歳',
    bg: ['#FCE4EC', '#F8BBD0'],
    accent: '#E91E63',
    icon: `<g transform="translate(875,155) scale(0.9)">
      <circle cx="60" cy="42" r="28" fill="#FFE0B2"/>
      <rect x="33" y="75" width="54" height="60" rx="10" fill="#F48FB1" opacity="0.5"/>
      <circle cx="50" cy="35" r="3" fill="#333"/>
      <circle cx="70" cy="35" r="3" fill="#333"/>
      <path d="M48 50 Q60 60, 72 50" stroke="#333" fill="none" stroke-width="2"/>
      <rect x="30" y="20" width="60" height="12" rx="6" fill="#FFD54F"/>
    </g>`
  },
  'elementary': {
    label: '小学生',
    bg: ['#E8EAF6', '#C5CAE9'],
    accent: '#3F51B5',
    icon: `<g transform="translate(875,150) scale(0.9)">
      <circle cx="60" cy="40" r="28" fill="#FFE0B2"/>
      <rect x="30" y="73" width="60" height="65" rx="10" fill="#7986CB" opacity="0.5"/>
      <circle cx="50" cy="33" r="3" fill="#333"/>
      <circle cx="70" cy="33" r="3" fill="#333"/>
      <path d="M48 48 Q60 58, 72 48" stroke="#333" fill="none" stroke-width="2"/>
      <rect x="100" y="85" width="30" height="40" rx="3" fill="#FFE082"/>
      <line x1="105" y1="95" x2="125" y2="95" stroke="#333" stroke-width="1"/>
      <line x1="105" y1="102" x2="125" y2="102" stroke="#333" stroke-width="1"/>
      <line x1="105" y1="109" x2="120" y2="109" stroke="#333" stroke-width="1"/>
    </g>`
  },
};

function createSVG(stage, label, bgColors, accent, icon, width = 1200, height = 630) {
  // Decorative bubbles
  const bubbles = Array.from({length: 12}, (_, i) => {
    const x = 50 + Math.sin(i * 1.8) * 400 + i * 80;
    const y = 50 + Math.cos(i * 2.1) * 200 + (i % 3) * 100;
    const r = 15 + (i % 4) * 12;
    const opacity = 0.08 + (i % 3) * 0.04;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${accent}" opacity="${opacity}"/>`;
  }).join('');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColors[0]}"/>
        <stop offset="100%" style="stop-color:${bgColors[1]}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)" rx="0"/>
    ${bubbles}
    <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="24" fill="white" opacity="0.45"/>
    <rect x="50" y="${height - 90}" width="180" height="40" rx="20" fill="${accent}" opacity="0.9"/>
    <text x="140" y="${height - 64}" text-anchor="middle" font-family="'Hiragino Kaku Gothic Pro', 'Yu Gothic', sans-serif" font-size="18" fill="white" font-weight="bold">${label}</text>
    <text x="80" y="140" font-family="'Hiragino Kaku Gothic Pro', 'Yu Gothic', sans-serif" font-size="52" fill="#333" font-weight="bold">ママのステージ</text>
    <text x="80" y="195" font-family="'Hiragino Kaku Gothic Pro', 'Yu Gothic', sans-serif" font-size="22" fill="#666">妊娠・出産・育児の情報サイト</text>
    <line x1="80" y1="215" x2="350" y2="215" stroke="${accent}" stroke-width="3" opacity="0.5"/>
    ${icon}
  </svg>`;
}

function createOGDefault(width = 1200, height = 630) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFF0F5"/>
        <stop offset="50%" style="stop-color:#FFF8F0"/>
        <stop offset="100%" style="stop-color:#F0F8FF"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    ${Array.from({length: 15}, (_, i) => {
      const x = 60 + i * 80;
      const y = 80 + Math.sin(i) * 200;
      const r = 20 + (i % 5) * 10;
      const colors = ['#FFB6C1', '#FFD1DC', '#B3E5FC', '#C8E6C9', '#FFE0B2'];
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${colors[i % 5]}" opacity="0.15"/>`;
    }).join('')}
    <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="30" fill="white" opacity="0.5"/>
    <text x="${width/2}" y="200" text-anchor="middle" font-family="'Hiragino Kaku Gothic Pro', 'Yu Gothic', sans-serif" font-size="72" fill="#E91E63" font-weight="bold">ママのステージ</text>
    <text x="${width/2}" y="270" text-anchor="middle" font-family="'Hiragino Kaku Gothic Pro', 'Yu Gothic', sans-serif" font-size="28" fill="#666">妊娠・出産・育児の情報サイト</text>
    <line x1="350" y1="300" x2="850" y2="300" stroke="#E91E63" stroke-width="2" opacity="0.3"/>
    <g transform="translate(${width/2 - 120}, 330)">
      <circle cx="60" cy="50" r="25" fill="#FFDAB9"/>
      <ellipse cx="60" cy="100" rx="30" ry="35" fill="#FFB6C1" opacity="0.5"/>
      <circle cx="53" cy="44" r="2.5" fill="#333"/>
      <circle cx="67" cy="44" r="2.5" fill="#333"/>
      <path d="M55 56 Q60 62, 65 56" stroke="#333" fill="none" stroke-width="1.5"/>
      <ellipse cx="120" cy="95" rx="16" ry="14" fill="#FFE0B2"/>
      <circle cx="120" cy="82" r="12" fill="#FFE0B2"/>
      <circle cx="117" cy="80" r="2" fill="#333"/>
      <circle cx="123" cy="80" r="2" fill="#333"/>
      <path d="M60 78 Q90 65, 108 85" stroke="#FFDAB9" fill="none" stroke-width="6" stroke-linecap="round"/>
      <circle cx="180" cy="85" r="20" fill="#FFE0B2"/>
      <rect x="163" y="108" width="34" height="40" rx="8" fill="#90CAF9" opacity="0.5"/>
      <circle cx="175" cy="80" r="2" fill="#333"/>
      <circle cx="185" cy="80" r="2" fill="#333"/>
      <path d="M176 90 Q180 95, 184 90" stroke="#333" fill="none" stroke-width="1.5"/>
    </g>
    <text x="${width/2}" y="530" text-anchor="middle" font-family="'Hiragino Kaku Gothic Pro', 'Yu Gothic', sans-serif" font-size="18" fill="#999">妊活から小学生まで、ステージ別にサポート</text>
  </svg>`;
}

async function main() {
  console.log('Generating OG default image...');
  const ogSvg = createOGDefault();
  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(join(process.cwd(), 'public/og-default.png'));
  console.log('✅ og-default.png');

  for (const [stage, config] of Object.entries(stages)) {
    const svg = createSVG(stage, config.label, config.bg, config.accent, config.icon);
    const filename = `hero-${stage}.png`;
    await sharp(Buffer.from(svg))
      .png()
      .toFile(join(heroDir, filename));
    console.log(`✅ ${filename}`);
  }

  console.log(`\nDone! Generated ${Object.keys(stages).length + 1} images.`);
}

main().catch(console.error);
