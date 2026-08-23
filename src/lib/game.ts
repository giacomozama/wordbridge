import { DICT } from "./dict.ts";

const DICT_SET = new Set<string>(DICT);

export function isNeighbor(a: string, b: string): boolean {
  if (a === b) return false;
  if (a === b.split("").reverse().join("")) return true;
  let found = false;
  for (let i = 0; i < 4; i++) {
    if (a.charAt(i) === b.charAt(i)) continue;
    if (found) return false;
    found = true;
  }
  return found;
}

const MARKER = 0xfff; // 12 one-bits; reserved delimiter, never a real data value

class BitReader {
  bytes: Uint8Array;
  byteIdx: number;
  bitPos: number; // 0..7, next bit to read within current byte

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
    this.byteIdx = 0;
    this.bitPos = 0;
  }

  read12(): number {
    let value = 0;
    for (let i = 0; i < 12; i++) {
      const bit = (this.bytes[this.byteIdx] >> (7 - this.bitPos)) & 1;
      value = (value << 1) | bit;
      this.bitPos++;
      if (this.bitPos === 8) {
        this.bitPos = 0;
        this.byteIdx++;
      }
    }
    return value;
  }
}

export function unpackPairs(arrayBuffer: ArrayBuffer): number[][] {
  const view = new DataView(arrayBuffer);
  const chunkCount = view.getUint32(0, false); // big-endian
  const body = new Uint8Array(arrayBuffer, 4);

  const br = new BitReader(body);
  const pairs: number[][] = [];
  let lo: number | null = null;

  for (let i = 0; i < chunkCount; i++) {
    const v = br.read12();
    if (v === MARKER) {
      lo = null; // next chunk starts a new group's first item
      continue;
    }
    if (lo === null) {
      lo = v;
    } else {
      pairs.push([lo, v]);
    }
  }

  return pairs;
}

export async function loadPairsFromUrl(url: string): Promise<number[][]> {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return unpackPairs(arrayBuffer);
}

function neighbors(word: string): string[] {
  const result: string[] = [];
  const reversed = word.split("").reverse().join("");
  if (reversed !== word && DICT_SET.has(reversed)) result.push(reversed);
  for (let i = 0; i < word.length; i++) {
    for (let code = 65; code < 91; code++) {
      if (code === word.charCodeAt(i)) continue;
      const candidate =
        word.slice(0, i) + String.fromCharCode(code) + word.slice(i + 1);
      if (DICT_SET.has(candidate)) result.push(candidate);
    }
  }
  return result;
}

export function minimumGuesses(start: string, target: string): number | null {
  if (start === target) return 1;
  const visited = new Set<string>([start]);
  let frontier: string[] = [start];
  let depth = 1;
  while (frontier.length > 0) {
    const next: string[] = [];
    for (const word of frontier) {
      for (const neighbor of neighbors(word)) {
        if (neighbor === target) return depth + 1;
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          next.push(neighbor);
        }
      }
    }
    frontier = next;
    depth++;
  }
  return null;
}

export function bestPath(start: string, target: string): string[] | null {
  if (start === target) return [start];
  const visited = new Set<string>([start]);
  const cameFrom = new Map<string, string>();
  let frontier: string[] = [start];
  while (frontier.length > 0) {
    const next: string[] = [];
    for (const word of frontier) {
      for (const neighbor of neighbors(word)) {
        if (visited.has(neighbor)) continue;
        visited.add(neighbor);
        cameFrom.set(neighbor, word);
        if (neighbor === target) {
          const path = [neighbor];
          let cur = word;
          while (cur !== start) {
            path.unshift(cur);
            cur = cameFrom.get(cur)!;
          }
          path.unshift(start);
          return path;
        }
        next.push(neighbor);
      }
    }
    frontier = next;
  }
  return null;
}

export { DICT, DICT_SET };
