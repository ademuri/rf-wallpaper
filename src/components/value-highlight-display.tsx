import React from "react";
import { ValueHighlight } from "../types";

export function ValueHighlightDisplay({
  valueHighlight,
  removeCallback,
}: {
  valueHighlight: ValueHighlight;
  removeCallback: (ValueHighlight) => void;
}) {
  return (
    <div className="value-highlight-display">
      <div className="value-color" style={{backgroundColor: valueHighlight.color}}></div>
      <div className="value-item">
        <span className="label">Value: </span>
        <span className="value">{valueHighlight.display}</span>
      </div>
      <button type="button" onClick={removeCallback.bind(null, valueHighlight)}>Remove</button>
    </div>
  );
}
