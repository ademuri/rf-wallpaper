import * as React from 'react';
import { useState } from 'react';
import './App.css';
import { Sketch } from './components/p5-sketch';
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { formatNumber } from './math/math';

function App() {
  const [frequency, setFrequency] = useState(0);

  return (
    <>
      <div id="sketch-container">
        <ReactP5Wrapper sketch={Sketch} setFrequency={setFrequency} />
      </div>
      <div>
        <span>Frequency: {formatNumber(frequency, 3)}Hz</span>
      </div>
    </>
  );
}

export default App;
