import React from "react";
import { useState } from "react";
import "./App.css";
import { Sketch } from "./components/p5-sketch";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { formatNumber } from "./math/math";
import { HighlightMode } from "./types";
import { HighlightModePicker } from "./components/highlight-mode-picker";

function App() {
  const [frequency, setFrequency] = useState(0);
  const [resistance, setResistance] = useState(0);
  const [capacitance, setCapacitance] = useState(0);
  const [inductance, setInductance] = useState(0);

  const [frequencyHighlightMode, setFrequencyHighlightMode] = useState(
    HighlightMode.NONE,
  );
  const [resistanceHighlightMode, setResistanceHighlightMode] = useState(
    HighlightMode.NONE,
  );
  const [capacitanceHighlightMode, setCapacitanceHighlightMode] = useState(
    HighlightMode.NONE,
  );
  const [inductanceHighlightMode, setInductanceHighlightMode] = useState(
    HighlightMode.NONE,
  );

  return (
    <>
      <div id="sketch-container">
        <ReactP5Wrapper
          sketch={Sketch}
          setFrequency={setFrequency}
          setResistance={setResistance}
          setCapacitance={setCapacitance}
          setInductance={setInductance}
          frequencyHighlightMode={frequencyHighlightMode}
          resistanceHighlightMode={resistanceHighlightMode}
          capacitanceHighlightMode={capacitanceHighlightMode}
          inductanceHighlightMode={inductanceHighlightMode}
        />
      </div>
      <div id="highlight-forms">
        <HighlightModePicker
          modeName="Frequency"
          mode={frequencyHighlightMode}
          setMode={setFrequencyHighlightMode}
        />
        <HighlightModePicker
          modeName="Resistance"
          mode={resistanceHighlightMode}
          setMode={setResistanceHighlightMode}
        />
        <HighlightModePicker
          modeName="Capacitance"
          mode={capacitanceHighlightMode}
          setMode={setCapacitanceHighlightMode}
        />
        <HighlightModePicker
          modeName="Inductance"
          mode={inductanceHighlightMode}
          setMode={setInductanceHighlightMode}
        />
      </div>
      <div id="value-display">
        <div className="value-item">
          <span className="label">Frequency: </span>
          <span className="value">{formatNumber(frequency, 3)}Hz</span>
        </div>
        <div className="value-item">
          <span className="label">Resistance: </span>
          <span className="value">{formatNumber(resistance, 3)}Ω</span>
        </div>
        <div className="value-item">
          <span className="label">Capacitance: </span>
          <span className="value">{formatNumber(capacitance, 3)}F</span>
        </div>
        <div className="value-item">
          <span className="label">Inductance: </span>
          <span className="value">{formatNumber(inductance, 3)}H</span>
        </div>
      </div>
    </>
  );
}

export default App;
