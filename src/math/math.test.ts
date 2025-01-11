import { intLog10, formatNumber } from "./math";

describe("intLog10", () => {
  it("handles even powers of 10", () => {
    expect(intLog10(0.01)).toBe(-2);
    expect(intLog10(0.1)).toBe(-1);
    expect(intLog10(1)).toBe(0);
    expect(intLog10(10)).toBe(1);
    expect(intLog10(100)).toBe(2);
  });

  it("handles non-powers of 10", () => {
    expect(intLog10(0.02)).toBe(-2);
    expect(intLog10(2)).toBe(0);
    expect(intLog10(11)).toBe(1);
    expect(intLog10(102)).toBe(2);
  });
});

describe("formatNumber", () => {
  it("formats numbers 1-100", () => {
    expect(formatNumber(1)).toBe("1 ");
    expect(formatNumber(10)).toBe("10 ");
    expect(formatNumber(100)).toBe("100 ");
  });

  it("uses the right prefixes", () => {
    expect(formatNumber(0.1 / 1000)).toBe("100 μ");
    expect(formatNumber(0.1)).toBe("100 m");
    expect(formatNumber(1)).toBe("1 ");
    expect(formatNumber(1000)).toBe("1 k");
    expect(formatNumber(1000 * 1000)).toBe("1 M");
    expect(formatNumber(1000 * 1000 * 1000)).toBe("1 G");
  });

  it("uses the right prefixes for tiny numbers", () => {
    expect(formatNumber(1 / (1000 * 1000))).toBe("1 μ");
    expect(formatNumber(1 / (1000 * 1000 * 1000))).toBe("1 n");
    expect(formatNumber(1 / (1000 * 1000 * 1000 * 1000))).toBe("1 p");
    expect(formatNumber(1 / (1000 * 1000 * 1000 * 1000 * 1000))).toBe("1 f");
    expect(formatNumber(1 / (1000 * 1000 * 1000 * 1000 * 1000 * 1000))).toBe(
      "1 a",
    );
  });

  it("supports decimal places", () => {
    expect(formatNumber(1000, 2)).toBe("1 k");
    expect(formatNumber(1100, 2)).toBe("1.1 k");
    expect(formatNumber(1100, 3)).toBe("1.1 k");
    expect(formatNumber(900, 1)).toBe("900 ");
  });
});
