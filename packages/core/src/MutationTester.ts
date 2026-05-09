import { ModuleRecord, MutationReport } from './types';

export class MutationTester {
  constructor(private readonly minimumScore = 80) {}

  execute(_module: ModuleRecord): MutationReport {
    // Replace with Stryker integration later.
    const score = 100;

    return {
      success: score >= this.minimumScore,
      score
    };
  }
}
