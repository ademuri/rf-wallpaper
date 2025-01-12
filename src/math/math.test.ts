import { intLog10, formatNumber, parseNumber } from "./math";
import { Unit, ValueHighlight } from "../types";

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

describe("parseNumber", () => {
  it("parses units with no prefix", () => {
    expect(parseNumber("1 Hz")?.unit).toEqual(Unit.Frequency);
    expect(parseNumber("1 Ω")?.unit).toEqual(Unit.Resistance);
    expect(parseNumber("1 R")?.unit).toEqual(Unit.Resistance);
    expect(parseNumber("1 F")?.unit).toEqual(Unit.Capacitance);
    expect(parseNumber("1 H")?.unit).toEqual(Unit.Inductance);
  });

  it("ignores unit case", () => {
    expect(parseNumber("1 hz")?.unit).toEqual(Unit.Frequency);
    expect(parseNumber("1 r")?.unit).toEqual(Unit.Resistance);
    expect(parseNumber("1 f")?.unit).toEqual(Unit.Capacitance);
    expect(parseNumber("1 h")?.unit).toEqual(Unit.Inductance);
  });

  it("parses units with a prefix", () => {
    expect(parseNumber("100 μHz")?.unit).toEqual(Unit.Frequency);
    expect(parseNumber("100 MHz")?.unit).toEqual(Unit.Frequency);
  });

  it("parses the value", () => {
    expect(parseNumber("1 Hz")?.value).toEqual(1);
    expect(parseNumber("1 mHz")?.value).toEqual(0.001);
    expect(parseNumber("1 kHz")?.value).toEqual(1000);
  });

  it("parses large values", () => {
    expect(parseNumber("200 MHz")?.value).toEqual(200 * 1000 * 1000);
    expect(parseNumber("200 GHz")?.value).toEqual(200 * 1000 * 1000 * 1000);
  });

  it("parses small values", () => {
    expect(parseNumber("1 uHz")?.value).toEqual(1 / (1000 * 1000));
    expect(parseNumber("1 μHz")?.value).toEqual(1 / (1000 * 1000));
    expect(parseNumber("1 nHz")?.value).toEqual(1 / (1000 * 1000 * 1000));
    expect(parseNumber("1 pHz")?.value).toEqual(
      1 / (1000 * 1000 * 1000 * 1000),
    );
    expect(parseNumber("1 fHz")?.value).toEqual(
      1 / (1000 * 1000 * 1000 * 1000 * 1000),
    );
  });

  it("allows no space between value and unit for Hz", () => {
    expect(parseNumber("10Hz")).toEqual({
      unit: Unit.Frequency,
      value: 10,
      display: "10Hz",
    });
    expect(parseNumber("10MHz")).toEqual({
      unit: Unit.Frequency,
      value: 10 * 1000 * 1000,
      display: "10MHz",
    });
  });

  it("allows no space between value and unit for R", () => {
    expect(parseNumber("10MR")).toEqual({
      unit: Unit.Resistance,
      value: 10 * 1000 * 1000,
      display: "10MR",
    });
  });

  it("allows no space between value and unit for R with no prefix", () => {
    expect(parseNumber("100Hz")).toEqual({
      unit: Unit.Frequency,
      value: 100,
      display: "100Hz",
    });
  });

  it("allows space between prefix and unit", () => {
    expect(parseNumber("100k Hz")).toEqual({
      unit: Unit.Frequency,
      value: 100 * 1000,
      display: "100k Hz",
    });
  });
});
