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
    this.$fields.set(this.#addWrappersToFields(fields));
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
   * - top/bottom: inserts the new field before/after the target (or its parent group) as full-width
   * - left/right: creates a two-column grid layout beside the target, halving each field's col-span;
   *   if the target is already inside a fieldGroup, the new field is inserted into that group instead
   */
  dropNewFieldAtPosition(newField: FormlyFieldConfig, targetField: FormlyFieldConfig, position: DropPosition) {
    const previousState = structuredClone(this.$fields());
    const fields = [...this.$fields()];

    const { topLevelIndex: targetIndex, groupIndex: targetGroupIndex } = this.#locateField(fields, targetField);

    if (targetIndex === -1 && targetGroupIndex === -1) return;

    if (position === 'top' || position === 'bottom') {
      newField.className = 'col-span-12';
      // When the target is inside a group, insert before/after the entire group row
      const effectiveIndex = targetIndex !== -1 ? targetIndex : targetGroupIndex;
      const insertIndex = position === 'top' ? effectiveIndex : effectiveIndex + 1;
      fields.splice(insertIndex, 0, newField);
      this.$fields.set(fields);
      this.$selectedField.set(newField);
    } else {
      // left / right
      if (targetIndex !== -1) {
        // Target is at top level: create a two-column grid, halving the col-span for both fields
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
      } else {
        // Target is inside an existing group: insert the new field into that group
        const targetGroup = fields[targetGroupIndex];
        const targetInGroupIndex = targetGroup.fieldGroup!.findIndex(f => f === targetField);
        newField.className = targetField.className ?? 'col-span-6';
        const newGroupFields = [...targetGroup.fieldGroup!];
        if (position === 'left') {
          newGroupFields.splice(targetInGroupIndex, 0, newField);
        } else {
          newGroupFields.splice(targetInGroupIndex + 1, 0, newField);
        }
        fields[targetGroupIndex] = { ...targetGroup, fieldGroup: newGroupFields };
      }
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
   * - top/bottom: reorders the source before/after the target (or its parent group), sets source to col-span-12.
   *   If the source is inside a fieldGroup it is first extracted, unwrapping the group when only one field remains.
   * - left/right: removes the source from its current position and adds it beside the target;
   *   if the target is already inside a fieldGroup, the source is inserted into that group instead.
   */
  moveFieldToPosition(sourceField: FormlyFieldConfig, targetField: FormlyFieldConfig, position: DropPosition) {
    if (sourceField === targetField) return;

    const previousState = structuredClone(this.$fields());
    let fields = [...this.$fields()];

    // Locate source – could be at top level or inside a fieldGroup
    const { topLevelIndex: sourceIndex, groupIndex: sourceGroupIndex } = this.#locateField(
      fields,
      sourceField,
    );
    if (sourceIndex === -1 && sourceGroupIndex === -1) return;

    // Locate target – could be at top level or inside a fieldGroup
    const { topLevelIndex: targetIndex, groupIndex: targetGroupIndex } = this.#locateField(
      fields,
      targetField,
    );
    if (targetIndex === -1 && targetGroupIndex === -1) return;

    if (position === 'top' || position === 'bottom') {
      // Extract source from wherever it lives
      if (sourceIndex !== -1) {
        fields.splice(sourceIndex, 1);
      } else {
        fields = this.#extractFromGroup(fields, sourceGroupIndex, sourceField);
      }

      sourceField.className = 'col-span-12';

      // When target was inside a group, treat the whole group row as the effective target
      const { topLevelIndex: newTargetIndex, groupIndex: newTargetGroupIndex } = this.#locateField(
        fields,
        targetField,
      );
      const effectiveTargetIndex = newTargetIndex !== -1 ? newTargetIndex : newTargetGroupIndex;
      if (effectiveTargetIndex === -1) return;

      const insertIndex = position === 'top' ? effectiveTargetIndex : effectiveTargetIndex + 1;
      fields.splice(insertIndex, 0, sourceField);
      this.$fields.set(fields);
      this.$selectedField.set(sourceField);
    } else {
      // left / right: extract source from wherever it lives
      if (sourceIndex !== -1) {
        fields.splice(sourceIndex, 1);
      } else {
        fields = this.#extractFromGroup(fields, sourceGroupIndex, sourceField);
      }
      this.$fields.set(fields);

      const updatedFields = [...this.$fields()];

      if (targetIndex !== -1) {
        // Target is at top level: create a new two-column grid
        const { topLevelIndex: newTargetIndex } = this.#locateField(updatedFields, targetField);
        if (newTargetIndex === -1) return;

        const targetColSpan = this.#getColSpan(targetField);
        const halfSpan = Math.max(1, Math.floor(targetColSpan / 2));
        const spanClass = `col-span-${halfSpan}`;
        targetField.className = spanClass;
        sourceField.className = spanClass;

        const gridField: FormlyFieldConfig = {
          fieldGroupClassName: 'grid grid-cols-12 gap-4',
          fieldGroup: position === 'left' ? [sourceField, targetField] : [targetField, sourceField],
        };
        updatedFields[newTargetIndex] = gridField;
      } else {
        // Target is inside an existing group: insert source into that group
        const { groupIndex: newTargetGroupIndex } = this.#locateField(updatedFields, targetField);
        if (newTargetGroupIndex === -1) return;

        const targetGroup = updatedFields[newTargetGroupIndex];
        const targetInGroupIndex = targetGroup.fieldGroup!.findIndex(f => f === targetField);
        sourceField.className = targetField.className ?? 'col-span-6';
        const newGroupFields = [...targetGroup.fieldGroup!];
        if (position === 'left') {
          newGroupFields.splice(targetInGroupIndex, 0, sourceField);
        } else {
          newGroupFields.splice(targetInGroupIndex + 1, 0, sourceField);
        }
        updatedFields[newTargetGroupIndex] = { ...targetGroup, fieldGroup: newGroupFields };
      }

      this.$fields.set(updatedFields);
      this.$selectedField.set(sourceField);
    }

    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }

  /**
   * Locates a field in the fields array (top-level or inside a fieldGroup).
   * Returns `topLevelIndex` if found directly, or `groupIndex` if found inside a fieldGroup.
   * Exactly one will be ≥ 0 when the field exists; both are -1 if not found.
   */
  #locateField(
    fields: FormlyFieldConfig[],
    field: FormlyFieldConfig,
  ): { topLevelIndex: number; groupIndex: number } {
    const topLevelIndex = fields.findIndex(f => f === field);
    const groupIndex =
      topLevelIndex === -1 ? fields.findIndex(f => f.fieldGroup?.some(g => g === field)) : -1;
    return { topLevelIndex, groupIndex };
  }

  /**
   * Extracts a field from the fieldGroup at `groupIndex`.
   * - If the group becomes empty it is removed entirely.
   * - If one field remains it is unwrapped to top-level with col-span-12.
   * - Otherwise the group is updated in place.
   */
  #extractFromGroup(
    fields: FormlyFieldConfig[],
    groupIndex: number,
    fieldToExtract: FormlyFieldConfig,
  ): FormlyFieldConfig[] {
    const group = fields[groupIndex];
    const remaining = group.fieldGroup!.filter(f => f !== fieldToExtract);

    if (remaining.length === 0) {
      return fields.filter((_, i) => i !== groupIndex);
    } else if (remaining.length === 1) {
      const unwrapped = { ...remaining[0], className: 'col-span-12' };
      return fields.map((f, i) => (i === groupIndex ? unwrapped : f));
    } else {
      return fields.map((f, i) => (i === groupIndex ? { ...group, fieldGroup: remaining } : f));
    }
  }

  /**
   * Removes a field from the fields array, handling nested fieldGroups created by
   * left/right drop positions. When a fieldGroup is left with a single field after
   * removal, that field is unwrapped back to the top level with col-span-12.
   * Clears the selection if the removed field was selected and saves undo state.
   */
  removeField(fieldToRemove: FormlyFieldConfig) {
    const currentFields = this.$fields();

    // Check top-level first
    if (currentFields.some((f) => f === fieldToRemove)) {
      const previousState = structuredClone(currentFields);
      this.$fields.set(currentFields.filter((f) => f !== fieldToRemove));
      this.#finalizeRemoval(fieldToRemove, previousState);
      return;
    }

    // Search inside fieldGroups (created by left/right drops)
    const groupIndex = currentFields.findIndex((f) => f.fieldGroup?.some((g) => g === fieldToRemove));
    if (groupIndex === -1) return; // field not found anywhere — nothing to do

    const previousState = structuredClone(currentFields);
    const group = currentFields[groupIndex];
    const newGroup = group.fieldGroup!.filter((f) => f !== fieldToRemove);

    let updatedFields: FormlyFieldConfig[];
    if (newGroup.length === 0) {
      // Empty group — remove the wrapper entirely
      updatedFields = currentFields.filter((_, i) => i !== groupIndex);
    } else if (newGroup.length === 1) {
      // Only one field left — unwrap it to top-level as full-width
      const remaining = { ...newGroup[0], className: 'col-span-12' };
      updatedFields = currentFields.map((f, i) => (i === groupIndex ? remaining : f));
    } else {
      // Group still has 2+ fields — update in place
      updatedFields = currentFields.map((f, i) =>
        i === groupIndex ? { ...group, fieldGroup: newGroup } : f,
      );
    }

    this.$fields.set(updatedFields);
    this.#finalizeRemoval(fieldToRemove, previousState);
  }

  #finalizeRemoval(removedField: FormlyFieldConfig, previousState: FormlyFieldConfig[]) {
    if (this.$selectedField() === removedField) {
      this.$selectedField.set(null);
    }
    queueMicrotask(() => {
      this.#$undoStack.update((stack) => [...stack, previousState]);
      this.#$redoStack.set([]);
    });
  }

  #getColSpan(field: FormlyFieldConfig): number {
    const match = field.className?.match(/col-span-(\d+)/);
    return match ? parseInt(match[1], 10) : 12;
  }

  /**
   * Recursively ensures every field (and nested fieldGroup fields) has
   * `wrappers: ['field-wrapper']` so drag-and-drop works after import.
   * Existing wrappers are preserved.
   */
  #addWrappersToFields(fields: FormlyFieldConfig[]): FormlyFieldConfig[] {
    return fields.map((field) => ({
      ...field,
      wrappers: field.wrappers ?? ['field-wrapper'],
      ...(field.fieldGroup
        ? { fieldGroup: this.#addWrappersToFields(field.fieldGroup) }
        : {}),
    }));
  }
}
