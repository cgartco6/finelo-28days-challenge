import { describe, expect, it } from 'vitest';
import { Orchestrator } from '../src';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

describe('Orchestrator', () => {
  it('registers a module', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'avc-'));
    const orchestrator = new Orchestrator();

    const mod = orchestrator.register({
      name: 'example',
      path: dir,
      dependencies: []
    });

    expect(mod.name).toBe('example');
  });
});
