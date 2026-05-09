import { ModuleRegistry } from './ModuleRegistry';
import { SelfHealingTestRunner } from './SelfHealingTestRunner';
import { MutationTester } from './MutationTester';
import { LockManager } from './LockManager';
import { AdaptivePlanner } from './AdaptivePlanner';
import { ModuleDefinition } from './types';

export class Orchestrator {
  constructor(
    private readonly registry = new ModuleRegistry(),
    private readonly tester = new SelfHealingTestRunner(),
    private readonly mutation = new MutationTester(),
    private readonly locks = new LockManager(),
    private readonly planner = new AdaptivePlanner()
  ) {}

  register(module: ModuleDefinition) {
    return this.registry.register(module);
  }

  buildAndLock(name: string): boolean {
    const module = this.registry.get(name);
    if (!module) throw new Error(`Module not found: ${name}`);

    this.registry.update(name, { status: 'testing' });

    const testReport = this.tester.execute(module);
    if (!testReport.success) {
      this.registry.update(name, {
        status: 'failed',
        lastError: testReport.tests.stderr
      });
      return false;
    }

    const mutationReport = this.mutation.execute(module);
    if (!mutationReport.success) {
      this.registry.update(name, {
        status: 'failed',
        lastError: `Mutation score too low: ${mutationReport.score}`
      });
      return false;
    }

    const updated = this.registry.update(name, {
      status: 'locked',
      locked: true,
      mutationScore: mutationReport.score
    });

    const lock = this.locks.create(updated);

    this.registry.update(name, { hash: lock.hash });

    return true;
  }

  nextModule() {
    return this.planner.next(this.registry.list());
  }
}
