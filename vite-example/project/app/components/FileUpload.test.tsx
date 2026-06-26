import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FileUpload } from './FileUpload';

describe('FileUpload', () => {
  test('renders the card header', () => {
    render(<FileUpload />);
    expect(screen.getByText('File Upload Example')).toBeDefined();
  });

  test('renders the file upload button', () => {
    render(<FileUpload />);
    expect(screen.getByText('Upload file')).toBeDefined();
  });
});
