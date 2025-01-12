import React from "react";
import { useId } from "react";
import { ValueHighlight } from "../types";
import { useState } from "react";
import { parseNumber } from "../math/math";

export function ValueHighlightPicker({
  valueHighlights,
  setValueHighlights,
}: {
  valueHighlights: ValueHighlight[];
  setValueHighlights: (valueHighlights: ValueHighlight[]) => void;
}) {
  const id = useId();

  const [text, setText] = useState("");

  const addHighlight = () => {
    const valueHighlight = parseNumber(text);
    if (valueHighlight === null) {
      return;
    }

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
          <button type="button" onClick={addHighlight}>
            Add
          </button>
        </div>
      </fieldset>
    </form>
  );
}
