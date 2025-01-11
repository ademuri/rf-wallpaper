
export function intLog10(number: number): number {
  return Math.round(Math.log10(number));
}

export function formatNumber(number: number, sigFigs = 0): string {
  const rawMagnitude = Math.log10(number) / 3;
  let magnitude = Math.trunc(rawMagnitude);
  if (rawMagnitude < 0) {
    magnitude--;
  }
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

  let prefix = prefixes.get(magnitude);

  let remainder = (number / Math.pow(1000, magnitude));

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
    throw new Error(`No prefix found for number '${number}'`);
  }

  return `${remainder} ${prefix}`;
}