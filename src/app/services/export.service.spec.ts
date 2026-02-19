import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ExportService } from './export.service';

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('downloadAsJson', () => {
    let createElementSpy: ReturnType<typeof vi.spyOn>;
    let appendChildSpy: ReturnType<typeof vi.spyOn>;
    let removeChildSpy: ReturnType<typeof vi.spyOn>;
    let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let mockLink: HTMLAnchorElement;

    beforeEach(() => {
      // Create a mock link element
      mockLink = document.createElement('a');
      mockLink.click = vi.fn();

      // Spy on document methods
      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);

      // Spy on URL methods
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should download data as JSON with default filename', () => {
      const testData = { field: 'value', nested: { key: 'data' } };

      service.downloadAsJson(testData);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.download).toBe('form-settings.json');
      expect(mockLink.href).toBe('blob:mock-url');
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should download data as JSON with custom filename', () => {
      const testData = [{ id: 1 }, { id: 2 }];
      const customFilename = 'my-custom-export';

      service.downloadAsJson(testData, customFilename);

      expect(mockLink.download).toBe(`${customFilename}.json`);
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should create a Blob with correct MIME type', () => {
      const testData = { test: 'data' };
      const blobSpy = vi.spyOn(globalThis, 'Blob');

      service.downloadAsJson(testData);

      expect(blobSpy).toHaveBeenCalledWith([JSON.stringify(testData, null, 2)], {
        type: 'application/json',
      });
    });

    it('should format JSON with 2-space indentation', () => {
      const testData = { key: 'value', nested: { item: 'data' } };
      const expectedJson = JSON.stringify(testData, null, 2);
      const blobSpy = vi.spyOn(globalThis, 'Blob');

      service.downloadAsJson(testData);

      expect(blobSpy).toHaveBeenCalledWith([expectedJson], { type: 'application/json' });
    });

    it('should handle empty objects', () => {
      const testData = {};

      service.downloadAsJson(testData);

      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toBe('form-settings.json');
    });

    it('should handle empty arrays', () => {
      const testData: unknown[] = [];

      service.downloadAsJson(testData);

      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toBe('form-settings.json');
    });
  });
});
