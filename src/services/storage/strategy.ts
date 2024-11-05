import { getItem, setItem } from './base';
import type { Vision, Mission, Value, Perspective, SwotItem } from '../types';

// ... existing functions ...

// SWOT Analysis
export function getSwotItems(): SwotItem[] {
  return getItem<SwotItem>('swot-items');
}

export function setSwotItems(items: SwotItem[]): void {
  setItem('swot-items', items);
}