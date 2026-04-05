import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'src', 'data');

// Minimal Upstash REST client — no package needed!
async function kvGet<T>(key: string): Promise<T | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const res = await fetch(`${url}/get/${key}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const json = await res.json();
  if (json.result === null || json.result === undefined) return null;
  return JSON.parse(json.result) as T;
}

async function kvSet<T>(key: string, data: T): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('No KV config');

  await fetch(`${url}/set/${key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(JSON.stringify(data)), // double-stringify: outer is fetch body, inner is stored value
    cache: 'no-store',
  });
}

export async function readJSON<T>(filename: string, fallback: T): Promise<T> {
  const key = `qc_data_${filename}`;

  if (process.env.UPSTASH_REDIS_REST_URL) {
    try {
      const data = await kvGet<T>(key);
      if (data !== null) return data;

      // Seed from local file on first run
      const filepath = join(DATA_DIR, filename);
      if (existsSync(filepath)) {
        const raw = readFileSync(filepath, 'utf-8');
        const parsed = JSON.parse(raw) as T;
        await kvSet(key, parsed);
        return parsed;
      }
    } catch (e) {
      console.error(`KV read error for ${filename}:`, e);
    }
    return fallback;
  }

  // Local dev fallback
  const filepath = join(DATA_DIR, filename);
  try {
    if (!existsSync(filepath)) return fallback;
    return JSON.parse(readFileSync(filepath, 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const key = `qc_data_${filename}`;

  if (process.env.UPSTASH_REDIS_REST_URL) {
    await kvSet(key, data);
    return;
  }

  // Local dev fallback
  const { writeFileSync } = await import('fs');
  const filepath = join(DATA_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}