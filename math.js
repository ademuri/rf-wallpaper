function intLog10(number) {
  return Math.round(Math.log10(number));
}

function formatNumber(number) {
  const magnitude = Math.trunc(intLog10(number) / 3);
  const prefixes = new Map([
    [-1, "m"],
    [0, ""],
    [1, "k"],
    [2, "M"],
    [3, "G"],
  ]);

  const prefix = prefixes.get(magnitude);
  if (prefix === undefined) {
    return number;
  }

  const remainder = number / Math.pow(1000, magnitude);

  return `${remainder} ${prefix}`;
}

const outputTestsToConsole = false;

new UnitTester("intLog10", "handles even powers of 10",
  () => {
    UnitTester.assert_strict_equal(intLog10(1), 0);
    UnitTester.assert_strict_equal(intLog10(10), 1);
    UnitTester.assert_strict_equal(intLog10(100), 2);
  }
).test(outputTestsToConsole);

new UnitTester("intLog10", "handles non-powers of 10",
  () => {
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
    UnitTester.assert_strict_equal(formatNumber(1), "1 ");
    UnitTester.assert_strict_equal(formatNumber(1000), "1 k");
    UnitTester.assert_strict_equal(formatNumber(1000 * 1000), "1 M");
    UnitTester.assert_strict_equal(formatNumber(1000 * 1000 * 1000), "1 G");
  }
).test(outputTestsToConsole);
