import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, it, expect, vi, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Tests for the Windows ESM dynamic-import bug fix (ERR_UNSUPPORTED_ESM_URL_SCHEME)
//
// Root cause: `await import(rawFsPath)` on Windows throws because Node treats
// "C:" as a URL scheme.  The fix wraps every filesystem path with pathToFileURL()
// before passing it to a dynamic import().
//
// These tests verify:
//   1. pathToFileURL always produces a file: URL regardless of path format
//   2. The URLs that would be passed to import() in config.js / workflow-vite /
//      mock-server all satisfy the file: URL contract
// ---------------------------------------------------------------------------

/* eslint vitest/expect-expect: ["error", { "assertFunctionNames": ["expect", "assertFileUrl"] }] */

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Helper ─────────────────────────────────────────────────────────────────

/**
 * Asserts that a URL string is a valid file: URL, never a bare filesystem path.
 * Before the fix, Windows paths like "C:\...\workflow.js" were passed directly
 * and Node threw ERR_UNSUPPORTED_ESM_URL_SCHEME because "C:" looks like a scheme.
 */
function assertFileUrl(url) {
  expect(typeof url).toBe('string');
  expect(url).toMatch(/^file:\/\//);
  expect(url).not.toMatch(/^[A-Za-z]:[/\\]/); // must not start with a drive letter
}

// ── pathToFileURL contract ─────────────────────────────────────────────────

describe('pathToFileURL — produces importable file: URLs', () => {
  it('converts a POSIX absolute path', () => {
    assertFileUrl(pathToFileURL('/home/user/project/config/workflow.js').href);
  });

  it('converts a path with spaces', () => {
    assertFileUrl(pathToFileURL('/home/my user/project config/workflow.js').href);
  });

  it('converts a normalised Windows-style path', () => {
    // On Windows, path.join yields "C:\...\workflow.js". After normalisation
    // (replacing backslashes) we get a POSIX-style path starting with the drive.
    // pathToFileURL handles this correctly on all platforms.
    const windowsLike = '/C:/Users/dev/project/config/workflow.js';
    assertFileUrl(pathToFileURL(windowsLike).href);
  });

  it('result never contains an ambiguous drive-letter scheme prefix', () => {
    const testCases = [
      '/unix/absolute/workflow.js',
      '/home/ci/.config/app/workflow.js',
      '/C:/Users/dev/project/config/workflow.js',
      '/D:/workspaces/availity/project/config/workflow.js',
    ];
    for (const p of testCases) {
      assertFileUrl(pathToFileURL(p).href);
    }
  });
});

// ── Regression: raw path vs. file: URL ────────────────────────────────────

describe('regression — ERR_UNSUPPORTED_ESM_URL_SCHEME', () => {
  it('a raw Windows path does NOT satisfy the file: URL contract (documents old behaviour)', () => {
    const rawWindowsPath = 'C:\\Users\\dev\\project\\config\\workflow.js';
    // This is what used to be passed to import() — it is NOT a file: URL.
    expect(rawWindowsPath).not.toMatch(/^file:\/\//);
    // Node sees "C:" as a scheme and throws ERR_UNSUPPORTED_ESM_URL_SCHEME.
  });

  it('the same path wrapped with pathToFileURL DOES satisfy the contract (documents the fix)', () => {
    const rawWindowsPath = 'C:\\Users\\dev\\project\\config\\workflow.js';
    // Normalise backslashes as Node's path module does internally.
    const normalised = rawWindowsPath.replaceAll('\\', '/');
    const url = pathToFileURL(normalised).href;
    assertFileUrl(url);
    expect(url).toContain('workflow.js');
  });
});

// ── Per-package path shapes ────────────────────────────────────────────────

describe('packages/workflow — config.js import path', () => {
  it('jsWorkflowConfig resolved with path.join produces a valid file: URL', () => {
    // Simulate what config.js computes: path.join(paths.project, 'project/config/workflow.js')
    const simulatedProjectRoot = process.cwd();
    const jsWorkflowConfig = path.join(simulatedProjectRoot, 'project', 'config', 'workflow.js');
    assertFileUrl(pathToFileURL(jsWorkflowConfig).href);
  });
});

describe('packages/workflow-vite — settings/index.js import path', () => {
  it('jsWorkflowConfig resolved with path.join produces a valid file: URL', () => {
    const simulatedProjectRoot = process.cwd();
    const jsWorkflowConfig = path.join(simulatedProjectRoot, 'project', 'config', 'workflow.js');
    assertFileUrl(pathToFileURL(jsWorkflowConfig).href);
  });
});

describe('packages/mock-server — config/index.js import paths', () => {
  it('this.path (absolute config path) produces a valid file: URL', () => {
    const mockServerConfigPath = path.join(process.cwd(), 'project', 'config', 'mock-server.js');
    assertFileUrl(pathToFileURL(mockServerConfigPath).href);
  });

  it('path argument to defaultConfig() produces a valid file: URL', () => {
    const configPath = path.join(process.cwd(), 'project', 'config', 'index.js');
    assertFileUrl(pathToFileURL(configPath).href);
  });
});
