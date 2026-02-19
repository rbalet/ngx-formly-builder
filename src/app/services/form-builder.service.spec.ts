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

  describe('importFields', () => {
    it('should import fields and enable undo', async () => {
      const fields: FormlyFieldConfig[] = [
        { key: 'field1', type: 'input' },
        { key: 'field2', type: 'select' },
      ];

      service.importFields(fields);
      await flushMicrotasks();

      expect(service.$fields().length).toBe(2);
      expect(service.$canUndo()).toBe(true);
      expect(service.$canRedo()).toBe(false);
    });

    it('should clear selected field on import', async () => {
      const field: FormlyFieldConfig = { key: 'testField', type: 'input' };
      service.addField(field);
      await flushMicrotasks();
      service.$selectedField.set(field);

      const newFields: FormlyFieldConfig[] = [{ key: 'newField', type: 'textarea' }];
      service.importFields(newFields);
      await flushMicrotasks();

      expect(service.$selectedField()).toBeNull();
    });

    it('should save previous state for undo', async () => {
      const initialFields: FormlyFieldConfig[] = [{ key: 'field1', type: 'input' }];
      service.importFields(initialFields);
      await flushMicrotasks();

      const newFields: FormlyFieldConfig[] = [
        { key: 'field2', type: 'select' },
        { key: 'field3', type: 'textarea' },
      ];
      service.importFields(newFields);
      await flushMicrotasks();

      expect(service.$fields().length).toBe(2);

      service.undo();
      expect(service.$fields().length).toBe(1);
      expect(service.$fields()[0].key).toBe('field1');
    });

    it('should clear redo stack on import', async () => {
      const field: FormlyFieldConfig = { key: 'field1', type: 'input' };
      service.addField(field);
      await flushMicrotasks();
      service.undo();
      expect(service.$canRedo()).toBe(true);

      const newFields: FormlyFieldConfig[] = [{ key: 'field2', type: 'select' }];
      service.importFields(newFields);
      await flushMicrotasks();

      expect(service.$canRedo()).toBe(false);
    });
  });

  describe('clearForm', () => {
    it('should clear all fields', async () => {
      const fields: FormlyFieldConfig[] = [
        { key: 'field1', type: 'input' },
        { key: 'field2', type: 'select' },
      ];

      service.importFields(fields);
      await flushMicrotasks();
      expect(service.$fields().length).toBe(2);

      service.clearForm();
      expect(service.$fields().length).toBe(0);
    });

    it('should clear selected field', async () => {
      const field: FormlyFieldConfig = { key: 'testField', type: 'input' };
      service.addField(field);
      await flushMicrotasks();
      service.$selectedField.set(field);

      service.clearForm();
      expect(service.$selectedField()).toBeNull();
    });

    it('should enable undo after clearing', async () => {
      const fields: FormlyFieldConfig[] = [
        { key: 'field1', type: 'input' },
        { key: 'field2', type: 'select' },
      ];

      service.importFields(fields);
      await flushMicrotasks();

      service.clearForm();
      await flushMicrotasks();

      expect(service.$canUndo()).toBe(true);
    });

    it('should allow undoing a clear operation', async () => {
      const fields: FormlyFieldConfig[] = [
        { key: 'field1', type: 'input' },
        { key: 'field2', type: 'select' },
      ];

      service.importFields(fields);
      await flushMicrotasks();

      service.clearForm();
      await flushMicrotasks();
      expect(service.$fields().length).toBe(0);

      service.undo();
      expect(service.$fields().length).toBe(2);
      expect(service.$fields()[0].key).toBe('field1');
      expect(service.$fields()[1].key).toBe('field2');
    });

    it('should clear redo stack on clear', async () => {
      const field: FormlyFieldConfig = { key: 'field1', type: 'input' };
      service.addField(field);
      await flushMicrotasks();
      service.undo();
      expect(service.$canRedo()).toBe(true);

      service.clearForm();
      await flushMicrotasks();

      expect(service.$canRedo()).toBe(false);
    });
  });

  describe('reorderFields', () => {
    it('should reorder fields', async () => {
      const field1: FormlyFieldConfig = { key: 'field1', type: 'input' };
      const field2: FormlyFieldConfig = { key: 'field2', type: 'textarea' };
      const field3: FormlyFieldConfig = { key: 'field3', type: 'select' };

      service.addField(field1);
      await flushMicrotasks();
      service.addField(field2);
      await flushMicrotasks();
      service.addField(field3);
      await flushMicrotasks();

      // Move field at index 0 to index 2
      service.reorderFields(0, 2);
      await flushMicrotasks();

      expect(service.$fields().length).toBe(3);
      expect(service.$fields()[0].key).toBe('field2');
      expect(service.$fields()[1].key).toBe('field3');
      expect(service.$fields()[2].key).toBe('field1');
    });

    it('should enable undo after reordering', async () => {
      const field1: FormlyFieldConfig = { key: 'field1', type: 'input' };
      const field2: FormlyFieldConfig = { key: 'field2', type: 'textarea' };

      service.addField(field1);
      await flushMicrotasks();
      service.addField(field2);
      await flushMicrotasks();

      service.reorderFields(0, 1);
      await flushMicrotasks();

      expect(service.$canUndo()).toBe(true);
    });

    it('should allow undoing a reorder operation', async () => {
      const field1: FormlyFieldConfig = { key: 'field1', type: 'input' };
      const field2: FormlyFieldConfig = { key: 'field2', type: 'textarea' };
      const field3: FormlyFieldConfig = { key: 'field3', type: 'select' };

      service.addField(field1);
      await flushMicrotasks();
      service.addField(field2);
      await flushMicrotasks();
      service.addField(field3);
      await flushMicrotasks();

      service.reorderFields(0, 2);
      await flushMicrotasks();

      service.undo();
      expect(service.$fields()[0].key).toBe('field1');
      expect(service.$fields()[1].key).toBe('field2');
      expect(service.$fields()[2].key).toBe('field3');
    });

    it('should clear redo stack on reorder', async () => {
      const field1: FormlyFieldConfig = { key: 'field1', type: 'input' };
      const field2: FormlyFieldConfig = { key: 'field2', type: 'textarea' };

      service.addField(field1);
      await flushMicrotasks();
      service.addField(field2);
      await flushMicrotasks();
      service.undo();
      expect(service.$canRedo()).toBe(true);

      service.reorderFields(0, 0);
      await flushMicrotasks();

      expect(service.$canRedo()).toBe(false);
    });
  });
});
