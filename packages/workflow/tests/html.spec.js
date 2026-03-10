import path from 'path';
import { fileURLToPath } from 'url';
import html from '../html.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlDir = path.resolve(__dirname, '..');

describe('html', () => {
  let mockSettings;

  beforeEach(() => {
    mockSettings = {
      app: vi.fn(() => '/fake/project/app'),
      asset: vi.fn((workflow, project) => project),
      title: vi.fn(() => 'Test App')
    };
  });

  it('returns config with template, favicon, and title keys', () => {
    const config = html(mockSettings);

    expect(config).toHaveProperty('template');
    expect(config).toHaveProperty('favicon');
    expect(config).toHaveProperty('title');
  });

  it('title comes from settings.title()', () => {
    const config = html(mockSettings);

    expect(mockSettings.title).toHaveBeenCalled();
    expect(config.title).toBe('Test App');
  });

  it('calls asset twice (once for template, once for favicon)', () => {
    html(mockSettings);

    expect(mockSettings.asset).toHaveBeenCalledTimes(2);
  });

  it('template asset uses workflowTemplate and projectTemplate paths', () => {
    html(mockSettings);

    const expectedWorkflow = path.join(htmlDir, 'public', 'index.html');
    const expectedProject = path.join('/fake/project/app', 'index.html');

    expect(mockSettings.asset).toHaveBeenCalledWith(expectedWorkflow, expectedProject);
  });

  it('favicon asset uses workflowFavicon and projectFavicon paths', () => {
    html(mockSettings);

    const expectedWorkflow = path.join(htmlDir, 'public', 'favicon.ico');
    const expectedProject = path.join('/fake/project/app', 'favicon.ico');

    expect(mockSettings.asset).toHaveBeenCalledWith(expectedWorkflow, expectedProject);
  });
});
