export type ModuleStatus =
  | 'planned'
  | 'building'
  | 'testing'
  | 'locked'
  | 'failed';

export interface ModuleDefinition {
  name: string;
  path: string;
  dependencies: string[];
  buildCommand?: string;
  testCommand?: string;
  mutationCommand?: string;
  priority?: number;
}

export interface ModuleRecord extends ModuleDefinition {
  status: ModuleStatus;
  locked: boolean;
  hash?: string;
  mutationScore?: number;
  lastError?: string;
  updatedAt: string;
}

export interface CommandResult {
  success: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
}

export interface TestReport {
  success: boolean;
  build: CommandResult;
  tests: CommandResult;
}

export interface MutationReport {
  success: boolean;
  score: number;
}

export interface LockFile {
  module: string;
  hash: string;
  dependencies: string[];
  mutationScore: number;
  lockedAt: string;
}
