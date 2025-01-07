const width = 1400;
const height = 1000;

const fontSize = 20;
const topMargin = fontSize * 2;
const bottomMargin = topMargin * 1.5;
let sideMargin;

const minR = 0.01;
const maxR = 1000 * 1000;
const minHz = 1;
const maxHz = 1000 * 1000 * 1000;

const numHzDecades = intLog10(maxHz - minHz);
const numRDecades = intLog10(maxR - minR);

const doHighlight = false;

let gridMajorColor;
let gridMinorColor;
let highlightColor;

function setup() {
  createCanvas(width, height);
  background(250);

  textSize(fontSize);
  textStyle(NORMAL);
  textFont("Arial");
  sideMargin = textWidth("100 mΩ") * 1.5;

  gridMajorColor = color(0, 0, 0);
  gridMinorColor = color(192, 192, 192);
  highlightColor = color(255, 0, 0);
}

function drawFrequencyLines() {
  const hzDecadeWidth = (width - sideMargin * 2) / numHzDecades;

  let offset = sideMargin;
  for (let hz = minHz; hz <= maxHz; hz = hz * 10) {
    if (doHighlight && mouseX > 0 && mouseX > offset - (hzDecadeWidth / 2) && mouseX < offset + (hzDecadeWidth / 2)) {
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
      const x = Math.log10(n) * hzDecadeWidth + offset
      line(x, topMargin, x, height - bottomMargin);

      n++;
    }

    offset += hzDecadeWidth;
  }
}

function drawResistanceLines() {
  const rDecadeHeight = (height - topMargin - bottomMargin) / numRDecades;

  let offset = topMargin;
  for (let r = maxR; r >= minR; r = r / 10) {
    if (doHighlight && mouseY > 0 && mouseY > offset - (rDecadeHeight / 2) && mouseY < offset + (rDecadeHeight / 2)) {
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

    if (r == minR) {
      break;
    }

    stroke(gridMinorColor);
    let n = 2;
    const step = r / 10;
    for (let minor = step; minor < r; minor += step) {
      const y = Math.log10(n) * rDecadeHeight + offset;
      line(sideMargin, y, width - sideMargin, y);

      n++;
    }

    offset += rDecadeHeight;
  }
}

function draw() {
  drawFrequencyLines();
  drawResistanceLines();
}
