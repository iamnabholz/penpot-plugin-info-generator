const COLORS_NB = 9
const SATURATION = 95
const LIGHTNESS = 45

const MAGIC_NUMBER = 5

function simpleHash(str: string) {
  return str.split('')
    .reduce((hash, char) => (hash ^ char.charCodeAt(0)) * -MAGIC_NUMBER, MAGIC_NUMBER)
    >>> 2
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function getRandomColor(seed: string, hashFn = simpleHash) {
  const hash = hashFn(seed);
  const hue = (hash % COLORS_NB) * (360 / COLORS_NB);
  //const saturation = Math.random() * SATURATION;
  //const lightness = Math.random() * LIGHTNESS;
  return hslToHex(hue, SATURATION, LIGHTNESS);
}

export function minidenticon(seed = "", hashFn = simpleHash) {
  const hash = hashFn(seed);

  return [...Array(seed ? 25 : 0)].reduce((acc, _, i) =>
    hash & (1 << (i % 15)) ?
      acc + `<rect x="${(i > 14 ? 7 - ~~(i / 5) : ~~(i / 5)) * 10}" y="${(i % 5) * 10}" width="10" height="10"/>`
      : acc,
    `<svg viewBox="-15 -15 80 80" xmlns="http://www.w3.org/2000/svg">`
  )
    + '</svg>'
}
