// One-time asset utility: crops empty padding from glowalchemy-logo.png.
// Dependency-free PNG (RGB, 8-bit) decoder/encoder using Node's zlib.
const fs = require('fs');
const zlib = require('zlib');

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function readPng(path) {
  const buf = fs.readFileSync(path);
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('Not a PNG');
  let off = 8;
  let w = 0, h = 0, bitDepth = 0, colorType = 0, interlace = 0;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0);
      h = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    off += 12 + len;
  }
  if (bitDepth !== 8 || colorType !== 2) throw new Error(`Unsupported: bitDepth=${bitDepth} colorType=${colorType}`);
  if (interlace !== 0) throw new Error('Interlaced PNG not supported');
  const raw = zlib.inflateSync(Buffer.concat(idat));
  return { w, h, raw };
}

function unfilter({ w, h, raw }) {
  const bpp = 3;
  const stride = w * bpp;
  const out = Buffer.alloc(stride * h);
  let pos = 0;
  const paeth = (a, b, c) => {
    const p = a + b - c;
    const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < h; y++) {
    const filter = raw[pos++];
    const row = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? row[x - bpp] : 0;
      const b = prev ? prev[x] : 0;
      const c = x >= bpp && prev ? prev[x - bpp] : 0;
      let v = raw[pos++];
      if (filter === 1) v = (v + a) & 0xff;
      else if (filter === 2) v = (v + b) & 0xff;
      else if (filter === 3) v = (v + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) v = (v + paeth(a, b, c)) & 0xff;
      else if (filter !== 0) throw new Error(`Bad filter ${filter}`);
      row[x] = v;
    }
  }
  return out;
}

const { w, h, raw } = readPng(process.argv[2]);
const pixels = unfilter({ w, h, raw });

// Usage: node crop-logo.cjs <in> <out> [cropX cropY cropW cropH]
// Default: trim the empty top band, keep a natural margin on the sides/bottom.
const cropX = Number(process.argv[4] ?? 0);
const cropY = Number(process.argv[5] ?? 50);
const cropW = Number(process.argv[6] ?? w);
const cropH = Number(process.argv[7] ?? h - cropY);
const bpp = 3, stride = w * bpp;
const out = Buffer.alloc(cropH * (cropW * bpp + 1));
for (let y = 0; y < cropH; y++) {
  out[y * (cropW * bpp + 1)] = 0; // filter None
  pixels.copy(out, y * (cropW * bpp + 1) + 1, (y + cropY) * stride + cropX * bpp, (y + cropY) * stride + (cropX + cropW) * bpp);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(cropW, 0);
ihdr.writeUInt32BE(cropH, 4);
ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(out, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);
fs.writeFileSync(process.argv[3], png);
console.log(`cropped ${w}x${h} -> ${cropW}x${cropH} (top trim ${cropY}px)`);
