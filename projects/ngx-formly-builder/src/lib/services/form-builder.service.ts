import { computed, Injectable, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

export type DropPosition = 'top' | 'right' | 'bottom' | 'left';

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

  /**
   * Creates a new FormlyFieldConfig for the given field type.
   * Used by both the main component and the field-wrapper drop handler.
   */
  createField(fieldType: string): FormlyFieldConfig {
    const inputFieldTypes = ['number', 'email', 'password', 'telephone', 'url'];
    let formlyType = fieldType;
    let inputType: string | undefined;

    if (inputFieldTypes.includes(fieldType)) {
      formlyType = 'input';
      inputType = fieldType === 'telephone' ? 'tel' : fieldType;
    }

    const newField: FormlyFieldConfig = {
      key: `field_${Date.now()}`,
      type: formlyType,
      wrappers: ['field-wrapper'],
      props: {
        label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}`,
        placeholder: `Enter ${fieldType}`,
      },
    };

    if (inputType) {
      newField.props!.type = inputType;
    }

    if (fieldType === 'select') {
      newField.props!.options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];
    }

    if (fieldType === 'textarea') {
      newField.props!.rows = 5;
    }

    if (fieldType === 'multicheckbox' || fieldType === 'radio') {
      newField.props!.options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ];
    }

    if (fieldType === 'checkbox' || fieldType === 'toggle') {
      newField.props!.label = `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}`;
      delete newField.props!.placeholder;
    }

    if (fieldType === 'datepicker') {
      newField.props!.placeholder = 'Select a date';
    }

    if (fieldType === 'markdown') {
      newField.props!.label = 'Text Block';
      newField.props!.placeholder = 'Enter markdown content...';
      newField.defaultValue = '# Heading\n\nYour text here...';
    }

    return newField;
  }

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
    
    if (targetFieldData.fieldGroup && targetFieldData.fieldGroupClassName === 'grid grid-cols-12 gap-4') {
      // Already a grid layout - add the new field to the fieldGroup
      const updatedFieldGroup = structuredClone(targetFieldData);
      
      // TypeScript guard: we know fieldGroup exists here due to the check above
      if (!updatedFieldGroup.fieldGroup) {
        return;
      }
      
      // Duplicate className from existing fields in the group
      // Use the first field's className as the reference
      // Default to col-span-12 (full-width) if no className exists
      const existingFieldClassName = updatedFieldGroup.fieldGroup[0]?.className || 'col-span-12';
      newField.className = existingFieldClassName;
      
      if (position === 'left') {
        updatedFieldGroup.fieldGroup.unshift(newField);
      } else {
        updatedFieldGroup.fieldGroup.push(newField);
      }
      
      fields[targetIndex] = updatedFieldGroup;
    } else {
      // Create a new grid layout with both fields
      const gridField: FormlyFieldConfig = {
        fieldGroupClassName: 'grid grid-cols-12 gap-4',
        fieldGroup: []
      };
      
      // Extract className from target field to duplicate it
      // Default to col-span-12 (full-width) if no className exists
      const targetClassName = targetFieldData.className || 'col-span-12';
      
      // Clone the target field and duplicate its className to both fields
      const clonedTarget = structuredClone(targetFieldData);
      clonedTarget.className = targetClassName;
      newField.className = targetClassName;
      
      if (position === 'left') {
        gridField.fieldGroup = [newField, clonedTarget];
      } else {
        gridField.fieldGroup = [clonedTarget, newField];
      }
      
      // Replace the target field with the new grid
      fields[targetIndex] = gridField;
    }
    
    this.$fields.set(fields);
    this.$selectedField.set(newField);
    
    // Defer undo stack updates to avoid ExpressionChangedAfterItHasBeenCheckedError
    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }

  /**
   * Drops a new field (from palette) at a position relative to a target field.
   * - top/bottom: inserts the new field before/after the target as a full-width (col-span-12) item
   * - left/right: creates a two-column grid layout beside the target, halving each field's col-span
   */
  dropNewFieldAtPosition(newField: FormlyFieldConfig, targetField: FormlyFieldConfig, position: DropPosition) {
    const previousState = structuredClone(this.$fields());
    const fields = [...this.$fields()];
    const targetIndex = fields.findIndex(f => f === targetField);
    if (targetIndex === -1) return;

    if (position === 'top' || position === 'bottom') {
      newField.className = 'col-span-12';
      const insertIndex = position === 'top' ? targetIndex : targetIndex + 1;
      fields.splice(insertIndex, 0, newField);
      this.$fields.set(fields);
      this.$selectedField.set(newField);
    } else {
      // left / right: create a two-column grid, halving the col-span for both fields
      const targetColSpan = this.#getColSpan(targetField);
      const halfSpan = Math.max(1, Math.floor(targetColSpan / 2));
      const spanClass = `col-span-${halfSpan}`;
      targetField.className = spanClass;
      newField.className = spanClass;

      const gridField: FormlyFieldConfig = {
        fieldGroupClassName: 'grid grid-cols-12 gap-4',
        fieldGroup: position === 'left' ? [newField, targetField] : [targetField, newField],
      };
      fields[targetIndex] = gridField;
      this.$fields.set(fields);
      this.$selectedField.set(newField);
    }

    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }

  /**
   * Moves an existing field to a position relative to a target field.
   * - top/bottom: reorders the source before/after the target, sets source to col-span-12
   * - left/right: removes the source from its current position and adds it beside the target
   */
  moveFieldToPosition(sourceField: FormlyFieldConfig, targetField: FormlyFieldConfig, position: DropPosition) {
    if (sourceField === targetField) return;

    const previousState = structuredClone(this.$fields());
    const fields = [...this.$fields()];
    const sourceIndex = fields.findIndex(f => f === sourceField);
    const targetIndex = fields.findIndex(f => f === targetField);

    if (sourceIndex === -1 || targetIndex === -1) return;

    if (position === 'top' || position === 'bottom') {
      // Remove source from its current position
      fields.splice(sourceIndex, 1);
      // Recalculate target index after removal
      const newTargetIndex = fields.findIndex(f => f === targetField);
      const insertIndex = position === 'top' ? newTargetIndex : newTargetIndex + 1;
      sourceField.className = 'col-span-12';
      fields.splice(insertIndex, 0, sourceField);
      this.$fields.set(fields);
      this.$selectedField.set(sourceField);
      queueMicrotask(() => {
        this.#$undoStack.update((stack) => [...stack, previousState]);
        this.#$redoStack.set([]);
      });
    } else {
      // left / right: remove source from top-level, then add beside target
      fields.splice(sourceIndex, 1);
      this.$fields.set(fields);

      // Compute half col-span for side-by-side layout
      const targetColSpan = this.#getColSpan(targetField);
      const halfSpan = Math.max(1, Math.floor(targetColSpan / 2));
      const spanClass = `col-span-${halfSpan}`;
      targetField.className = spanClass;
      sourceField.className = spanClass;

      // Re-use addFieldBeside on the updated fields array (target is still there)
      const updatedFields = [...this.$fields()];
      const newTargetIndex = updatedFields.findIndex(f => f === targetField);
      if (newTargetIndex === -1) return;

      const gridField: FormlyFieldConfig = {
        fieldGroupClassName: 'grid grid-cols-12 gap-4',
        fieldGroup: position === 'left' ? [sourceField, targetField] : [targetField, sourceField],
      };
      updatedFields[newTargetIndex] = gridField;
      this.$fields.set(updatedFields);
      this.$selectedField.set(sourceField);
      queueMicrotask(() => {
        this.#$undoStack.update((stack) => [...stack, previousState]);
        this.#$redoStack.set([]);
      });
    }
  }

  #getColSpan(field: FormlyFieldConfig): number {
    const match = field.className?.match(/col-span-(\d+)/);
    return match ? parseInt(match[1], 10) : 12;
  }
}
