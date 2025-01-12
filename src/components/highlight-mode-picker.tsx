import React from "react";
import { HighlightMode } from "../types";

export function HighlightModePicker({
  modeName,
  mode,
  setMode,
}: {
  modeName: string;
  mode: HighlightMode;
  setMode: (mode: HighlightMode) => void;
}) {
  const values = Object.values(HighlightMode)
    .filter((value) => typeof value === "number")
    .map((number: number) => {
      const id = `${modeName}-highlight-${number}`;
      const name = `${modeName}-highlight`;
      return (
        <span key={number}>
          <input
            type="radio"
            name={name}
            id={id}
            value={number}
            checked={mode === number} // Set the checked property
            onChange={() => setMode(number)} // Call setMode on change
          />
          <label htmlFor={id}>{HighlightMode[number]}</label>
        </span>
      );
    });

  return (
    <form>
      <fieldset>
        <legend>{modeName}</legend>
        <div>{values.reverse()}</div>
      </fieldset>
    </form>
  );
}
