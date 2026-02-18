import { Component, inject } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { App } from '../app';

@Component({
  selector: 'formly-wrapper-field',
  standalone: true,
  template: `
    <div class="field-wrapper" [class.selected]="isSelected()" (click)="onFieldClick($event)">
      <div class="field-header">
        <span class="field-type">{{ getFieldType() }}</span>
        <button
          type="button"
          class="btn-close"
          aria-label="Remove field"
          (click)="onRemove($event)"
        ></button>
      </div>
      <ng-container #fieldComponent></ng-container>
    </div>
  `,
  styles: [
    `
      .field-wrapper {
        position: relative;
        padding: 0.25rem;
        margin-bottom: 1rem;
        border: 2px solid transparent;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .field-wrapper {
        &:hover {
          border-color: #adb5bd;
          .field-type {
            opacity: 0.5;
          }

          .btn-close {
            opacity: 0.5;

            &:hover {
              opacity: 1;
            }
          }
        }

        &.selected {
          border-color: #0d6efd;
          background-color: rgba(13, 110, 253, 0.05);
          .field-type {
            opacity: 1;
          }

          .btn-close {
            opacity: 0.5;

            &:hover {
              opacity: 1;
            }
          }
        }
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

      .btn-close {
        padding: 0.25rem;
        font-size: 0.75rem;
        opacity: 0;
      }
    `,
  ],
})
export class FieldWrapperComponent extends FieldWrapper {
  private app = inject(App);

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
