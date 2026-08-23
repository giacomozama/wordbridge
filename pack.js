// pack.js
const fs = require('fs');

const MARKER = 0xFFF; // 12 one-bits; reserved, must never be a real data value

// ---------- bit writer ----------
class BitWriter {
  constructor() {
    this.bytes = [];
    this.cur = 0;      // current byte being filled
    this.curBits = 0;  // number of bits already in `cur` (0..7)
    this.chunkCount = 0;
  }

  writeBits(value, numBits) {
    for (let i = numBits - 1; i >= 0; i--) {
      const bit = (value >> i) & 1;
      this.cur = (this.cur << 1) | bit;
      this.curBits++;
      if (this.curBits === 8) {
        this.bytes.push(this.cur);
        this.cur = 0;
        this.curBits = 0;
      }
    }
  }

  write12(value) {
    if (value < 0 || value > 0xFFF) {
      throw new Error(`Value out of 12-bit range: ${value}`);
    }
    this.writeBits(value, 12);
    this.chunkCount++;
  }

  finish() {
    if (this.curBits > 0) {
      this.cur = this.cur << (8 - this.curBits); // pad remaining bits with 0
      this.bytes.push(this.cur);
    }
    return Buffer.from(this.bytes);
  }
}

function dedupeUnorderedPairs(pairs) {
  const seen = new Set();
  const result = [];

  for (const p of pairs) {
    if (!Array.isArray(p) || p.length !== 2) {
      throw new Error(`Invalid pair: ${JSON.stringify(p)}`);
    }
    const [x, y] = p;
    const lo = Math.min(x, y);
    const hi = Math.max(x, y);
    if (lo === MARKER || hi === MARKER) {
      throw new Error(`Value 0xFFF (4095) is reserved and cannot appear in data: [${x}, ${y}]`);
    }
    const key = lo * 4096 + hi;
    if (!seen.has(key)) {
      seen.add(key);
      result.push([lo, hi]);
    }
  }

  return result;
}

function groupByFirstItem(pairs) {
  const order = [];
  const map = new Map();

  for (const [lo, hi] of pairs) {
    if (!map.has(lo)) {
      map.set(lo, []);
      order.push(lo);
    }
    map.get(lo).push(hi);
  }

  return order.map(lo => ({ lo, his: map.get(lo) }));
}

function packGroups(groups) {
  const bw = new BitWriter();

  for (const { lo, his } of groups) {
    bw.write12(MARKER);
    bw.write12(lo);
    for (const hi of his) {
      bw.write12(hi);
    }
  }

  const body = bw.finish();

  // 4-byte header: total number of 12-bit chunks, so the reader knows
  // exactly where the bitstream ends (last byte may be zero-padded).
  const header = Buffer.alloc(4);
  header.writeUInt32BE(bw.chunkCount, 0);

  return Buffer.concat([header, body]);
}

function main() {
  const inputPath = process.argv[2] || 'input.json';
  const outputPath = process.argv[3] || 'output.bin';

  const rawPairs = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  if (!Array.isArray(rawPairs) || rawPairs.some(p => !Array.isArray(p) || p.length !== 2)) {
    throw new Error('Input JSON must be an array of [a, b] integer pairs');
  }

  const pairs = dedupeUnorderedPairs(rawPairs);
  const groups = groupByFirstItem(pairs);
  const buf = packGroups(groups);

  fs.writeFileSync(outputPath, buf);
  console.log(
    `Read ${rawPairs.length} pairs, deduped to ${pairs.length}, ` +
    `grouped into ${groups.length} groups, wrote ${buf.length} bytes -> ${outputPath}`
  );
}

main();
