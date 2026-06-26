import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { detectInstaller, updateScripts, addDev, removeDev } from './index.js';

describe('workflow-upgrade utilities', () => {
  describe('detectInstaller', () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-upgrade-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true });
    });

    it('returns npm when only package-lock.json exists', () => {
      fs.writeFileSync(path.join(tmpDir, 'package-lock.json'), '');
      expect(detectInstaller(tmpDir)).toBe('npm');
    });

    it('returns yarn when only yarn.lock exists', () => {
      fs.writeFileSync(path.join(tmpDir, 'yarn.lock'), '');
      expect(detectInstaller(tmpDir)).toBe('yarn');
    });

    it('returns null when both lock files exist', () => {
      fs.writeFileSync(path.join(tmpDir, 'package-lock.json'), '');
      fs.writeFileSync(path.join(tmpDir, 'yarn.lock'), '');
      expect(detectInstaller(tmpDir)).toBeNull();
    });

    it('returns null when no lock files exist', () => {
      expect(detectInstaller(tmpDir)).toBeNull();
    });
  });

  describe('addDev', () => {
    it('generates npm install command', () => {
      expect(addDev('npm', ['foo', 'bar'])).toBe('npm install --save-dev foo bar');
    });

    it('generates yarn add command', () => {
      expect(addDev('yarn', ['foo', 'bar'])).toBe('yarn add --dev foo bar');
    });
  });

  describe('removeDev', () => {
    it('generates npm uninstall command', () => {
      expect(removeDev('npm', ['foo', 'bar'])).toBe('npm uninstall foo bar');
    });

    it('generates yarn remove command', () => {
      expect(removeDev('yarn', ['foo', 'bar'])).toBe('yarn remove foo bar');
    });
  });

  describe('updateScripts', () => {
    it('returns undefined for undefined input', () => {
      expect(updateScripts(undefined)).toBeUndefined();
    });

    it('converts jest commands to av test', () => {
      const scripts = { test: 'jest', 'test:coverage': 'jest --coverage' };
      const result = updateScripts(scripts);
      expect(result.test).toBe('av test');
      expect(result['test:coverage']).toBe('av test --coverage');
    });

    it('converts workflow commands to av equivalents', () => {
      const scripts = {
        start: 'workflow start',
        build: 'workflow build',
        test: 'workflow test',
        lint: 'workflow lint',
      };
      const result = updateScripts(scripts);
      expect(result.start).toBe('av start');
      expect(result.build).toBe('av build');
      expect(result.test).toBe('av test');
      expect(result.lint).toBe('av lint');
    });

    it('adds missing standard scripts', () => {
      const result = updateScripts({});
      expect(result.start).toBe('av start');
      expect(result.test).toBe('av test');
      expect(result.lint).toBe('av lint');
      expect(result.build).toBe('av build');
      expect(result['build:production']).toBe('cross-env NODE_ENV=production av build');
    });

    it('adds upgrade:workflow script', () => {
      const result = updateScripts({});
      expect(result['upgrade:workflow']).toBe('./node_modules/.bin/upgrade-workflow');
    });

    it('converts jest --watch to av test --watch', () => {
      const result = updateScripts({ 'test:watch': 'jest --watch' });
      expect(result['test:watch']).toBe('av test --watch');
    });

    it('does not overwrite custom scripts unrelated to workflow/jest', () => {
      const scripts = { 'custom:script': 'echo hello' };
      const result = updateScripts(scripts);
      expect(result['custom:script']).toBe('echo hello');
    });
  });
});
