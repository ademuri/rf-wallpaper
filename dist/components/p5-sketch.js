import * as React from 'react';
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { intLog10, formatNumber } from '../math/math';
export function Sketch(p5) {
    var setFrequency = null;
    // Highlight types
    var MAJOR = 1;
    var MINOR = 2;
    // Highlight form names
    var FREQUENCY = "frequency";
    var RESISTANCE = "resistance";
    var CAPACITANCE = "capacitance";
    var INDUCTANCE = "inductance";
    var VALUE_SIGNIFICANT_FIGURES = 3;
    var minR = 0.01;
    var maxR = 1000 * 1000;
    var minF = 1;
    var maxF = 10 * 1000 * 1000 * 1000;
    var numFDecades = intLog10(maxF) - intLog10(minF);
    var numRDecades = intLog10(maxR) - intLog10(minR);
    var fontSize = 20;
    var topMargin = fontSize * 2;
    var bottomMargin = topMargin * 2;
    var sideMargin = 100;
    var width = 1200;
    var gridWidth = width - sideMargin * 2;
    var decadeWidth = gridWidth / numFDecades;
    var gridHeight = numRDecades * decadeWidth;
    var height = gridHeight + topMargin + bottomMargin;
    var gridMajorColor;
    var gridMinorColor;
    var diagonalGridMajorColor;
    var diagonalGridMinorColor;
    var highlightColor;
    var decadeValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var decadeOffsets = new Map(decadeValues.map(function (x) { return [x, Math.log10(x) * decadeWidth]; }));
    function getDecadeOffset(decade) {
        var val = decadeOffsets.get(decade);
        if (val === undefined) {
            throw new Error("Invalid decade: ".concat(decade));
        }
        return val;
    }
    function offsetForR(r) {
        return (Math.log10(maxR) - Math.log10(r)) * decadeWidth + topMargin;
    }
    function offsetForF(hz) {
        return (Math.log10(hz) - Math.log10(minF)) * decadeWidth + sideMargin;
    }
    function getGridRelativeMouseX(p5) {
        var adjustedX = p5.mouseX - sideMargin;
        if (adjustedX < 0) {
            return 0;
        }
        else if (adjustedX > gridWidth) {
            return gridWidth;
        }
        return adjustedX;
    }
    function getGridRelativeMouseY(p5) {
        var adjustedY = p5.mouseY - topMargin;
        if (adjustedY < 0) {
            return 0;
        }
        else if (adjustedY > gridHeight) {
            return gridHeight;
        }
        return adjustedY;
    }
    function getMouseR(p5) {
        return maxR * Math.pow(10, getGridRelativeMouseY(p5) / gridHeight * (Math.log10(minR) - Math.log10(maxR)));
    }
    function getMouseF(p5) {
        return minF * Math.pow(10, getGridRelativeMouseX(p5) / gridWidth * (Math.log10(maxF) - Math.log10(minF)));
    }
    // Not general-purpose, only handles the specific clipping which occurs in this application.
    function clippedLine(p5, x1, y1, x2, y2) {
        if (x2 < sideMargin) {
            if (y2 < topMargin) {
                throw new Error("point too out-of-bounds: (".concat(x2, ", ").concat(y2, ")"));
            }
            var fraction = (sideMargin - x1) / (x2 - x1);
            x2 = sideMargin;
            y2 = y1 + (y2 - y1) * fraction;
        }
        else if (y2 < topMargin) {
            if (x2 < topMargin) {
                throw new Error("point too out-of-bounds: (".concat(x2, ", ").concat(y2, ")"));
            }
            var fraction = (topMargin - y1) / (y2 - y1);
            x2 = x1 + fraction * (x2 - x1);
            y2 = topMargin;
        }
        if (x1 < sideMargin) {
            var fraction = (sideMargin - x1) / (x2 - x1);
            x1 = sideMargin;
            y1 = y1 + (y2 - y1) * fraction;
        }
        else if (y1 > (height - bottomMargin)) {
            var fraction = ((height - bottomMargin) - y1) / (y2 - y1);
            x1 = x1 + fraction * (x2 - x1);
            y1 = height - bottomMargin;
        }
        p5.line(x1, y1, x2, y2);
    }
    function getHighlightMode(p5, name) {
        return 1;
        var formName = "".concat(name, "-highlight");
        var form = document.querySelector("#".concat(formName));
        var data = new FormData(form);
        switch (data.get(formName)) {
            case "minor":
                return 2;
            case "major":
                return 1;
            case "none":
            default:
                return 0;
        }
    }
    function setValueDisplay(name, value) {
        // document.getElementById(`value-${name}`).textContent = value;
    }
    function mouseNearCanvas(p5) {
        return p5.mouseX > (decadeWidth / 2) && p5.mouseX < (width - decadeWidth / 2) &&
            p5.mouseY > (decadeWidth / 2) && p5.mouseY < (height - decadeWidth / 2);
    }
    function drawFrequencyLines(p5) {
        var highlightMode = getHighlightMode(p5, FREQUENCY);
        setValueDisplay("frequency", "".concat(formatNumber(getMouseF(p5), VALUE_SIGNIFICANT_FIGURES), "Hz"));
        if (setFrequency !== null) {
            setFrequency(getMouseF(p5));
        }
        var offset = sideMargin;
        var prevOffset = sideMargin - decadeWidth;
        for (var f = minF; f <= maxF; f = f * 10) {
            var thisLineMajorHighlight = mouseNearCanvas(p5) && p5.mouseX > offset - (decadeWidth / 2) && p5.mouseX < offset + (decadeWidth / 2);
            if (highlightMode >= MAJOR && thisLineMajorHighlight) {
                p5.fill(highlightColor);
            }
            else {
                p5.fill(gridMajorColor);
            }
            p5.noStroke();
            p5.textAlign(p5.CENTER, p5.BOTTOM);
            p5.text(formatNumber(f) + "Hz", offset, topMargin - 10);
            var n = 1;
            var prevX = prevOffset + getDecadeOffset(9);
            for (var minor = f; minor < f * 10; minor += f) {
                var x = getDecadeOffset(n) + offset;
                var nextX = getDecadeOffset(n + 1) + offset;
                var thisLineMinorHighlight = mouseNearCanvas(p5) &&
                    p5.mouseX > (prevX + (x - prevX) / 2) &&
                    (p5.mouseX <= (x + (nextX - x) / 2));
                if (n === 1) {
                    if (highlightMode === MAJOR && thisLineMajorHighlight) {
                        p5.stroke(highlightColor);
                    }
                    else if (highlightMode === MINOR && thisLineMinorHighlight) {
                        p5.stroke(highlightColor);
                    }
                    else {
                        p5.stroke(gridMajorColor);
                    }
                }
                else {
                    if (highlightMode === MINOR && thisLineMinorHighlight) {
                        p5.stroke(highlightColor);
                    }
                    else {
                        p5.stroke(gridMinorColor);
                    }
                }
                p5.line(x, topMargin, x, height - bottomMargin);
                if (f === maxF) {
                    break;
                }
                n++;
                prevX = x;
            }
            prevOffset = offset;
            offset += decadeWidth;
        }
    }
    function drawResistanceLines(p5) {
        var highlightMode = getHighlightMode(p5, RESISTANCE);
        setValueDisplay("impedance", "".concat(formatNumber(getMouseR(p5), VALUE_SIGNIFICANT_FIGURES), "\u2126"));
        var offset = height - bottomMargin;
        var prevOffset = sideMargin - decadeWidth;
        for (var r = minR; r <= maxR; r = r * 10) {
            var thisLineMajorHighlight = mouseNearCanvas(p5) && p5.mouseY > offset - (decadeWidth / 2) && p5.mouseY < offset + (decadeWidth / 2);
            if (highlightMode >= MAJOR && thisLineMajorHighlight) {
                p5.fill(highlightColor);
            }
            else {
                p5.fill(gridMajorColor);
            }
            p5.noStroke();
            p5.textAlign(p5.RIGHT, p5.CENTER);
            p5.text(formatNumber(r) + "Ω", sideMargin - 5, offset);
            var n = 1;
            var prevY = prevOffset - getDecadeOffset(9);
            for (var minor = r; minor < r * 10; minor += r) {
                var y = offset - getDecadeOffset(n);
                var nextY = offset - getDecadeOffset(n + 1);
                var thisLineMinorHighlight = mouseNearCanvas(p5) &&
                    p5.mouseY > (nextY + (y - nextY) / 2) &&
                    (p5.mouseY < (y + (prevY - y) / 2));
                if (n === 1) {
                    if (highlightMode === MAJOR && thisLineMajorHighlight) {
                        p5.stroke(highlightColor);
                    }
                    else if (highlightMode === MINOR && thisLineMinorHighlight) {
                        p5.stroke(highlightColor);
                    }
                    else {
                        p5.stroke(gridMajorColor);
                    }
                }
                else {
                    if (highlightMode === MINOR && thisLineMinorHighlight) {
                        p5.stroke(highlightColor);
                    }
                    else {
                        p5.stroke(gridMinorColor);
                    }
                }
                p5.line(sideMargin, y, width - sideMargin, y);
                if (r === maxR) {
                    break;
                }
                n++;
                prevY = y;
            }
            prevOffset = offset;
            offset -= decadeWidth;
        }
        p5.line(sideMargin, offset, width - sideMargin, offset);
    }
    function drawCapacitanceLines(p5) {
        var highlightMode = getHighlightMode(p5, CAPACITANCE);
        // Z = 1 / (2 * pi * f * C)
        // C = 1 / (2 * pi * f * Z)
        // f = 1 / (2 * pi * C * Z)
        // Calculate min and max capacitance values for the entire chart.
        var minC = 1 / (2 * Math.PI * maxF * maxR);
        var maxC = 1 / (2 * Math.PI * minF * minR);
        var cornerC = 1 / (2 * Math.PI * maxF * minR);
        var mouseR = getMouseR(p5);
        var mouseF = getMouseF(p5);
        var mouseC = 1 / (2 * Math.PI * mouseF * mouseR);
        setValueDisplay("capacitance", "".concat(formatNumber(mouseC, VALUE_SIGNIFICANT_FIGURES), "F"));
        for (var majorCLog = intLog10(minC) + 1; majorCLog < intLog10(maxC); majorCLog++) {
            var majorC = Math.pow(10, majorCLog);
            for (var n = 1; n <= 9; n++) {
                var currentC = majorC * n;
                // Calculate line coordinates based on whether the line originates on the right or bottom.
                var x1 = void 0, y1 = void 0, x2 = void 0, y2 = void 0;
                if (currentC < cornerC) { // Originates on right side
                    var lineMinZ = 1 / (2 * Math.PI * maxF * currentC);
                    var lineMinF = 1 / (2 * Math.PI * currentC * maxR);
                    x1 = width - sideMargin;
                    y1 = offsetForR(lineMinZ);
                    x2 = offsetForF(lineMinF);
                    y2 = topMargin;
                }
                else { // Originates on bottom
                    var lineMaxR = 1 / (2 * Math.PI * minF * currentC);
                    var lineMaxF = 1 / (2 * Math.PI * currentC * minR);
                    x1 = offsetForF(lineMaxF);
                    y1 = height - bottomMargin;
                    x2 = sideMargin;
                    y2 = offsetForR(lineMaxR);
                }
                var lineColor = n === 1 ? diagonalGridMajorColor : diagonalGridMinorColor;
                var highlightMajor = false;
                if (highlightMode >= MAJOR) {
                    var currentCLog = Math.log10(currentC);
                    var prevCLog = Math.log10(majorC / 10);
                    var nextCLog = Math.log10(majorC * 10);
                    var mouseCLog = Math.log10(mouseC);
                    if (mouseCLog > (currentCLog + prevCLog) / 2 && mouseCLog < (nextCLog + currentCLog) / 2) {
                        highlightMajor = true;
                    }
                }
                if (highlightMode === MAJOR && n === 1 && highlightMajor) {
                    lineColor = highlightColor;
                }
                else if (highlightMode === MINOR) {
                    var currentCLog = Math.log10(currentC);
                    var mouseCLog = Math.log10(mouseC);
                    var nextCLog = Math.log10(majorC * (n + 1));
                    var prevCLog = n === 1 ? Math.log10(majorC * 9 / 10) : Math.log10(majorC * (n - 1));
                    if (mouseCLog > (currentCLog + prevCLog) / 2 && mouseCLog < (nextCLog + currentCLog) / 2) {
                        lineColor = highlightColor;
                    }
                }
                p5.stroke(lineColor);
                clippedLine(p5, x1, y1, x2, y2);
                // Draw labels only for major lines (n=1).
                if (n === 1) {
                    var labelX = void 0, labelY = void 0;
                    if (currentC < cornerC) { // Originates Right
                        labelX = width - sideMargin + fontSize - 5;
                        labelY = offsetForR(1 / (2 * Math.PI * maxF * currentC));
                    }
                    else { // Originates Bottom
                        labelX = offsetForF(1 / (2 * Math.PI * currentC * minR)) + fontSize / 2 + 5;
                        labelY = height - bottomMargin + 5;
                    }
                    p5.push();
                    p5.translate(labelX, labelY);
                    p5.rotate(45);
                    if (highlightMajor) {
                        p5.fill(highlightColor);
                    }
                    else {
                        p5.fill(diagonalGridMajorColor);
                    }
                    p5.noStroke();
                    p5.textAlign(p5.LEFT, p5.TOP);
                    p5.text(formatNumber(currentC) + "F", 0, 0);
                    p5.pop();
                }
            }
        }
    }
    function drawInductanceLines(p5) {
        var highlightMode = getHighlightMode(p5, INDUCTANCE);
        // Z = 2 * pi * f * L
        // L = Z / (2 * pi * f)
        // f = Z / (2 * pi * L)
        // Calculate min and max inductance values for the entire chart.
        var minL = minR / (2 * Math.PI * maxF);
        var maxL = maxR / (2 * Math.PI * minF);
        var cornerL = minR / (2 * Math.PI * minF);
        var mouseR = getMouseR(p5);
        var mouseF = getMouseF(p5);
        var mouseL = mouseR / (2 * Math.PI * mouseF);
        setValueDisplay("inductance", "".concat(formatNumber(mouseL, VALUE_SIGNIFICANT_FIGURES), "H"));
        for (var majorLLog = intLog10(minL) + 1; majorLLog < intLog10(maxL); majorLLog++) {
            var majorL = Math.pow(10, majorLLog);
            for (var n = 1; n <= 9; n++) {
                var currentL = majorL * n;
                // Calculate line coordinates based on whether the line originates on the left or bottom.
                var x1 = void 0, y1 = void 0, x2 = void 0, y2 = void 0;
                if (currentL > cornerL) { // Originates on left side
                    var lineMinZ = 2 * Math.PI * minF * currentL;
                    var lineMaxF = maxR / (2 * Math.PI * currentL);
                    x1 = sideMargin;
                    y1 = offsetForR(lineMinZ);
                    x2 = offsetForF(lineMaxF);
                    y2 = topMargin;
                }
                else { // Originates on bottom
                    var lineMinF = minR / (2 * Math.PI * currentL);
                    var lineMaxR = 2 * Math.PI * maxF * currentL;
                    x1 = offsetForF(lineMinF);
                    y1 = height - bottomMargin;
                    x2 = width - sideMargin;
                    y2 = offsetForR(lineMaxR);
                }
                var lineColor = n === 1 ? diagonalGridMajorColor : diagonalGridMinorColor;
                var highlightMajor = false;
                if (highlightMode >= MAJOR) {
                    var currentLLog = Math.log10(currentL);
                    var prevLLog = Math.log10(majorL / 10);
                    var nextLLog = Math.log10(majorL * 10);
                    var mouseLLog = Math.log10(mouseL);
                    if (mouseLLog > (currentLLog + prevLLog) / 2 && mouseLLog < (nextLLog + currentLLog) / 2) {
                        highlightMajor = true;
                    }
                }
                if (highlightMode === MAJOR && n === 1 && highlightMajor) {
                    lineColor = highlightColor;
                }
                else if (highlightMode === MINOR) {
                    var currentLLog = Math.log10(currentL);
                    var mouseLLog = Math.log10(mouseL);
                    var nextLLog = Math.log10(majorL * (n + 1));
                    var prevLLog = n === 1 ? Math.log10(majorL * 9 / 10) : Math.log10(majorL * (n - 1));
                    if (mouseLLog > (currentLLog + prevLLog) / 2 && mouseLLog < (nextLLog + currentLLog) / 2) {
                        lineColor = highlightColor;
                    }
                }
                p5.stroke(lineColor);
                clippedLine(p5, x1, y1, x2, y2);
                // Draw labels only for major lines (n=1).
                if (n === 1) {
                    var labelX = void 0, labelY = void 0;
                    if (currentL > cornerL) { // Originates left
                        labelX = sideMargin - fontSize + 5;
                        labelY = offsetForR(2 * Math.PI * minF * currentL);
                    }
                    else { // Originates bottom
                        labelX = offsetForF(minR / (2 * Math.PI * currentL)) - fontSize / 2;
                        labelY = height - bottomMargin + 5;
                    }
                    p5.push();
                    p5.translate(labelX, labelY);
                    p5.rotate(-45);
                    if (highlightMajor) {
                        p5.fill(highlightColor);
                    }
                    else {
                        p5.fill(diagonalGridMajorColor);
                    }
                    p5.noStroke();
                    p5.textAlign(p5.RIGHT, p5.TOP);
                    p5.text(formatNumber(currentL) + "H", 0, 0);
                    p5.pop();
                }
            }
        }
    }
    p5.setup = function () {
        p5.angleMode(p5.DEGREES);
        p5.createCanvas(width, height);
        p5.background(250);
        p5.textSize(fontSize);
        p5.textStyle(p5.NORMAL);
        p5.textFont("Arial");
        gridMajorColor = p5.color(0, 0, 0);
        gridMinorColor = p5.color(192, 192, 192);
        diagonalGridMajorColor = p5.color(64, 64, 64);
        diagonalGridMinorColor = p5.color(208, 208, 208);
        highlightColor = p5.color(255, 0, 0);
    };
    p5.draw = function () {
        drawCapacitanceLines(p5);
        drawInductanceLines(p5);
        drawFrequencyLines(p5);
        drawResistanceLines(p5);
    };
    p5.updateWithProps = function (props) {
        if (props.setFrequency) {
            setFrequency = props.setFrequency;
        }
    };
}
export function P5Sketch() {
    return React.createElement(ReactP5Wrapper, { sketch: Sketch });
}
//# sourceMappingURL=p5-sketch.js.map