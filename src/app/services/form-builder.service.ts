import { computed, Injectable, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  $fields = signal<FormlyFieldConfig[]>([]);
  $selectedField = signal<FormlyFieldConfig | null>(null);

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
}
