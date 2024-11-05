import { getItem, setItem } from './base';
import type { SwotItem } from '../../types';

export function getSwotItems(): SwotItem[] {
  return getItem<SwotItem>('swot-items');
}

export function setSwotItems(items: SwotItem[]): void {
  setItem('swot-items', items);
}