import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SVG_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512">
  <defs>
    <linearGradient id="tile-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#d4d4d8" />
      <stop offset="100%" stopColor="#71717a" />
    </linearGradient>
    <radialGradient id="mine-sphere" cx="35%" cy="32%" r="65%">
      <stop offset="0%" stopColor="#52525b" />
      <stop offset="35%" stopColor="#27272a" />
      <stop offset="85%" stopColor="#09090b" />
      <stop offset="100%" stopColor="#000000" />
    </radialGradient>
    <radialGradient id="shine" cx="35%" cy="30%" r="40%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
      <stop offset="60%" stopColor="#ffffff" stopOpacity="0.1" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="flag-color" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0%" stopColor="#ef4444" />
      <stop offset="60%" stopColor="#dc2626" />
      <stop offset="100%" stopColor="#991b1b" />
    </linearGradient>
    <filter id="drop-shadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.6" />
    </filter>
  </defs>

  <!-- 3D Beveled Tile -->
  <rect x="2" y="2" width="60" height="60" rx="12" fill="#c0c0c0" stroke="#808080" stroke-width="1" />
  <path d="M 2 14 A 12 12 0 0 1 14 2 L 50 2 L 44 8 L 14 8 A 6 6 0 0 0 8 14 L 8 44 L 2 50 Z" fill="#ffffff" opacity="0.9" />
  <path d="M 62 50 A 12 12 0 0 1 50 62 L 14 62 L 20 56 L 50 56 A 6 6 0 0 0 56 50 L 56 20 L 62 14 Z" fill="#606060" />

  <!-- Naval Contact Mine -->
  <g filter="url(#drop-shadow)">
    <line x1="28" y1="18" x2="28" y2="44" stroke="#18181b" stroke-width="4.5" stroke-linecap="round" />
    <line x1="15" y1="31" x2="41" y2="31" stroke="#18181b" stroke-width="4.5" stroke-linecap="round" />
    <line x1="19" y1="22" x2="37" y2="40" stroke="#18181b" stroke-width="4" stroke-linecap="round" />
    <line x1="19" y1="40" x2="37" y2="22" stroke="#18181b" stroke-width="4" stroke-linecap="round" />

    <circle cx="28" cy="17" r="2.5" fill="#111" />
    <circle cx="28" cy="45" r="2.5" fill="#111" />
    <circle cx="14" cy="31" r="2.5" fill="#111" />
    <circle cx="42" cy="31" r="2.5" fill="#111" />
    <circle cx="18" cy="21" r="2.2" fill="#111" />
    <circle cx="38" cy="41" r="2.2" fill="#111" />
    <circle cx="18" cy="41" r="2.2" fill="#111" />
    <circle cx="38" cy="21" r="2.2" fill="#111" />

    <circle cx="28" cy="31" r="11" fill="url(#mine-sphere)" />
    <circle cx="24.5" cy="27.5" r="4.5" fill="url(#shine)" />
  </g>

  <!-- Crimson Flag -->
  <g filter="url(#drop-shadow)">
    <path d="M 46 16 L 46 48" stroke="#18181b" stroke-width="2.5" stroke-linecap="round" />
    <circle cx="46" cy="15" r="2" fill="#f59e0b" />
    <path d="M 46 17 L 31 24 L 46 31 Z" fill="url(#flag-color)" />
    <path d="M 42 48 L 50 48 L 48 46 L 44 46 Z" fill="#3f3f46" />
  </g>
</svg>`;

const OG_IMAGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#020617"/>
      <stop offset="100%" stopColor="#0f172a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#f59e0b"/>
      <stop offset="100%" stopColor="#fbbf24"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Subtle Grid lines -->
  <g stroke="#1e293b" stroke-width="1" opacity="0.6">
    <line x1="0" y1="100" x2="1200" y2="100"/>
    <line x1="0" y1="200" x2="1200" y2="200"/>
    <line x1="0" y1="300" x2="1200" y2="300"/>
    <line x1="0" y1="400" x2="1200" y2="400"/>
    <line x1="0" y1="500" x2="1200" y2="500"/>
  </g>

  <!-- Large Bomb Icon Graphic on Right -->
  <g transform="translate(780, 160) scale(4.5)">
    <rect x="2" y="2" width="60" height="60" rx="12" fill="#c0c0c0" stroke="#808080" stroke-width="1"/>
    <circle cx="28" cy="31" r="11" fill="#18181b"/>
    <circle cx="24.5" cy="27.5" r="4.5" fill="#fff" opacity="0.8"/>
    <path d="M 46 17 L 31 24 L 46 31 Z" fill="#ef4444"/>
    <line x1="46" y1="16" x2="46" y2="48" stroke="#000" stroke-width="2.5"/>
  </g>

  <!-- Brand Typography -->
  <g transform="translate(100, 180)">
    <!-- Pill -->
    <rect x="0" y="0" width="180" height="38" rx="19" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="90" y="24" font-family="-apple-system, sans-serif" font-size="16" font-weight="900" fill="#f59e0b" text-anchor="middle">
      100% 무료 무설치
    </text>

    <!-- Main Title -->
    <text x="0" y="110" font-family="-apple-system, sans-serif" font-size="68" font-weight="900" fill="#ffffff" letter-spacing="-1">
      웹지뢰찾기
    </text>
    <text x="360" y="110" font-family="-apple-system, sans-serif" font-size="48" font-weight="700" fill="#94a3b8">
      WebMinesweeper
    </text>

    <!-- Tagline -->
    <text x="0" y="175" font-family="-apple-system, sans-serif" font-size="28" font-weight="600" fill="#cbd5e1">
      설치 없는 클래식 윈도우 지뢰찾기 &amp; 직장인 사내망 보스 키
    </text>

    <!-- Badges -->
    <g transform="translate(0, 230)">
      <rect x="0" y="0" width="160" height="42" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="80" y="27" font-family="-apple-system, sans-serif" font-size="16" font-weight="700" fill="#e2e8f0" text-anchor="middle">
        ⚡ 0.3초 로딩
      </text>

      <rect x="180" y="0" width="180" height="42" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="270" y="27" font-family="-apple-system, sans-serif" font-size="16" font-weight="700" fill="#e2e8f0" text-anchor="middle">
        👔 보스 키 (ESC)
      </text>

      <rect x="380" y="0" width="180" height="42" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="470" y="27" font-family="-apple-system, sans-serif" font-size="16" font-weight="700" fill="#e2e8f0" text-anchor="middle">
        🛡️ 첫 클릭 안전 보장
      </text>
    </g>
  </g>
</svg>`;

async function packIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  let currentOffset = 6 + count * 16;

  for (let i = 0; i < count; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(currentOffset, 12);
    dirEntries.push(entry);
    currentOffset += buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

async function main() {
  const publicDir = path.resolve('public');
  const appDir = path.resolve('src/app');

  await fs.mkdir(publicDir, { recursive: true });
  await fs.mkdir(appDir, { recursive: true });

  const svgBuffer = Buffer.from(SVG_LOGO);

  // 1. Write favicon.svg
  await fs.writeFile(path.join(publicDir, 'favicon.svg'), svgBuffer);
  console.log('✓ public/favicon.svg created');

  // 2. Render PNG sizes
  const sizes = [16, 32, 48, 180, 192, 512];
  const rendered = {};
  for (const size of sizes) {
    rendered[size] = await sharp(svgBuffer).resize(size, size).png().toBuffer();
  }

  await fs.writeFile(path.join(publicDir, 'favicon-16x16.png'), rendered[16]);
  await fs.writeFile(path.join(publicDir, 'favicon-32x32.png'), rendered[32]);
  await fs.writeFile(path.join(publicDir, 'favicon-48x48.png'), rendered[48]);
  await fs.writeFile(path.join(publicDir, 'apple-touch-icon.png'), rendered[180]);
  await fs.writeFile(path.join(publicDir, 'icon-192.png'), rendered[192]);
  await fs.writeFile(path.join(publicDir, 'icon.png'), rendered[512]);
  console.log('✓ All PNG icons created');

  // 3. Multi-resolution ICO (16, 32, 48)
  const icoBuffer = await packIco([rendered[16], rendered[32], rendered[48]], [16, 32, 48]);
  await fs.writeFile(path.join(appDir, 'favicon.ico'), icoBuffer);
  await fs.writeFile(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Multi-resolution favicon.ico packed');

  // 4. OG Image (1200x630)
  const ogBuffer = await sharp(Buffer.from(OG_IMAGE_SVG)).png().toBuffer();
  await fs.writeFile(path.join(publicDir, 'og-image.png'), ogBuffer);
  console.log('✓ public/og-image.png created');

  // 5. site.webmanifest
  const manifest = {
    name: '웹지뢰찾기 - WebMinesweeper',
    short_name: '웹지뢰찾기',
    description: '설치 없는 무료 클래식 윈도우 웹 지뢰찾기 게임',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
  };
  await fs.writeFile(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('✓ public/site.webmanifest created');
}

main().catch(console.error);
