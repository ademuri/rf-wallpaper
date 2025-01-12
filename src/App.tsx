import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import { Sketch } from "./components/p5-sketch";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { formatNumber } from "./math/math";
import { HighlightMode, ValueHighlight } from "./types";
import { HighlightModePicker } from "./components/highlight-mode-picker";
import { ValueHighlightPicker } from "./components/value-highlight-picker";
import { ValueHighlightDisplay } from "./components/value-highlight-display";

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

  function getSavedValueHighlights(): ValueHighlight[] {
    const stringValue = localStorage.getItem("valueHighlights");
    if (stringValue !== null) {
      return JSON.parse(stringValue) as ValueHighlight[];
    }
    return [];
  }

  const [valueHighlights, setValueHighlights] = useState<ValueHighlight[]>(
    getSavedValueHighlights(),
  );

  useEffect(() => {
    localStorage.setItem("valueHighlights", JSON.stringify(valueHighlights));
  }, [valueHighlights]);

  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(0); // Initial height will be calculated in Sketch
  const [minR, setMinR] = useState(0.01);
  const [maxR, setMaxR] = useState(1000 * 1000);
  const [minF, setMinF] = useState(1);
  const [maxF, setMaxF] = useState(10 * 1000 * 1000 * 1000);

  const handleCanvasWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(event.target.value, 10);
    if (!isNaN(newWidth) && newWidth > 0) {
      console.log(newWidth);
        setCanvasWidth(newWidth);
    }
  };
  const handleMinRChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinR = parseFloat(event.target.value);
    if (!isNaN(newMinR) && newMinR > 0) {
        setMinR(newMinR);
    }
  };

  const handleMaxRChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxR = parseFloat(event.target.value);
    if (!isNaN(newMaxR) && newMaxR > 0) {
        setMaxR(newMaxR);
    }
  };

  const handleMinFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinF = parseFloat(event.target.value);
    if (!isNaN(newMinF) && newMinF > 0) {
        setMinF(newMinF);
    }
  };

  const handleMaxFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxF = parseFloat(event.target.value);
    if (!isNaN(newMaxF) && newMaxF > 0) {
        setMaxF(newMaxF);
    }
  };

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

  const removeValueHighlight = (valueHighlight: ValueHighlight) => {
    setValueHighlights(valueHighlights.filter((v) => v !== valueHighlight));
  };

  const valueHighlightList = valueHighlights.map((valueHighlight, index) => (
    <ValueHighlightDisplay
      key={index}
      valueHighlight={valueHighlight}
      removeCallback={removeValueHighlight}
    />
  ));

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
          highlights={valueHighlights}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          minR={minR}
          maxR={maxR}
          minF={minF}
          maxF={maxF}
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
      <div id="values-container">
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
        <div id="highlight-values">
          <ValueHighlightPicker
            valueHighlights={valueHighlights}
            setValueHighlights={setValueHighlights}
          />
        </div>
        {valueHighlightList}
        {valueHighlights.length > 0 && ( // Conditionally render the clear button
          <div id="clear-all-highlights">
            <button type="button" onClick={() => setValueHighlights([])}>
              Clear all highlights
            </button>
          </div>
        )}
      </div>
      <form>
        <label htmlFor="canvasWidth">Canvas Width:</label>
        <input
          type="number"
          id="canvasWidth"
          value={canvasWidth}
          onChange={handleCanvasWidthChange}
        />
        <br/>
        <label htmlFor="minR">Min Resistance:</label>
        <input
          type="number"
          id="minR"
          value={minR}
          onChange={handleMinRChange}
        />
        <br/>
        <label htmlFor="maxR">Max Resistance:</label>
        <input
          type="number"
          id="maxR"
          value={maxR}
          onChange={handleMaxRChange}
        />
        <br/>

        <label htmlFor="minF">Min Frequency:</label>
        <input
          type="number"
          id="minF"
          value={minF}
          onChange={handleMinFChange}
        />
        <br/>
        <label htmlFor="maxF">Max Frequency:</label>
        <input
          type="number"
          id="maxF"
          value={maxF}
          onChange={handleMaxFChange}
        />
      </form>
    </>
  );
}

export default App;
