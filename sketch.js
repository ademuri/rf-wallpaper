const minR = 0.01;
const maxR = 1000 * 1000;
const minHz = 1;
const maxHz = 1000 * 1000 * 1000;

const numHzDecades = intLog10(maxHz) - intLog10(minHz);
const numRDecades = intLog10(maxR) - intLog10(minR);

const fontSize = 20;
const topMargin = fontSize * 2;
const bottomMargin = topMargin * 1.5;
const sideMargin = 100;

const width = 1200;
const gridWidth = width - sideMargin * 2;
const decadeWidth = gridWidth / numHzDecades
const gridHeight = numRDecades * decadeWidth;
const height = gridHeight + topMargin + bottomMargin;

const doHighlight = false;

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

function offsetForHz(hz) {
  return (Math.log10(hz) - Math.log10(minHz)) * decadeWidth + sideMargin;
}

// Assumes point 1 is always inside, and lines go lower right to upper left
function clippedLine(x1, y1, x2, y2) {
  if (x2 < sideMargin) {
    if (y2 < topMargin) {
      throw new Error(`point too out-of-bounds: (${x2}, ${y2})`);
    }
    const fraction = (sideMargin - x1) / (x2 - x1);
    line(x1, y1, sideMargin, y1 + (y2 - y1) * fraction);
  } else if (y2 < topMargin) {
    if (x2 < topMargin) {
      throw new Error(`point too out-of-bounds: (${x2}, ${y2})`);
    }
    const fraction = (topMargin - y1) / (y2 - y1);
    line(x1, y1, x1 + fraction * (x2 - x1), topMargin);
  } else {
    line(x1, y1, x2, y2);
  }
}

function setup() {
  createCanvas(width, height);
  background(250);

  textSize(fontSize);
  textStyle(NORMAL);
  textFont("Arial");

  gridMajorColor = color(0, 0, 0);
  gridMinorColor = color(192, 192, 192);
  diagonalGridMajorColor = color(64, 64, 64);
  diagonalGridMinorColor = color(208, 208, 208);
  highlightColor = color(255, 0, 0);
  noLoop();
}

function drawFrequencyLines() {
  let offset = sideMargin;
  for (let hz = minHz; hz <= maxHz; hz = hz * 10) {
    if (doHighlight && mouseX > 0 && mouseX > offset - (decadeWidth / 2) && mouseX < offset + (decadeWidth / 2)) {
      stroke(highlightColor);
      fill(highlightColor);
    } else {
      stroke(gridMajorColor);
      fill(gridMajorColor);
    }
    line(offset, topMargin, offset, height - bottomMargin);

    noStroke();
    textAlign(CENTER, BOTTOM);
    text(formatNumber(hz) + "Hz", offset, topMargin - 10);

    if (hz == maxHz) {
      break;
    }

    stroke(gridMinorColor);
    let n = 2;
    for (let minor = hz * 2; minor < hz * 10; minor += hz) {
      const x = decadeOffsets.get(n) + offset
      line(x, topMargin, x, height - bottomMargin);

      n++;
    }

    offset += decadeWidth;
  }
}

function drawResistanceLines() {
  let offset = height - bottomMargin;
  for (let r = minR; r <= maxR; r = r * 10) {
    if (doHighlight && mouseY > 0 && mouseY > offset - (decadeWidth / 2) && mouseY < offset + (decadeWidth / 2)) {
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
  const rightMinC = 1 / (2 * Math.PI * maxHz * maxR);
  const rightMaxC = 1 / (2 * Math.PI * maxHz * minR);

  for (let majorCLog = intLog10(rightMinC) + 1; majorCLog <= intLog10(rightMaxC); majorCLog++) {
    const majorC = Math.pow(10, majorCLog);
    // Z = 1 / (2 * pi * f * C)
    const minZ = 1 / (2 * Math.PI * maxHz * majorC);
    // f = 1 / (2 * pi * C * Z)
    const minHz = 1 / (2 * Math.PI * majorC * maxR);

    stroke(diagonalGridMajorColor);
    clippedLine(width - sideMargin, offsetForR(minZ), offsetForHz(minHz), topMargin);
  }

  // Now, draw lines which originate on the bottom (min resistance)
  const bottomMinC = 1 / (2 * Math.PI * maxHz * minR);
  const bottomMaxC = 1 / (2 * Math.PI * minHz * minR);

  for (let majorCLog = intLog10(bottomMinC) + 1; majorCLog < intLog10(bottomMaxC); majorCLog++) {
    const majorC = Math.pow(10, majorCLog);
    // Z = 1 / (2 * pi * f * C)
    const lineMaxR = 1 / (2 * Math.PI * minHz * majorC);
    // f = 1 / (2 * pi * C * Z)
    const lineMaxHz = 1 / (2 * Math.PI * majorC * minR);

    stroke(diagonalGridMajorColor);
    clippedLine(offsetForHz(lineMaxHz), height - bottomMargin, sideMargin, offsetForR(lineMaxR));
  }
}

function draw() {
  drawFrequencyLines();
  drawResistanceLines();
  drawCapacitanceLines();
}
