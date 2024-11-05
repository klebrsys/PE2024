const STORAGE_PREFIX = '@strategic-planning:';

export function getItem<T>(key: string): T[] {
  const data = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  return data ? JSON.parse(data) : [];
}

export function setItem<T>(key: string, value: T[]): void {
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
}