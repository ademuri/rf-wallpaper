import { Unit, ValueHighlight } from "../types";

const prefixes = new Map([
  [-6, "a"],
  [-5, "f"],
  [-4, "p"],
  [-3, "n"],
  [-2, "μ"],
  [-1, "m"],
  [0, ""],
  [1, "k"],
  [2, "M"],
  [3, "G"],
]);
const reversePrefixes = new Map([
  ["a", -6],
  ["f", -5],
  ["p", -4],
  ["n", -3],
  ["μ", -2],
  ["u", -2],
  ["m", -1],
  ["", 0],
  ["k", 1],
  ["M", 2],
  ["G", 3],
]);



const units = new Map([
  ["hz", Unit.Frequency],
  // This uses the lowercase form of omega - even though a user (probably)
  // wouldn't use it, it matches simply lowercasing the text and checking the
  // suffix below.
  ["ω", Unit.Resistance],
  ["r", Unit.Resistance],
  ["f", Unit.Capacitance],
  ["h", Unit.Inductance],
]);

export function intLog10(number: number): number {
  return Math.round(Math.log10(number));
}

export function formatNumber(number: number, sigFigs = 0): string {
  if (number === 0) {
    return "";
  }

  const rawMagnitude = Math.log10(number) / 3;
  let magnitude = Math.trunc(rawMagnitude);
  if (rawMagnitude < 0) {
    magnitude--;
  }

  let prefix = prefixes.get(magnitude);

  let remainder = number / Math.pow(1000, magnitude);

  let decimals = 0;
  if (sigFigs > 0) {
    decimals = sigFigs - intLog10(remainder) - 1;
    if (decimals < 1) {
      decimals = 0;
    }
  }
  remainder = Number(remainder.toFixed(decimals));

  // Work around rounding errors with small values
  if (remainder % 10 === 9) {
    remainder++;
  }
  if (remainder === 1000) {
    remainder = 1;
    magnitude++;
    prefix = prefixes.get(magnitude);
  }

  if (prefix === undefined) {
    throw new Error(
      `No prefix found for number '${number}' - magnitude '${magnitude}'`,
    );
  }

  return `${remainder} ${prefix}`;
}

export function parseNumber(text: string): ValueHighlight | null {
  text = text.trim();
  if (text.length === 0) {
    return null;
  }

  const valueHighlight: ValueHighlight = {
    unit: Unit.None,
    value: 0,
    // Note: trimmed but not canonicalized
    display: text,
    color: '',
  };

  for (const [name, unit] of units) {
    if (text.toLowerCase().endsWith(name)) {
      valueHighlight.unit = unit;
      text = text.slice(0, -(name.length + 0));
      break;
    }
  }

  text = text.trim();
  if (text.match(/\D$/) === null) {
    valueHighlight.value = Number(text);
    return valueHighlight;
  }

  const prefix = text.at(text.length - 1);
  let prefixValue: number|null = null;
  for (const [name, value] of reversePrefixes) {
    if (prefix === name) {
      prefixValue = value;
      break;
    }
  }

  if (prefixValue === null) {
    throw new Error(`Prefix not found: ${prefix}, text: ${text}`);
    // return null;
  }
  
  valueHighlight.value = Number(text.slice(0, -1)) * Math.pow(1000, prefixValue);

  return valueHighlight;
}
