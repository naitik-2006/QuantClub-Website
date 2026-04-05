import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { kv } from '@vercel/kv';

const DATA_DIR = join(process.cwd(), 'src', 'data');

export async function readJSON<T>(filename: string, fallback: T): Promise<T> {
  const key = `qc_data_${filename}`;
  
  // Try to use Vercel KV if available
  if (process.env.KV_REST_API_URL) {
    try {
      const data = await kv.get<T>(key);
      if (data) return data;
      
      // If KV is empty, seed it from local file system
      const filepath = join(DATA_DIR, filename);
      if (existsSync(filepath)) {
        const raw = readFileSync(filepath, 'utf-8');
        const parsedData = JSON.parse(raw) as T;
        await kv.set(key, parsedData);
        return parsedData;
      }
    } catch (e) {
      console.error(`KV read error for ${filename}:`, e);
    }
    return fallback;
  }
  
  // Fallback to local FS for dev without KV
  const filepath = join(DATA_DIR, filename);
  try {
    if (!existsSync(filepath)) return fallback;
    const raw = readFileSync(filepath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const key = `qc_data_${filename}`;
  
  if (process.env.KV_REST_API_URL) {
    try {
      await kv.set(key, data);
      return; // Skip writing to FS in production with KV
    } catch (e) {
      console.error(`KV write error for ${filename}:`, e);
    }
  }

  // Fallback to local FS
  const filepath = join(DATA_DIR, filename);
  try {
    writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`FS write error for ${filename}:`, e);
  }
}
