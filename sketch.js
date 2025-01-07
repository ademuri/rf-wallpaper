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

const width = 1400;
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
      const x = Math.log10(n) * decadeWidth + offset
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
      const y = offset - Math.log10(n) * decadeWidth;
      line(sideMargin, y, width - sideMargin, y);

      n++;
    }

    offset -= decadeWidth;
  }
  line(sideMargin, offset, width - sideMargin, offset);
}

function draw() {
  drawFrequencyLines();
  drawResistanceLines();
}
