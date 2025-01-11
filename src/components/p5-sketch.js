import React from 'react';
import { ReactP5Wrapper } from "@p5-wrapper/react";

export function Sketch(p5) {
  function intLog10(number) {
    return Math.round(Math.log10(number));
  }

  function formatNumber(number, sigFigs = 0) {
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
    remainder = remainder.toFixed(decimals);

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


  // Highlight types
  const NONE = 0;
  const MAJOR = 1;
  const MINOR = 2;

  // Highlight form names
  const FREQUENCY = "frequency";
  const RESISTANCE = "resistance";
  const CAPACITANCE = "capacitance";
  const INDUCTANCE = "inductance";

  const VALUE_SIGNIFICANT_FIGURES = 3;

  const minR = 0.01;
  const maxR = 1000 * 1000;
  const minF = 1;
  const maxF = 10 * 1000 * 1000 * 1000;

  const numFDecades = intLog10(maxF) - intLog10(minF);
  const numRDecades = intLog10(maxR) - intLog10(minR);

  const fontSize = 20;
  const topMargin = fontSize * 2;
  const bottomMargin = topMargin * 2;
  const sideMargin = 100;

  const width = 1200;
  const gridWidth = width - sideMargin * 2;
  const decadeWidth = gridWidth / numFDecades
  const gridHeight = numRDecades * decadeWidth;
  const height = gridHeight + topMargin + bottomMargin;

  const doHighlight = true;

  let gridMajorColor;
  let gridMinorColor;
  let diagonalGridMajorColor;
  let diagonalGridMinorColor;

  let highlightColor;

  const decadeValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const decadeOffsets = new Map(decadeValues.map((x) => [x, Math.log10(x) * decadeWidth]));

  function offsetForR(r) {
    return (Math.log10(maxR) - Math.log10(r)) * decadeWidth + topMargin;
  }

  function offsetForF(hz) {
    return (Math.log10(hz) - Math.log10(minF)) * decadeWidth + sideMargin;
  }

  function getGridRelativeMouseX(p5) {
    let adjustedX = p5.mouseX - sideMargin;
    if (adjustedX < 0) {
      return 0
    } else if (adjustedX > gridWidth) {
      return gridWidth;
    }
    return adjustedX;
  }

  function getGridRelativeMouseY(p5) {
    let adjustedY = p5.mouseY - topMargin;
    if (adjustedY < 0) {
      return 0;
    } else if (adjustedY > gridHeight) {
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
        throw new Error(`point too out-of-bounds: (${x2}, ${y2})`);
      }
      const fraction = (sideMargin - x1) / (x2 - x1);
      x2 = sideMargin;
      y2 = y1 + (y2 - y1) * fraction;
    } else if (y2 < topMargin) {
      if (x2 < topMargin) {
        throw new Error(`point too out-of-bounds: (${x2}, ${y2})`);
      }
      const fraction = (topMargin - y1) / (y2 - y1);
      x2 = x1 + fraction * (x2 - x1);
      y2 = topMargin;
    }

    if (x1 < sideMargin) {
      const fraction = (sideMargin - x1) / (x2 - x1);
      x1 = sideMargin;
      y1 = y1 + (y2 - y1) * fraction;
    } else if (y1 > (height - bottomMargin)) {
      const fraction = ((height - bottomMargin) - y1) / (y2 - y1);
      x1 = x1 + fraction * (x2 - x1);
      y1 = height - bottomMargin;
    }

    p5.line(x1, y1, x2, y2);
  }

  function getHighlightMode(p5, name) {
    return 1;
    const formName = `${name}-highlight`;
    const form = document.querySelector(`#${formName}`);
    const data = new FormData(form);
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
    const highlightMode = getHighlightMode(FREQUENCY);

    setValueDisplay("frequency", `${formatNumber(getMouseF(p5), VALUE_SIGNIFICANT_FIGURES)}Hz`);

    let offset = sideMargin;
    let prevOffset = sideMargin - decadeWidth;
    for (let f = minF; f <= maxF; f = f * 10) {
      const thisLineMajorHighlight = mouseNearCanvas(p5) && p5.mouseX > offset - (decadeWidth / 2) && p5.mouseX < offset + (decadeWidth / 2);
      if (highlightMode >= MAJOR && thisLineMajorHighlight) {
        p5.fill(highlightColor);
      } else {
        p5.fill(gridMajorColor);
      }

      p5.noStroke();
      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.text(formatNumber(f) + "Hz", offset, topMargin - 10);

      let n = 1;
      let prevX = prevOffset + decadeOffsets.get(9);
      for (let minor = f; minor < f * 10; minor += f) {
        const x = decadeOffsets.get(n) + offset
        const nextX = decadeOffsets.get(n + 1) + offset;
        const thisLineMinorHighlight = mouseNearCanvas(p5) &&
          p5.mouseX > (prevX + (x - prevX) / 2) &&
          (p5.mouseX <= (x + (nextX - x) / 2));

        if (n == 1) {
          if (highlightMode === MAJOR && thisLineMajorHighlight) {
            p5.stroke(highlightColor);
          } else if (highlightMode == MINOR && thisLineMinorHighlight) {
            p5.stroke(highlightColor);
          } else {
            p5.stroke(gridMajorColor);
          }
        } else {
          if (highlightMode === MINOR && thisLineMinorHighlight) {
            p5.stroke(highlightColor);
          } else {
            p5.stroke(gridMinorColor);
          }
        }
        p5.line(x, topMargin, x, height - bottomMargin);

        if (f == maxF) {
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
    const highlightMode = getHighlightMode(RESISTANCE);

    setValueDisplay("impedance", `${formatNumber(getMouseR(p5), VALUE_SIGNIFICANT_FIGURES)}Ω`);

    let offset = height - bottomMargin;
    let prevOffset = sideMargin - decadeWidth;
    for (let r = minR; r <= maxR; r = r * 10) {
      const thisLineMajorHighlight = mouseNearCanvas(p5) && p5.mouseY > offset - (decadeWidth / 2) && p5.mouseY < offset + (decadeWidth / 2);
      if (highlightMode >= MAJOR && thisLineMajorHighlight) {
        p5.fill(highlightColor);
      } else {
        p5.fill(gridMajorColor);
      }

      p5.noStroke();
      p5.textAlign(p5.RIGHT, p5.CENTER);
      p5.text(formatNumber(r) + "Ω", sideMargin - 5, offset)

      let n = 1;
      let prevY = prevOffset - decadeOffsets.get(9);
      for (let minor = r; minor < r * 10; minor += r) {
        const y = offset - decadeOffsets.get(n);
        const nextY = offset - decadeOffsets.get(n + 1);
        const thisLineMinorHighlight = mouseNearCanvas(p5) &&
          p5.mouseY > (nextY + (y - nextY) / 2) &&
          (p5.mouseY < (y + (prevY - y) / 2));

        if (n == 1) {
          if (highlightMode === MAJOR && thisLineMajorHighlight) {
            p5.stroke(highlightColor);
          } else if (highlightMode == MINOR && thisLineMinorHighlight) {
            p5.stroke(highlightColor);
          } else {
            p5.stroke(gridMajorColor);
          }
        } else {
          if (highlightMode === MINOR && thisLineMinorHighlight) {
            p5.stroke(highlightColor);
          } else {
            p5.stroke(gridMinorColor);
          }
        }
        p5.line(sideMargin, y, width - sideMargin, y);

        if (r == maxR) {
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
    const highlightMode = getHighlightMode(CAPACITANCE);

    // Z = 1 / (2 * pi * f * C)
    // C = 1 / (2 * pi * f * Z)
    // f = 1 / (2 * pi * C * Z)

    // Calculate min and max capacitance values for the entire chart.
    const minC = 1 / (2 * Math.PI * maxF * maxR);
    const maxC = 1 / (2 * Math.PI * minF * minR);
    const cornerC = 1 / (2 * Math.PI * maxF * minR);

    const mouseR = getMouseR(p5);
    const mouseF = getMouseF(p5);
    const mouseC = 1 / (2 * Math.PI * mouseF * mouseR);
    setValueDisplay("capacitance", `${formatNumber(mouseC, VALUE_SIGNIFICANT_FIGURES)}F`);

    for (let majorCLog = intLog10(minC) + 1; majorCLog < intLog10(maxC); majorCLog++) {
      const majorC = Math.pow(10, majorCLog);

      for (let n = 1; n <= 9; n++) {
        const currentC = majorC * n;

        // Calculate line coordinates based on whether the line originates on the right or bottom.
        let x1, y1, x2, y2;
        if (currentC < cornerC) {  // Originates on right side
          const lineMinZ = 1 / (2 * Math.PI * maxF * currentC);
          const lineMinF = 1 / (2 * Math.PI * currentC * maxR);
          x1 = width - sideMargin;
          y1 = offsetForR(lineMinZ);
          x2 = offsetForF(lineMinF);
          y2 = topMargin;
        } else {  // Originates on bottom
          const lineMaxR = 1 / (2 * Math.PI * minF * currentC);
          const lineMaxF = 1 / (2 * Math.PI * currentC * minR);
          x1 = offsetForF(lineMaxF);
          y1 = height - bottomMargin;
          x2 = sideMargin;
          y2 = offsetForR(lineMaxR);
        }

        let lineColor = n === 1 ? diagonalGridMajorColor : diagonalGridMinorColor;
        let highlightMajor = false;
        if (highlightMode >= MAJOR) {
          const currentCLog = Math.log10(currentC);
          const prevCLog = Math.log10(majorC / 10);
          const nextCLog = Math.log10(majorC * 10);
          const mouseCLog = Math.log10(mouseC);
          if (mouseCLog > (currentCLog + prevCLog) / 2 && mouseCLog < (nextCLog + currentCLog) / 2) {
            highlightMajor = true;
          }
        }

        if (highlightMode === MAJOR && n === 1 && highlightMajor) {
          lineColor = highlightColor;
        } else if (highlightMode === MINOR) {
          const currentCLog = Math.log10(currentC);
          const mouseCLog = Math.log10(mouseC);
          const nextCLog = Math.log10(majorC * (n + 1));
          const prevCLog = n === 1 ? Math.log10(majorC * 9 / 10) : Math.log10(majorC * (n - 1));
          if (mouseCLog > (currentCLog + prevCLog) / 2 && mouseCLog < (nextCLog + currentCLog) / 2) {
            lineColor = highlightColor;
          }
        }

        p5.stroke(lineColor);
        clippedLine(p5, x1, y1, x2, y2);

        // Draw labels only for major lines (n=1).
        if (n === 1) {
          let labelX, labelY;

          if (currentC < cornerC) { // Originates Right
            labelX = width - sideMargin + fontSize - 5;
            labelY = offsetForR(1 / (2 * Math.PI * maxF * currentC));
          } else { // Originates Bottom
            labelX = offsetForF(1 / (2 * Math.PI * currentC * minR)) + fontSize / 2 + 5;
            labelY = height - bottomMargin + 5;
          }

          p5.push();
          p5.translate(labelX, labelY);
          p5.rotate(45);
          if (highlightMajor) {
            p5.fill(highlightColor);
          } else {
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
    const highlightMode = getHighlightMode(INDUCTANCE);

    // Z = 2 * pi * f * L
    // L = Z / (2 * pi * f)
    // f = Z / (2 * pi * L)

    // Calculate min and max inductance values for the entire chart.
    const minL = minR / (2 * Math.PI * maxF);
    const maxL = maxR / (2 * Math.PI * minF);
    const cornerL = minR / (2 * Math.PI * minF);

    const mouseR = getMouseR(p5);
    const mouseF = getMouseF(p5);
    const mouseL = mouseR / (2 * Math.PI * mouseF);
    setValueDisplay("inductance", `${formatNumber(mouseL, VALUE_SIGNIFICANT_FIGURES)}H`);

    for (let majorLLog = intLog10(minL) + 1; majorLLog < intLog10(maxL); majorLLog++) {
      const majorL = Math.pow(10, majorLLog);

      for (let n = 1; n <= 9; n++) {
        const currentL = majorL * n;

        // Calculate line coordinates based on whether the line originates on the left or bottom.
        let x1, y1, x2, y2;
        if (currentL > cornerL) {  // Originates on left side
          const lineMinZ = 2 * Math.PI * minF * currentL;
          const lineMaxF = maxR / (2 * Math.PI * currentL);
          x1 = sideMargin;
          y1 = offsetForR(lineMinZ);
          x2 = offsetForF(lineMaxF);
          y2 = topMargin;
        } else {  // Originates on bottom
          const lineMinF = minR / (2 * Math.PI * currentL);
          const lineMaxR = 2 * Math.PI * maxF * currentL;
          x1 = offsetForF(lineMinF);
          y1 = height - bottomMargin;
          x2 = width - sideMargin;
          y2 = offsetForR(lineMaxR);
        }

        let lineColor = n === 1 ? diagonalGridMajorColor : diagonalGridMinorColor;
        let highlightMajor = false;
        if (highlightMode >= MAJOR) {
          const currentLLog = Math.log10(currentL);
          const prevLLog = Math.log10(majorL / 10);
          const nextLLog = Math.log10(majorL * 10);
          const mouseLLog = Math.log10(mouseL);
          if (mouseLLog > (currentLLog + prevLLog) / 2 && mouseLLog < (nextLLog + currentLLog) / 2) {
            highlightMajor = true;
          }
        }

        if (highlightMode === MAJOR && n === 1 && highlightMajor) {
          lineColor = highlightColor;
        } else if (highlightMode === MINOR) {
          const currentLLog = Math.log10(currentL);
          const mouseLLog = Math.log10(mouseL);
          const nextLLog = Math.log10(majorL * (n + 1));
          const prevLLog = n === 1 ? Math.log10(majorL * 9 / 10) : Math.log10(majorL * (n - 1));
          if (mouseLLog > (currentLLog + prevLLog) / 2 && mouseLLog < (nextLLog + currentLLog) / 2) {
            lineColor = highlightColor;
          }
        }

        p5.stroke(lineColor);
        clippedLine(p5, x1, y1, x2, y2);

        // Draw labels only for major lines (n=1).
        if (n === 1) {
          let labelX, labelY;
          if (currentL > cornerL) { // Originates left
            labelX = sideMargin - fontSize + 5;
            labelY = offsetForR(2 * Math.PI * minF * currentL);
          } else { // Originates bottom
            labelX = offsetForF(minR / (2 * Math.PI * currentL)) - fontSize / 2;
            labelY = height - bottomMargin + 5;
          }

          p5.push();
          p5.translate(labelX, labelY);
          p5.rotate(-45);
          if (highlightMajor) {
            p5.fill(highlightColor);
          } else {
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

  p5.setup = () => {
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
  }

  p5.draw = () => {
    drawCapacitanceLines(p5);
    drawInductanceLines(p5);
    drawFrequencyLines(p5);
    drawResistanceLines(p5);
  }
}

function P5Sketch() {
  return <ReactP5Wrapper sketch={Sketch} />;
}

export default P5Sketch;
