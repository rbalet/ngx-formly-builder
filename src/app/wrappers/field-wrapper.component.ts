import { Component, inject } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldWrapper } from '@ngx-formly/core';
import { PREVIEW_MODE } from '@core/token';
import { App } from '../app';

@Component({
  selector: 'formly-wrapper-field',
  imports: [MatIconModule, MatButtonModule, DragDropModule],
  template: `
    <div
      cdkDrag
      class="field-wrapper"
      [class.selected]="isSelected()"
      (click)="onFieldClick($event)"
    >
      @if (!$previewMode()) {
        <div class="drag-handle" cdkDragHandle>
          <mat-icon>drag_indicator</mat-icon>
        </div>
      }
      <div class="field-content">
        <div class="field-header">
          <span class="field-type">{{ getFieldType() }}</span>
          <button mat-icon-button type="button" aria-label="Remove field" (click)="onRemove($event)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <ng-container #fieldComponent></ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .field-wrapper {
        position: relative;
        padding: 0.25rem;
        border: 2px solid transparent;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .field-wrapper:hover {
        border-color: #adb5bd;
      }

      .field-wrapper:hover .field-type {
        opacity: 0.5;
      }

      .field-wrapper:hover button {
        opacity: 0.5;
      }

      .field-wrapper:hover button:hover {
        opacity: 1;
      }

      .field-wrapper.selected {
        border-color: var(--md-sys-color-primary);
        background-color: var(--md-sys-color-primary-container);
      }

      .field-wrapper.selected .field-type {
        opacity: 1;
      }

      .field-wrapper.selected button {
        opacity: 0.5;
      }

      .field-wrapper.selected button:hover {
        opacity: 1;
      }

      .field-wrapper.cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .drag-handle {
        cursor: move;
        display: flex;
        align-items: center;
        padding: 0.5rem;
        color: #666;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .field-wrapper:hover .drag-handle {
        opacity: 1;
      }

      .drag-handle mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .field-content {
        flex: 1;
        position: relative;
      }

      .field-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: transparent;
        transform: translateY(-100%);
      }

      .field-type {
        font-size: 0.75rem;
        color: #6c757d;
        font-weight: 500;
        opacity: 0;
      }

      button {
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      button mat-icon {
        font-size: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
        line-height: 1.2rem;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow:
          0 5px 5px -3px rgba(0, 0, 0, 0.2),
          0 8px 10px 1px rgba(0, 0, 0, 0.14),
          0 3px 14px 2px rgba(0, 0, 0, 0.12);
        opacity: 0.8;
      }
    `,
  ],
})
export class FieldWrapperComponent extends FieldWrapper {
  private app = inject(App);
  readonly $previewMode = inject(PREVIEW_MODE);

  isSelected(): boolean {
    const selectedField = this.app.$selectedField();
    return selectedField === this.field;
  }

  getFieldType(): string {
    if (!this.field.type) {
      return 'field';
    }

    // For input fields with specific types, show the input type
    if (this.field.type === 'input' && this.field.props?.['type']) {
      const inputType = this.field.props['type'];
      return inputType === 'tel' ? 'telephone' : inputType;
    }

    // Handle both string and component types
    return typeof this.field.type === 'string' ? this.field.type : 'custom';
  }

  onFieldClick(_event: MouseEvent): void {
    // Update selected field when clicking on the wrapper
    this.app.$selectedField.set(this.field);
  }

  onRemove(event: MouseEvent): void {
    event.stopPropagation();

    // Remove this field from the fields array
    this.app.$fields.update((fields) => {
      const filtered = fields.filter((f) => f !== this.field);

      // If the removed field was selected, clear selection
      if (this.isSelected()) {
        this.app.$selectedField.set(null);
      }

      return filtered;
    });
  }
}
