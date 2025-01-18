import { Unit } from './enums.js';

export interface ValueHighlight {
  name?: string;

  unit: Unit;
  value: number;
  display: string;
  // Color as a hex string
  color: string;
}

export interface CapacitorHighlight {
  name: string;

  capacitance_value: number;
  capacitance_display: string;

  min_resistance: number;

  inductance_value: number;
  inductance_display: string;

  // Color as a hex string
  color: string;
}
