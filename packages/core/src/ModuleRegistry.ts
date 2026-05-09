import fs from 'node:fs';
import path from 'node:path';
import { ModuleDefinition, ModuleRecord } from './types';

export class ModuleRegistry {
  private readonly registryPath: string;

  constructor(baseDir = process.cwd()) {
    const dir = path.join(baseDir, '.avc');
    fs.mkdirSync(dir, { recursive: true });
    this.registryPath = path.join(dir, 'modules.json');

    if (!fs.existsSync(this.registryPath)) {
      fs.writeFileSync(this.registryPath, '[]');
    }
  }

  list(): ModuleRecord[] {
    return JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
  }

  get(name: string): ModuleRecord | undefined {
    return this.list().find((m) => m.name === name);
  }

  register(def: ModuleDefinition): ModuleRecord {
    const existing = this.list();
    const record: ModuleRecord = {
      ...def,
      status: 'planned',
      locked: false,
      updatedAt: new Date().toISOString()
    };

    const filtered = existing.filter((m) => m.name !== def.name);
    filtered.push(record);
    this.save(filtered);

    return record;
  }

  update(name: string, patch: Partial<ModuleRecord>): ModuleRecord {
    const records = this.list();
    const idx = records.findIndex((m) => m.name === name);

    if (idx === -1) {
      throw new Error(`Module not found: ${name}`);
    }

    records[idx] = {
      ...records[idx],
      ...patch,
      updatedAt: new Date().toISOString()
    };

    this.save(records);
    return records[idx];
  }

  private save(records: ModuleRecord[]): void {
    fs.writeFileSync(this.registryPath, JSON.stringify(records, null, 2));
  }
}
