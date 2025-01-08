// Highlight types
const NONE = "none";
const MAJOR = "major";
const MINOR = "minor";

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

const decadeValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const decadeOffsets = new Map(decadeValues.map((x) => [x, Math.log10(x) * decadeWidth]));

function offsetForR(r) {
  return (Math.log10(maxR) - Math.log10(r)) * decadeWidth + topMargin;
}

function offsetForF(hz) {
  return (Math.log10(hz) - Math.log10(minF)) * decadeWidth + sideMargin;
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
  return data.get(formName);
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

  let offset = sideMargin;
  for (let f = minF; f <= maxF; f = f * 10) {
    if (highlightMode === MAJOR && mouseNearCanvas() && mouseX > offset - (decadeWidth / 2) && mouseX < offset + (decadeWidth / 2)) {
      stroke(highlightColor);
      fill(highlightColor);
    } else {
      stroke(gridMajorColor);
      fill(gridMajorColor);
    }
    line(offset, topMargin, offset, height - bottomMargin);

    noStroke();
    textAlign(CENTER, BOTTOM);
    text(formatNumber(f) + "Hz", offset, topMargin - 10);

    if (f == maxF) {
      break;
    }

    stroke(gridMinorColor);
    let n = 2;
    for (let minor = f * 2; minor < f * 10; minor += f) {
      const x = decadeOffsets.get(n) + offset
      line(x, topMargin, x, height - bottomMargin);

      n++;
    }

    offset += decadeWidth;
  }
}

function drawResistanceLines() {
  const highlightMode = getHighlightMode(RESISTANCE);

  let offset = height - bottomMargin;
  for (let r = minR; r <= maxR; r = r * 10) {
    if (highlightMode === MAJOR && mouseNearCanvas() && mouseY > offset - (decadeWidth / 2) && mouseY < offset + (decadeWidth / 2)) {
      stroke(highlightColor);
      fill(highlightColor);
    } else {
      stroke(gridMajorColor);
      fill(gridMajorColor);
    }
    line(sideMargin, offset, width - sideMargin, offset);

    noStroke();
    textAlign(RIGHT, CENTER);
    text(formatNumber(r) + "Ω", sideMargin - 5, offset)

    if (r == maxR) {
      break;
    }

    stroke(gridMinorColor);
    let n = 2;
    for (let minor = r * 2; minor < r * 10; minor += r) {
      const y = offset - decadeOffsets.get(n);
      line(sideMargin, y, width - sideMargin, y);

      n++;
    }

    offset -= decadeWidth;
  }
  line(sideMargin, offset, width - sideMargin, offset);
}

function drawCapacitanceLines() {
  // Z = 1 / (2 * pi * f * C)
  // 1 / Z = 2 * pi * f * C
  // C = 1 / (2 * pi * f * Z)
  // f = 1 / (2 * pi * C * Z)

  // First, draw lines which originate on the right hand side (max frequency)
  const rightMinC = 1 / (2 * Math.PI * maxF * maxR);
  const rightMaxC = 1 / (2 * Math.PI * maxF * minR);

  for (let majorCLog = intLog10(rightMinC) + 1; majorCLog <= intLog10(rightMaxC); majorCLog++) {
    const majorC = Math.pow(10, majorCLog);
    // Z = 1 / (2 * pi * f * C)
    const lineMinZ = 1 / (2 * Math.PI * maxF * majorC);
    // f = 1 / (2 * pi * C * Z)
    const lineMinF = 1 / (2 * Math.PI * majorC * maxR);

    stroke(diagonalGridMajorColor);
    clippedLine(width - sideMargin, offsetForR(lineMinZ), offsetForF(lineMinF), topMargin);

    // Draw label
    {
      push();
      translate((width - sideMargin) + fontSize, offsetForR(lineMinZ) + 5);
      rotate(45)
      textAlign(LEFT, TOP);
      fill(diagonalGridMajorColor);
      noStroke();
      text(formatNumber(majorC) + "F", 0, 0);
      pop();
    }

    // Draw minor lines
    stroke(diagonalGridMinorColor);
    let n = 2;
    for (let minorC = majorC * 2; minorC < majorC * 10; minorC += majorC) {
      // Z = 1 / (2 * pi * f * C)
      const minorLineMinZ = 1 / (2 * Math.PI * maxF * minorC);
      // f = 1 / (2 * pi * C * Z)
      const minorLinMinF = 1 / (2 * Math.PI * minorC * maxR);

      stroke(diagonalGridMinorColor);
      clippedLine(width - sideMargin, offsetForR(minorLineMinZ), offsetForF(minorLinMinF), topMargin);
    }
  }

  // Now, draw lines which originate on the bottom (min resistance)
  const bottomMinC = 1 / (2 * Math.PI * maxF * minR);
  const bottomMaxC = 1 / (2 * Math.PI * minF * minR);

  for (let majorCLog = intLog10(bottomMinC) + 1; majorCLog <= intLog10(bottomMaxC); majorCLog++) {
    const majorC = Math.pow(10, majorCLog);
    // Z = 1 / (2 * pi * f * C)
    const lineMaxR = 1 / (2 * Math.PI * minF * majorC);
    // f = 1 / (2 * pi * C * Z)
    const lineMaxF = 1 / (2 * Math.PI * majorC * minR);

    stroke(diagonalGridMajorColor);
    clippedLine(offsetForF(lineMaxF), height - bottomMargin, sideMargin, offsetForR(lineMaxR));

    // Draw label
    {
      push();
      translate(offsetForF(lineMaxF) + fontSize / 2 + 5, topMargin + gridHeight + 5);
      rotate(45)
      textAlign(LEFT, TOP);
      fill(diagonalGridMajorColor);
      noStroke();
      text(formatNumber(majorC) + "F", 0, 0);
      pop();
    }

    if (majorCLog == intLog10(bottomMaxC)) {
      break;
    }

    // Draw minor lines
    stroke(diagonalGridMinorColor);
    let n = 2;
    for (let minorC = majorC * 2; minorC < majorC * 10; minorC += majorC) {
      // Z = 1 / (2 * pi * f * C)
      const minorLineMaxR = 1 / (2 * Math.PI * minF * minorC);
      // f = 1 / (2 * pi * C * Z)
      const minorLineMaxF = 1 / (2 * Math.PI * minorC * minR);

      stroke(diagonalGridMinorColor);
      clippedLine(offsetForF(minorLineMaxF), height - bottomMargin, sideMargin, offsetForR(minorLineMaxR));
    }
  }
}

function drawInductanceLines() {
  // Z = 2 * pi * f * L
  // L = Z / (2 * pi * f)
  // f = Z / (2 * pi * L)

  // First, draw lines which originate on the left hand side (min frequency)
  const leftMaxL = maxR / (2 * Math.PI * minF);
  const leftMinL = minR / (2 * Math.PI * minF);

  for (let majorLLog = intLog10(leftMinL) + 1; majorLLog <= intLog10(leftMaxL); majorLLog++) {
    const majorL = Math.pow(10, majorLLog);
    // Z = 2 * pi * f * L
    const lineMinZ = 2 * Math.PI * minF * majorL;
    // f = Z / (2 * pi * L)
    const lineMaxF = maxR / (2 * Math.PI * majorL);

    stroke(diagonalGridMajorColor);
    clippedLine(sideMargin, offsetForR(lineMinZ), offsetForF(lineMaxF), topMargin);

    {
      push();
      translate(sideMargin - fontSize, offsetForR(lineMinZ));
      rotate(-45)
      textAlign(RIGHT, TOP);
      fill(diagonalGridMajorColor);
      noStroke();
      text(formatNumber(majorL) + "H", 0, 0);
      pop();
    }

    // Draw minor lines
    stroke(diagonalGridMinorColor);
    let n = 2;
    for (let minorL = majorL * 2; minorL < majorL * 10; minorL += majorL) {
      // Z = 2 * pi * f * L
      const minorLineMinZ = 2 * Math.PI * minF * minorL;
      // f = Z / (2 * pi * L)
      const minorLineMaxF = maxR / (2 * Math.PI * minorL);

      stroke(diagonalGridMinorColor);
      clippedLine(sideMargin, offsetForR(minorLineMinZ), offsetForF(minorLineMaxF), topMargin);
    }
  }

  // Now, draw lines which originate on the bottom (min resistance)
  const bottomMaxL = minR / (2 * Math.PI * minF);
  // L = Z / (2 * pi * f)
  const bottomMinL = minR / (2 * Math.PI * maxF);

  for (let majorLLog = intLog10(bottomMinL) + 1; majorLLog <= intLog10(bottomMaxL); majorLLog++) {
    const majorL = Math.pow(10, majorLLog);
    // f = Z / (2 * pi * L)
    const lineMinF = minR / (2 * Math.PI * majorL);
    // Z = 2 * pi * f * L
    const lineMaxR = 2 * Math.PI * maxF * majorL;

    stroke(diagonalGridMajorColor);
    clippedLine(offsetForF(lineMinF), height - bottomMargin, width - sideMargin, offsetForR(lineMaxR));

    {
      push();
      translate(offsetForF(lineMinF) - fontSize / 2, height - bottomMargin + 5);
      rotate(-45)
      textAlign(RIGHT, TOP);
      fill(diagonalGridMajorColor);
      noStroke();
      text(formatNumber(majorL) + "H", 0, 0);
      pop();
    }

    // Draw minor lines
    stroke(diagonalGridMinorColor);
    let n = 2;
    for (let minorL = majorL * 2; minorL < majorL * 10; minorL += majorL) {
      // Z = 2 * pi * f * L
      const minorLineMaxZ = 2 * Math.PI * maxF * minorL;
      // f = Z / (2 * pi * L)
      const minorLineMinF = minR / (2 * Math.PI * minorL);

      stroke(diagonalGridMinorColor);
      clippedLine(offsetForF(minorLineMinF), height - bottomMargin, width - sideMargin, offsetForR(minorLineMaxZ));
    }
  }
}

function draw() {
  drawCapacitanceLines();
  drawInductanceLines();
  drawFrequencyLines();
  drawResistanceLines();
}
