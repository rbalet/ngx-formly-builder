import { TestBed } from '@angular/core/testing';
import { FormBuilderService } from './form-builder.service';
import { FormlyFieldConfig } from '@ngx-formly/core';

describe('FormBuilderService', () => {
  let service: FormBuilderService;

  // Helper to flush microtasks
  const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Undo/Redo functionality', () => {
    it('should start with empty undo and redo stacks', () => {
      expect(service.$canUndo()).toBe(false);
      expect(service.$canRedo()).toBe(false);
    });

    it('should add field and enable undo', async () => {
      const field: FormlyFieldConfig = {
        key: 'testField',
        type: 'input',
      };

      service.addField(field);
      await flushMicrotasks();

      expect(service.$fields().length).toBe(1);
      expect(service.$canUndo()).toBe(true);
      expect(service.$canRedo()).toBe(false);
    });

    it('should undo field addition', async () => {
      const field: FormlyFieldConfig = {
        key: 'testField',
        type: 'input',
      };

      service.addField(field);
      await flushMicrotasks();
      expect(service.$fields().length).toBe(1);

      service.undo();
      expect(service.$fields().length).toBe(0);
      expect(service.$canUndo()).toBe(false);
      expect(service.$canRedo()).toBe(true);
    });

    it('should redo field addition', async () => {
      const field: FormlyFieldConfig = {
        key: 'testField',
        type: 'input',
      };

      service.addField(field);
      await flushMicrotasks();
      service.undo();
      expect(service.$fields().length).toBe(0);

      service.redo();
      expect(service.$fields().length).toBe(1);
      expect(service.$canUndo()).toBe(true);
      expect(service.$canRedo()).toBe(false);
    });

    it('should clear redo stack on new change', async () => {
      const field1: FormlyFieldConfig = {
        key: 'field1',
        type: 'input',
      };
      const field2: FormlyFieldConfig = {
        key: 'field2',
        type: 'input',
      };

      service.addField(field1);
      await flushMicrotasks();
      service.undo();
      expect(service.$canRedo()).toBe(true);

      service.addField(field2);
      await flushMicrotasks();
      expect(service.$canRedo()).toBe(false);
    });

    it('should handle multiple undo operations', async () => {
      const field1: FormlyFieldConfig = {
        key: 'field1',
        type: 'input',
      };
      const field2: FormlyFieldConfig = {
        key: 'field2',
        type: 'textarea',
      };

      service.addField(field1);
      await flushMicrotasks();
      service.addField(field2);
      await flushMicrotasks();

      expect(service.$fields().length).toBe(2);

      service.undo();
      expect(service.$fields().length).toBe(1);
      expect(service.$fields()[0].key).toBe('field1');

      service.undo();
      expect(service.$fields().length).toBe(0);
      expect(service.$canUndo()).toBe(false);
    });

    it('should handle multiple redo operations', async () => {
      const field1: FormlyFieldConfig = {
        key: 'field1',
        type: 'input',
      };
      const field2: FormlyFieldConfig = {
        key: 'field2',
        type: 'textarea',
      };

      service.addField(field1);
      await flushMicrotasks();
      service.addField(field2);
      await flushMicrotasks();
      service.undo();
      service.undo();

      expect(service.$fields().length).toBe(0);

      service.redo();
      expect(service.$fields().length).toBe(1);
      expect(service.$fields()[0].key).toBe('field1');

      service.redo();
      expect(service.$fields().length).toBe(2);
      expect(service.$canRedo()).toBe(false);
    });

    it('should not undo when stack is empty', () => {
      service.undo();
      expect(service.$fields().length).toBe(0);
    });

    it('should not redo when stack is empty', () => {
      service.redo();
      expect(service.$fields().length).toBe(0);
    });

    it('should work with duplicateField', async () => {
      const field: FormlyFieldConfig = {
        key: 'testField',
        type: 'input',
      };

      service.addField(field);
      await flushMicrotasks();
      service.duplicateField(field);
      await flushMicrotasks();

      expect(service.$fields().length).toBe(2);
      expect(service.$canUndo()).toBe(true);

      service.undo();
      expect(service.$fields().length).toBe(1);

      service.undo();
      expect(service.$fields().length).toBe(0);
    });
  });
});
