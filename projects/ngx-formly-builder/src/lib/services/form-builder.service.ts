import { computed, Injectable, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  $fields = signal<FormlyFieldConfig[]>([]);
  $selectedField = signal<FormlyFieldConfig | null>(null);
  $formTitle = signal<string>('Untitled Form');

  // Undo/Redo state
  readonly #$undoStack = signal<FormlyFieldConfig[][]>([]);
  readonly #$redoStack = signal<FormlyFieldConfig[][]>([]);

  // Computed signals for undo/redo availability
  readonly $canUndo = computed(() => this.#$undoStack().length > 0);
  readonly $canRedo = computed(() => this.#$redoStack().length > 0);

  addField(field: FormlyFieldConfig) {
    // Save state before making the change
    const previousState = structuredClone(this.$fields());
    this.$fields.update((fields) => [...fields, field]);
    // Defer undo stack updates to avoid ExpressionChangedAfterItHasBeenCheckedError
    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }

  addFieldAtIndex(field: FormlyFieldConfig, index: number) {
    // Save state before making the change
    const previousState = structuredClone(this.$fields());
    const fields = [...this.$fields()];
    fields.splice(index, 0, field);
    this.$fields.set(fields);
    // Defer undo stack updates to avoid ExpressionChangedAfterItHasBeenCheckedError
    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }

  updateFields() {
    const previousState = structuredClone(this.$fields());
    this.$fields.update((fields) => [...fields]);
    // Defer undo stack updates to avoid ExpressionChangedAfterItHasBeenCheckedError
    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }

  duplicateField(field: FormlyFieldConfig) {
    // Validate that field has a key
    if (!field.key) {
      console.error('Cannot duplicate field without a key');
      return;
    }

    // Save state before making the change
    const previousState = structuredClone(this.$fields());

    // Deep copy the field to avoid shared references
    const duplicatedField: FormlyFieldConfig = structuredClone(field);
    // Use crypto.randomUUID() for robust unique key generation
    const uniqueId = crypto.randomUUID().slice(0, 8);
    duplicatedField.key = `${field.key}_copy_${uniqueId}`;

    this.$fields.update((fields) => [...fields, duplicatedField]);
    this.$selectedField.set(duplicatedField);

    // Defer undo stack updates to avoid ExpressionChangedAfterItHasBeenCheckedError
    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }

  undo() {
    const undoStack = this.#$undoStack();
    if (undoStack.length === 0) {
      return;
    }

    // Save current state to redo stack
    this.#$redoStack.update((stack) => [...stack, structuredClone(this.$fields())]);

    // Pop from undo stack and restore
    const previousState = undoStack[undoStack.length - 1];
    this.#$undoStack.update((stack) => stack.slice(0, -1));
    this.$fields.set(structuredClone(previousState));
  }

  redo() {
    const redoStack = this.#$redoStack();
    if (redoStack.length === 0) {
      return;
    }

    // Save current state to undo stack
    this.#$undoStack.update((stack) => [...stack, structuredClone(this.$fields())]);

    // Pop from redo stack and restore
    const nextState = redoStack[redoStack.length - 1];
    this.#$redoStack.update((stack) => stack.slice(0, -1));
    this.$fields.set(structuredClone(nextState));
  }

  #saveToUndoStack() {
    const currentState = structuredClone(this.$fields());
    this.#$undoStack.update((stack) => [...stack, currentState]);
  }

  #clearRedoStack() {
    this.#$redoStack.set([]);
  }

  importFields(fields: FormlyFieldConfig[], formTitle?: string) {
    // Save state before making the change
    const previousState = structuredClone(this.$fields());
    this.$fields.set(fields);
    // Clear selected field as it may not exist in imported data
    this.$selectedField.set(null);
    // Set form title if provided
    if (formTitle) {
      this.$formTitle.set(formTitle);
    }
    // Defer undo stack updates to avoid ExpressionChangedAfterItHasBeenCheckedError
    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }

  clearForm() {
    // Save state before making the change
    const previousState = structuredClone(this.$fields());
    this.$fields.set([]);
    this.$selectedField.set(null);
    // Defer undo stack updates to avoid ExpressionChangedAfterItHasBeenCheckedError
    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }

  reorderFields(previousIndex: number, currentIndex: number) {
    // Save state before making the change
    const previousState = structuredClone(this.$fields());
    const fields = [...this.$fields()];
    const [movedField] = fields.splice(previousIndex, 1);
    fields.splice(currentIndex, 0, movedField);
    this.$fields.set(fields);
    // Defer undo stack updates to avoid ExpressionChangedAfterItHasBeenCheckedError
    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }

  /**
   * Adds a new field beside an existing field, creating a two-column layout
   * @param targetField The field to add beside
   * @param newField The new field to add
   * @param position Whether to add to the left or right
   */
  addFieldBeside(targetField: FormlyFieldConfig, newField: FormlyFieldConfig, position: 'left' | 'right') {
    // Save state before making the change
    const previousState = structuredClone(this.$fields());
    const fields = [...this.$fields()];
    const targetIndex = fields.findIndex(f => f === targetField);
    
    if (targetIndex === -1) {
      console.error('Target field not found. Cannot add field beside a field that does not exist in the fields array.');
      return;
    }

    // Check if target field is already in a fieldGroup
    const targetFieldData = fields[targetIndex];
    
    if (targetFieldData.fieldGroup && targetFieldData.fieldGroupClassName === 'row') {
      // Already a row layout - add the new field to the fieldGroup
      const updatedFieldGroup = structuredClone(targetFieldData);
      
      // TypeScript guard: we know fieldGroup exists here due to the check above
      if (!updatedFieldGroup.fieldGroup) {
        return;
      }
      
      // Add className to the new field
      newField.className = 'col-span-6';
      
      if (position === 'left') {
        updatedFieldGroup.fieldGroup.unshift(newField);
      } else {
        updatedFieldGroup.fieldGroup.push(newField);
      }
      
      fields[targetIndex] = updatedFieldGroup;
    } else {
      // Create a new row layout with both fields
      const rowField: FormlyFieldConfig = {
        fieldGroupClassName: 'row',
        fieldGroup: []
      };
      
      // Clone the target field and add className
      const clonedTarget = structuredClone(targetFieldData);
      clonedTarget.className = 'col-span-6';
      newField.className = 'col-span-6';
      
      if (position === 'left') {
        rowField.fieldGroup = [newField, clonedTarget];
      } else {
        rowField.fieldGroup = [clonedTarget, newField];
      }
      
      // Replace the target field with the new row
      fields[targetIndex] = rowField;
    }
    
    this.$fields.set(fields);
    this.$selectedField.set(newField);
    
    // Defer undo stack updates to avoid ExpressionChangedAfterItHasBeenCheckedError
    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }
}
