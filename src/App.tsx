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
  const [allHighlightMode, setAllHighlightMode] =
    useState<HighlightMode | null>(HighlightMode.NONE);

  const updateAllHighlightMode = (newMode: HighlightMode | null) => {
    if (
      newMode === frequencyHighlightMode &&
      newMode === resistanceHighlightMode &&
      newMode === capacitanceHighlightMode &&
      newMode === inductanceHighlightMode
    ) {
      setAllHighlightMode(newMode);
    } else {
      setAllHighlightMode(null);
    }
  };

  const setFrequencyHighlightModeAndAll = (mode: HighlightMode) => {
    setFrequencyHighlightMode(mode);
    updateAllHighlightMode(mode);
  };

  const setResistanceHighlightModeAndAll = (mode: HighlightMode) => {
    setResistanceHighlightMode(mode);
    updateAllHighlightMode(mode);
  };

  const setCapacitanceHighlightModeAndAll = (mode: HighlightMode) => {
    setCapacitanceHighlightMode(mode);
    updateAllHighlightMode(mode);
  };

  const setInductanceHighlightModeAndAll = (mode: HighlightMode) => {
    setInductanceHighlightMode(mode);
    updateAllHighlightMode(mode);
  };

  const setAllHighlightModes = (mode: HighlightMode) => {
    setFrequencyHighlightMode(mode);
    setResistanceHighlightMode(mode);
    setCapacitanceHighlightMode(mode);
    setInductanceHighlightMode(mode);
    setAllHighlightMode(mode);
  };

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
          setMode={setFrequencyHighlightModeAndAll}
        />
        <HighlightModePicker
          modeName="Resistance"
          mode={resistanceHighlightMode}
          setMode={setResistanceHighlightModeAndAll}
        />
        <HighlightModePicker
          modeName="Capacitance"
          mode={capacitanceHighlightMode}
          setMode={setCapacitanceHighlightModeAndAll}
        />
        <HighlightModePicker
          modeName="Inductance"
          mode={inductanceHighlightMode}
          setMode={setInductanceHighlightModeAndAll}
        />
        <HighlightModePicker
          modeName="All"
          mode={allHighlightMode}
          setMode={setAllHighlightModes}
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
