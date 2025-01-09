function intLog10(number) {
  return Math.round(Math.log10(number));
}

function formatNumber(number, decimals=0) {
  const rawMagnitude = intLog10(number) / 3;
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

  let remainder = (number / Math.pow(1000, magnitude)).toFixed(decimals);
  // Work around rounding errors with small values
  if (remainder % 10 == 9) {
    remainder++;
  }
  if (remainder == 1000) {
    remainder = 1;
    magnitude++;
    prefix = prefixes.get(magnitude);
  }

  if (prefix === undefined) {
    return number;
  }

  return `${remainder} ${prefix}`;
}

const outputTestsToConsole = true;

new UnitTester("intLog10", "handles even powers of 10",
  () => {
    UnitTester.assert_strict_equal(intLog10(0.01), -2);
    UnitTester.assert_strict_equal(intLog10(0.1), -1);
    UnitTester.assert_strict_equal(intLog10(1), 0);
    UnitTester.assert_strict_equal(intLog10(10), 1);
    UnitTester.assert_strict_equal(intLog10(100), 2);
  }
).test(outputTestsToConsole);

new UnitTester("intLog10", "handles non-powers of 10",
  () => {
    UnitTester.assert_strict_equal(intLog10(0.02), -2);
    UnitTester.assert_strict_equal(intLog10(2), 0);
    UnitTester.assert_strict_equal(intLog10(11), 1);
    UnitTester.assert_strict_equal(intLog10(102), 2);
  }
).test(outputTestsToConsole);

new UnitTester("formatNumber", "formats numbers 1-100",
  () => {
    UnitTester.assert_strict_equal(formatNumber(1), "1 ");
    UnitTester.assert_strict_equal(formatNumber(10), "10 ");
    UnitTester.assert_strict_equal(formatNumber(100), "100 ");
  }
).test(outputTestsToConsole);

new UnitTester("formatNumber", "uses the right prefixes",
  () => {
    UnitTester.assert_strict_equal(formatNumber(0.1 / 1000), "100 μ");
    UnitTester.assert_strict_equal(formatNumber(0.1), "100 m");
    UnitTester.assert_strict_equal(formatNumber(1), "1 ");
    UnitTester.assert_strict_equal(formatNumber(1000), "1 k");
    UnitTester.assert_strict_equal(formatNumber(1000 * 1000), "1 M");
    UnitTester.assert_strict_equal(formatNumber(1000 * 1000 * 1000), "1 G");
  }
).test(outputTestsToConsole);

new UnitTester("formatNumber", "uses the right prefixes for tiny numbers",
  () => {
    UnitTester.assert_strict_equal(formatNumber(1 / (1000 * 1000)), "1 μ");
    UnitTester.assert_strict_equal(formatNumber(1 / (1000 * 1000 * 1000)), "1 n");
    UnitTester.assert_strict_equal(formatNumber(1 / (1000 * 1000 * 1000 * 1000)), "1 p");
    UnitTester.assert_strict_equal(formatNumber(1 / (1000 * 1000 * 1000 * 1000 * 1000)), "1 f");
    UnitTester.assert_strict_equal(formatNumber(1 / (1000 * 1000 * 1000 * 1000 * 1000 * 1000)), "1 a");
  }
).test(outputTestsToConsole);

new UnitTester("formatNumber", "supports decimal places",
  () => {
    UnitTester.assert_strict_equal(formatNumber(1000, 1), "1.0 k");
    UnitTester.assert_strict_equal(formatNumber(1100, 1), "1.1 k");
    UnitTester.assert_strict_equal(formatNumber(900, 1), "0.9 k");
  }
).test(outputTestsToConsole);
