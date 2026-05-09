import { TestRunner } from './TestRunner';
import { ModuleRecord, TestReport } from './types';

export class SelfHealingTestRunner {
  constructor(private readonly runner = new TestRunner()) {}

  execute(module: ModuleRecord): TestReport {
    const report = this.runner.execute(module);

    // Placeholder for future AI-assisted repair.
    return report;
  }
}
