export function intLog10(number) {
    return Math.round(Math.log10(number));
}
export function formatNumber(number, sigFigs) {
    if (sigFigs === void 0) { sigFigs = 0; }
    var rawMagnitude = Math.log10(number) / 3;
    var magnitude = Math.trunc(rawMagnitude);
    if (rawMagnitude < 0) {
        magnitude--;
    }
    var prefixes = new Map([
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
    var prefix = prefixes.get(magnitude);
    var remainder = (number / Math.pow(1000, magnitude));
    var decimals = 0;
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
        throw new Error("No prefix found for number '".concat(number, "'"));
    }
    return "".concat(remainder, " ").concat(prefix);
}
//# sourceMappingURL=math.js.map