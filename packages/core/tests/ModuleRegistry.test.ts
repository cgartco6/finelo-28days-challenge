import { describe, expect, it } from 'vitest';
import { ModuleRegistry } from '../src';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

describe('ModuleRegistry', () => {
  it('registers and retrieves a module', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'avc-'));
    const registry = new ModuleRegistry(dir);

    registry.register({
      name: 'core',
      path: dir,
      dependencies: []
    });

    const mod = registry.get('core');

    expect(mod?.name).toBe('core');
    expect(mod?.locked).toBe(false);
  });
});
