import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ImportService } from './import.service';

describe('ImportService', () => {
  let service: ImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('import', () => {
    let createElementSpy: ReturnType<typeof vi.spyOn>;
    let mockInput: HTMLInputElement;

    beforeEach(() => {
      // Create a mock input element
      mockInput = document.createElement('input');
      mockInput.click = vi.fn();

      // Spy on document methods
      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockInput);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create a file input element with correct attributes', async () => {
      const importPromise = service.import();

      expect(createElementSpy).toHaveBeenCalledWith('input');
      expect(mockInput.type).toBe('file');
      expect(mockInput.accept).toBe('application/json,.json');
      expect(mockInput.click).toHaveBeenCalled();

      // Simulate cancel to resolve the promise
      if (mockInput.oncancel) {
        mockInput.oncancel(new Event('cancel'));
      }
      await importPromise;
    });

    it('should return null when file selection is cancelled', async () => {
      const importPromise = service.import();

      // Simulate cancel
      if (mockInput.oncancel) {
        mockInput.oncancel(new Event('cancel'));
      }

      const result = await importPromise;
      expect(result).toBeNull();
    });

    it('should return null when no file is selected', async () => {
      const importPromise = service.import();

      // Simulate onchange with no file
      if (mockInput.onchange) {
        const event = new Event('change');
        Object.defineProperty(event, 'target', {
          value: { files: [] },
          writable: false,
        });
        mockInput.onchange(event);
      }

      const result = await importPromise;
      expect(result).toBeNull();
    });

    it('should parse valid JSON file and return FormlyFieldConfig array', async () => {
      const mockData = [
        { key: 'field1', type: 'input' },
        { key: 'field2', type: 'select' },
      ];
      const mockFile = new File([JSON.stringify(mockData)], 'test.json', {
        type: 'application/json',
      });

      const importPromise = service.import();

      // Simulate file selection
      if (mockInput.onchange) {
        const event = new Event('change');
        Object.defineProperty(event, 'target', {
          value: { files: [mockFile] },
          writable: false,
        });
        mockInput.onchange(event);

        // Wait for FileReader to complete
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const result = await importPromise;
      expect(result).toEqual(mockData);
    });

    it('should return null for invalid JSON', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockFile = new File(['invalid json {'], 'test.json', { type: 'application/json' });

      const importPromise = service.import();

      // Simulate file selection
      if (mockInput.onchange) {
        const event = new Event('change');
        Object.defineProperty(event, 'target', {
          value: { files: [mockFile] },
          writable: false,
        });
        mockInput.onchange(event);

        // Wait for FileReader to complete
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const result = await importPromise;
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should return null when JSON is not an array', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockFile = new File([JSON.stringify({ key: 'value' })], 'test.json', {
        type: 'application/json',
      });

      const importPromise = service.import();

      // Simulate file selection
      if (mockInput.onchange) {
        const event = new Event('change');
        Object.defineProperty(event, 'target', {
          value: { files: [mockFile] },
          writable: false,
        });
        mockInput.onchange(event);

        // Wait for FileReader to complete
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const result = await importPromise;
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid file format: expected an array of FormlyFieldConfig',
      );
    });

    it('should handle empty array', async () => {
      const mockData: unknown[] = [];
      const mockFile = new File([JSON.stringify(mockData)], 'test.json', {
        type: 'application/json',
      });

      const importPromise = service.import();

      // Simulate file selection
      if (mockInput.onchange) {
        const event = new Event('change');
        Object.defineProperty(event, 'target', {
          value: { files: [mockFile] },
          writable: false,
        });
        mockInput.onchange(event);

        // Wait for FileReader to complete
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const result = await importPromise;
      expect(result).toEqual([]);
    });
  });
});
