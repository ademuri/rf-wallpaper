import React from "react";
import { useId } from "react";
import { ValueHighlight } from "../types";
import { useState } from "react";
import { parseNumber } from "../math/math";
import { ChromePicker, ColorResult } from 'react-color';

export function ValueHighlightPicker({
  valueHighlights,
  setValueHighlights,
}: {
  valueHighlights: ValueHighlight[];
  setValueHighlights: (valueHighlights: ValueHighlight[]) => void;
}) {
  const id = useId();

  const createColorResult = (hex: string): ColorResult => {
    return {
      hex: hex,
      rgb: {r: 0, g: 0, b: 0},
      hsl: {h: 0, s: 0, l: 0},
    };
  };

  const [text, setText] = useState("");
  const [color, setColor] = useState<ColorResult>(createColorResult("#00FF00"));

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
  }

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
          />
          <ChromePicker color={color?.hex} onChangeComplete={setColor}/>
          <button type="button" onClick={addHighlight}>
            Add
          </button>
        </div>
      </fieldset>
    </form>
  );
}
