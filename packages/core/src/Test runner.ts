import { execSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { CommandResult, ModuleRecord, TestReport } from './types';

export class TestRunner {
  private run(command: string, cwd: string): CommandResult {
    const start = performance.now();

    try {
      const stdout = execSync(command, {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      });

      return {
        success: true,
        exitCode: 0,
        stdout,
        stderr: '',
        durationMs: performance.now() - start
      };
    } catch (error: any) {
      return {
        success: false,
        exitCode: error.status ?? 1,
        stdout: error.stdout?.toString() ?? '',
        stderr: error.stderr?.toString() ?? error.message,
        durationMs: performance.now() - start
      };
    }
  }

  execute(module: ModuleRecord): TestReport {
    const build = this.run(module.buildCommand ?? 'npm run build', module.path);
    if (!build.success) {
      return { success: false, build, tests: build };
    }

    const tests = this.run(module.testCommand ?? 'npm test', module.path);

    return {
      success: build.success && tests.success,
      build,
      tests
    };
  }
}
