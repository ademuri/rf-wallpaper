import { Unit } from './enums.js';

export interface ValueHighlight {
  unit: Unit;
  value: number;
  display: string;
  // Color as a hex string
  color: string;
}