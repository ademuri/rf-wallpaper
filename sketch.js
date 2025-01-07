function intLog10(number) {
  return Math.round(Math.log10(number));
}

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

function formatNumber(number) {
  const magnitude = Math.trunc(intLog10(number) / 3);
  const prefixes = new Map([
    [-1, "m"],
    [0, ""],
    [1, "k"],
    [2, "M"],
    [3, "G"],
  ]);

  const prefix = prefixes.get(magnitude);
  if (prefix === undefined) {
    return number;
  }

  const remainder = number / Math.pow(1000, magnitude);

  return `${remainder} ${prefix}`;
}

const outputTestsToConsole = false;

new UnitTester("intLog10", "handles even powers of 10",
  () => {
    UnitTester.assert_strict_equal(intLog10(1), 0);
    UnitTester.assert_strict_equal(intLog10(10), 1);
    UnitTester.assert_strict_equal(intLog10(100), 2);
  }
).test(outputTestsToConsole);

new UnitTester("intLog10", "handles non-powers of 10",
  () => {
    UnitTester.assert_strict_equal(intLog10(2), 0);
    UnitTester.assert_strict_equal(intLog10(11), 1);
    UnitTester.assert_strict_equal(intLog10(102), 2);
  }
).test(outputTestsToConsole);

new UnitTester("formatNumber", "formats numbers 1-100",
  () => {
    UnitTester.assert_strict_equal(formatNumber(1), "1 ");
    UnitTester.assert_strict_equal(formatNumber(10), "10 ");
    UnitTester.assert_strict_equal(formatNumber(100), "100 ");
  }
).test(outputTestsToConsole);

new UnitTester("formatNumber", "uses the right prefixes",
  () => {
    UnitTester.assert_strict_equal(formatNumber(1), "1 ");
    UnitTester.assert_strict_equal(formatNumber(1000), "1 k");
    UnitTester.assert_strict_equal(formatNumber(1000 * 1000), "1 M");
    UnitTester.assert_strict_equal(formatNumber(1000 * 1000 * 1000), "1 G");
  }
).test(outputTestsToConsole);

function setup() {
  createCanvas(width, height);
  background(250);
  // noLoop();

  textSize(fontSize);
  textStyle(NORMAL);
  textFont("Arial");
  sideMargin = textWidth("100 mΩ") * 1.5;
}

function drawFrequencyLines() {
  const hzDecadeWidth = (width - sideMargin * 2) / numHzDecades;

  let offset = sideMargin;
  for (let hz = minHz; hz <= maxHz; hz = hz * 10) {
    if (winMouseX > offset - (hzDecadeWidth / 2) && winMouseX < offset + (hzDecadeWidth / 2)) {
      stroke(255, 0, 0);
      fill(255, 0, 0);
    } else {
      stroke(0, 0, 0);
      fill(0, 0, 0);
    }
    line(offset, topMargin, offset, height - bottomMargin);

    noStroke();
    textAlign(CENTER, BOTTOM);
    text(formatNumber(hz) + "Hz", offset, topMargin - 10);

    offset += hzDecadeWidth;
  }
}

function drawResistanceLines() {
  const rDecadeHeight = (height - topMargin - bottomMargin) / numRDecades;

  let offset = topMargin;
  for (let r = maxR; r >= minR; r = r / 10) {
    if (winMouseY > offset - (rDecadeHeight / 2) && winMouseY < offset + (rDecadeHeight / 2)) {
      stroke(255, 0, 0);
      fill(255, 0, 0);
    } else {
      stroke(0, 0, 0);
      fill(0, 0, 0);
    }
    line(sideMargin, offset, width - sideMargin, offset);

    noStroke();
    textAlign(RIGHT, CENTER);
    text(formatNumber(r) + "Ω", sideMargin - 5, offset)

    offset += rDecadeHeight;
  }
}

function draw() {
  drawFrequencyLines();
  drawResistanceLines();
}
