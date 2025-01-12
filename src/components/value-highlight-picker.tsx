import React from "react";
import { useId } from "react";
import { ValueHighlight } from "../types";
import { useState } from "react";
import { parseNumber } from "../math/math";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

export function ValueHighlightPicker({
  valueHighlights,
  setValueHighlights,
}: {
  valueHighlights: ValueHighlight[];
  setValueHighlights: (valueHighlights: ValueHighlight[]) => void;
}) {
  const id = useId();

  const [text, setText] = useState("");
  const [color, setColor] = useColor("#00FF00");

  const addHighlight = () => {
    const valueHighlight = parseNumber(text);
    if (valueHighlight === null) {
      return;
    }
    if (color === undefined) {
      return;
    }
    valueHighlight.color = color.hex;

    setValueHighlights(valueHighlights.concat(valueHighlight));
    setText("");
  };

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addHighlight();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission
      addHighlight();
    }
  };

  return (
    <form onSubmit={formSubmit}>
      <fieldset>
        <legend>Add value highlight</legend>
        <div>
          <input
            type="text"
            name="value"
            id={id}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <ColorPicker color={color} onChange={setColor} />
          <button type="button" onClick={addHighlight}>
            Add
          </button>
        </div>
      </fieldset>
    </form>
  );
}
