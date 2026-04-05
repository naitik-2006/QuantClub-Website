/**
 * ─── File-based JSON Data Layer ───
 *
 * Read/write JSON files for persistent data storage.
 * Data lives in src/data/*.json and is version-controlled.
 * This means data survives re-deployments, and you can
 * back up / restore by exporting/importing the JSON files.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'src', 'data');

export function readJSON<T>(filename: string, fallback: T): T {
  const filepath = join(DATA_DIR, filename);
  try {
    if (!existsSync(filepath)) return fallback;
    const raw = readFileSync(filepath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(filename: string, data: T): void {
  const filepath = join(DATA_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}
