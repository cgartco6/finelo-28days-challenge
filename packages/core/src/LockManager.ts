import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { LockFile, ModuleRecord } from './types';

export class LockManager {
  private readonly lockDir: string;

  constructor(baseDir = process.cwd()) {
    this.lockDir = path.join(baseDir, '.avc', 'locks');
    fs.mkdirSync(this.lockDir, { recursive: true });
  }

  create(module: ModuleRecord): LockFile {
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(module))
      .digest('hex');

    const lock: LockFile = {
      module: module.name,
      hash,
      dependencies: module.dependencies,
      mutationScore: module.mutationScore ?? 0,
      lockedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(this.lockDir, `${module.name}.json`),
      JSON.stringify(lock, null, 2)
    );

    return lock;
  }

  exists(name: string): boolean {
    return fs.existsSync(path.join(this.lockDir, `${name}.json`));
  }
}
