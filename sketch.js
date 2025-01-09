// Highlight types
const NONE = 0;
const MAJOR = 1;
const MINOR = 2;

// Highlight form names
const FREQUENCY = "frequency";
const RESISTANCE = "resistance";
const CAPACITANCE = "capacitance";
const INDUCTANCE = "inductance";


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

function getGridRelativeMouseX() {
  let adjustedX = mouseX - sideMargin;
  if (adjustedX < 0) {
    return 0
  } else if (adjustedX > gridWidth) {
    return gridWidth;
  }
  return adjustedX;
}

function getGridRelativeMouseY() {
  let adjustedY = mouseY - topMargin;
  if (adjustedY < 0) {
    return 0;
  } else if (adjustedY > gridHeight) {
    return gridHeight;
  }
  return adjustedY;
}

function getMouseR() {
  return maxR * Math.pow(10, getGridRelativeMouseY() / gridHeight * (Math.log10(minR) - Math.log10(maxR)));
}

function getMouseF() {
  return minF * Math.pow(10, getGridRelativeMouseX() / gridWidth * (Math.log10(maxF) - Math.log10(minF)));
}

// Not general-purpose, only handles the specific clipping which occurs in this application.
function clippedLine(x1, y1, x2, y2) {
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

  line(x1, y1, x2, y2);
}

function getHighlightMode(name) {
  formName = `${name}-highlight`;
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
  document.getElementById(`value-${name}`).textContent = value;
}

function mouseNearCanvas() {
  return mouseX > (decadeWidth / 2) && mouseX < (width - decadeWidth / 2) &&
    mouseY > (decadeWidth / 2) && mouseY < (height - decadeWidth / 2);
}

function setup() {
  angleMode(DEGREES);

  let canvas = createCanvas(width, height);
  canvas.parent('sketch-container');
  background(250);

  textSize(fontSize);
  textStyle(NORMAL);
  textFont("Arial");

  gridMajorColor = color(0, 0, 0);
  gridMinorColor = color(192, 192, 192);
  diagonalGridMajorColor = color(64, 64, 64);
  diagonalGridMinorColor = color(208, 208, 208);
  highlightColor = color(255, 0, 0);
}

function drawFrequencyLines() {
  const highlightMode = getHighlightMode(FREQUENCY);

  setValueDisplay("frequency", `${formatNumber(getMouseF(), 2)}Hz`);

  let offset = sideMargin;
  let prevOffset = sideMargin - decadeWidth;
  for (let f = minF; f <= maxF; f = f * 10) {
    const thisLineMajorHighlight = mouseNearCanvas() && mouseX > offset - (decadeWidth / 2) && mouseX < offset + (decadeWidth / 2);
    if (highlightMode >= MAJOR && thisLineMajorHighlight) {
      fill(highlightColor);
    } else {
      fill(gridMajorColor);
    }

    noStroke();
    textAlign(CENTER, BOTTOM);
    text(formatNumber(f) + "Hz", offset, topMargin - 10);

    let n = 1;
    let prevX = prevOffset + decadeOffsets.get(9);
    for (let minor = f; minor < f * 10; minor += f) {
      const x = decadeOffsets.get(n) + offset
      const nextX = decadeOffsets.get(n + 1) + offset;
      const thisLineMinorHighlight = mouseNearCanvas() &&
        mouseX > (prevX + (x - prevX) / 2) &&
        (mouseX <= (x + (nextX - x) / 2));

      if (n == 1) {
        if (highlightMode === MAJOR && thisLineMajorHighlight) {
          stroke(highlightColor);
        } else if (highlightMode == MINOR && thisLineMinorHighlight) {
          stroke(highlightColor);
        } else {
          stroke(gridMajorColor);
        }
      } else {
        if (highlightMode === MINOR && thisLineMinorHighlight) {
          stroke(highlightColor);
        } else {
          stroke(gridMinorColor);
        }
      }
      line(x, topMargin, x, height - bottomMargin);

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

function drawResistanceLines() {
  const highlightMode = getHighlightMode(RESISTANCE);

  setValueDisplay("impedance", `${formatNumber(getMouseR(), 2)}Ω`);

  let offset = height - bottomMargin;
  let prevOffset = sideMargin - decadeWidth;
  for (let r = minR; r <= maxR; r = r * 10) {
    const thisLineMajorHighlight = mouseNearCanvas() && mouseY > offset - (decadeWidth / 2) && mouseY < offset + (decadeWidth / 2);
    if (highlightMode >= MAJOR && thisLineMajorHighlight) {
      fill(highlightColor);
    } else {
      fill(gridMajorColor);
    }

    noStroke();
    textAlign(RIGHT, CENTER);
    text(formatNumber(r) + "Ω", sideMargin - 5, offset)

    let n = 1;
    let prevY = prevOffset - decadeOffsets.get(9);
    for (let minor = r; minor < r * 10; minor += r) {
      const y = offset - decadeOffsets.get(n);
      const nextY = offset - decadeOffsets.get(n + 1);
      const thisLineMinorHighlight = mouseNearCanvas() &&
        mouseY > (nextY + (y - nextY) / 2) &&
        (mouseY < (y + (prevY - y) / 2));

      if (n == 1) {
        if (highlightMode === MAJOR && thisLineMajorHighlight) {
          stroke(highlightColor);
        } else if (highlightMode == MINOR && thisLineMinorHighlight) {
          stroke(highlightColor);
        } else {
          stroke(gridMajorColor);
        }
      } else {
        if (highlightMode === MINOR && thisLineMinorHighlight) {
          stroke(highlightColor);
        } else {
          stroke(gridMinorColor);
        }
      }
      line(sideMargin, y, width - sideMargin, y);

      if (r == maxR) {
        break;
      }

      n++;
      prevY = y;
    }

    prevOffset = offset;
    offset -= decadeWidth;
  }
  line(sideMargin, offset, width - sideMargin, offset);
}

function drawCapacitanceLines() {
  // Z = 1 / (2 * pi * f * C)
  // C = 1 / (2 * pi * f * Z)
  // f = 1 / (2 * pi * C * Z)

  // Calculate min and max capacitance values for the entire chart.
  const minC = 1 / (2 * Math.PI * maxF * maxR);
  const maxC = 1 / (2 * Math.PI * minF * minR);
  const cornerC = 1 / (2 * Math.PI * maxF * minR);

  const adjustedX = getGridRelativeMouseX();
  const adjustedY = getGridRelativeMouseY();
  // const mouseC = 1 / (2 * Math.PI * 

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

      let lineColor;
      if (n === 1) {
        lineColor = diagonalGridMajorColor;
      } else {
        lineColor = diagonalGridMinorColor;
      }

      stroke(lineColor);
      clippedLine(x1, y1, x2, y2);

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

        push();
        translate(labelX, labelY);
        rotate(45);
        fill(diagonalGridMajorColor);
        noStroke();
        textAlign(LEFT, TOP);
        text(formatNumber(currentC) + "F", 0, 0);
        pop();
      }
    }
  }
}

function drawInductanceLines() {
  // Z = 2 * pi * f * L
  // L = Z / (2 * pi * f)
  // f = Z / (2 * pi * L)

  // Calculate min and max inductance values for the entire chart.
  const minL = minR / (2 * Math.PI * maxF);
  const maxL = maxR / (2 * Math.PI * minF);
  const cornerL = minR / (2 * Math.PI * minF);

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

      let lineColor;
      if (n === 1) {
        lineColor = diagonalGridMajorColor;
      } else {
        lineColor = diagonalGridMinorColor;
      }

      stroke(lineColor);
      clippedLine(x1, y1, x2, y2);

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

        push();
        translate(labelX, labelY);
        rotate(-45);
        fill(diagonalGridMajorColor); // Keep Label color consistent
        noStroke();
        textAlign(RIGHT, TOP);
        text(formatNumber(currentL) + "H", 0, 0);
        pop();
      }
    }
  }
}

function draw() {
  drawCapacitanceLines();
  drawInductanceLines();
  drawFrequencyLines();
  drawResistanceLines();
}
