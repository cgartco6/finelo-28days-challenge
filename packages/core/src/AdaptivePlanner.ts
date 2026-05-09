import { ModuleRecord } from './types';

export class AdaptivePlanner {
  next(modules: ModuleRecord[]): ModuleRecord | undefined {
    return modules
      .filter((m) => !m.locked)
      .sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100))[0];
  }
}
