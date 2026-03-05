import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';
import { PREVIEW_MODE } from '../core/token';
import { DropPosition, FormBuilderService } from '../services/form-builder.service';

@Component({
  selector: 'formly-wrapper-field',
  imports: [MatIconModule, MatIconButton, MatButtonModule, DragDropModule],
  template: `
    @if (!$previewMode()) {
      <div
        cdkDropList
        [cdkDropListData]="field"
        [cdkDropListSortingDisabled]="true"
        (cdkDropListDropped)="onDrop($event)"
        (cdkDropListEntered)="onDragEnter()"
        (cdkDropListExited)="onDragExit()"
        (pointermove)="onPointerMove($event)"
        class="field-drop-zone"
        [class.drag-over]="$isDragOver()"
      >
        @if ($isDragOver() && $dropPosition()) {
          <div class="drop-indicator" [class]="'drop-indicator--' + $dropPosition()"></div>
        }
        <div
          cdkDrag
          [cdkDragData]="field"
          class="field-wrapper"
          [class.selected]="isSelected()"
          [class.dimmed]="isDimmed()"
          (click)="onFieldClick($event)"
        >
          <div class="field-content">
            <div class="field-header">
              <div class="field-type-container">
                <button matIconButton class="drag-handle" cdkDragHandle>
                  <mat-icon>drag_indicator</mat-icon>
                </button>
                {{ getFieldType() }}
              </div>
              <button
                mat-icon-button
                class="close-button"
                type="button"
                aria-label="Remove field"
                (click)="onRemove($event)"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <ng-container #fieldComponent></ng-container>
          </div>
        </div>
      </div>
    } @else {
      <div
        class="field-wrapper"
        [class.selected]="isSelected()"
        [class.dimmed]="isDimmed()"
        (click)="onFieldClick($event)"
      >
        <div class="field-content">
          <ng-container #fieldComponent></ng-container>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .field-drop-zone {
        position: relative;
      }

      .drop-indicator {
        position: absolute;
        background-color: var(--mat-sys-on-surface);
        z-index: 10;
        pointer-events: none;
        border-radius: 2px;

        &.drop-indicator--top {
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        &.drop-indicator--bottom {
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        &.drop-indicator--left {
          top: 0;
          left: 0;
          bottom: 0;
          width: 3px;
        }

        &.drop-indicator--right {
          top: 0;
          right: 0;
          bottom: 0;
          width: 3px;
        }
      }

      .field-wrapper {
        --mat-icon-button-container-shape: 8px 8px 0 0;
        position: relative;
        padding: 0.25rem;
        border: 2px solid transparent;
        border-radius: 0.25rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;

        &:hover {
          border-color: #adb5bd;

          .field-type-container {
            opacity: 0.5;
          }

          button {
            opacity: 0.5;

            &:hover {
              opacity: 1;
            }
          }

          .drag-handle {
            opacity: 1;
          }
        }

        &.selected {
          border-color: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-primary-container);

          .field-type-container {
            opacity: 1;
          }

          button {
            opacity: 0.5;

            &:hover {
              opacity: 1;
            }
          }

          .drag-handle {
            opacity: 1;
          }
        }

        &.dimmed {
          opacity: 0.3;
          transition: opacity 0.2s ease;

          &:hover {
            opacity: 0.6;
          }
        }
        .cdk-drag-animating {
          transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
        }
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

      .field-content {
        flex: 1;
        position: relative;
      }

      .field-header {
        position: absolute;
        top: 0;
        left: -0.25rem;
        right: -0.25rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transform: translateY(-100%);
        border-radius: 0.25rem 0.25rem 0 0;
      }

      .field-type-container {
        font-size: 0.75rem;
        color: var(--md-sys-color-on-surface);
        font-weight: 500;
        opacity: 0;
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        background-color: var(--mat-sys-on-surface);
        color: var(--mat-sys-surface);
        padding-right: 1rem;
        border-radius: var(--mat-icon-button-container-shape);
        opacity: 0;
      }

      .close-button {
        margin-bottom: 6px;
        background-color: var(--mat-sys-on-surface);
        color: var(--mat-sys-surface);
      }

      button {
        opacity: 0;
        transition: opacity 0.2s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2rem;

        mat-icon {
          font-size: 1rem;
          width: 1rem;
          height: 1rem;
          line-height: 1rem;
        }
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
  private formBuilderService = inject(FormBuilderService);
  readonly $previewMode = inject(PREVIEW_MODE);

  readonly $isDragOver = signal(false);
  readonly $dropPosition = signal<DropPosition | null>(null);

  isSelected(): boolean {
    const selectedField = this.formBuilderService.$selectedField();
    return selectedField === this.field;
  }

  isDimmed(): boolean {
    const selectedField = this.formBuilderService.$selectedField();
    // Dimmed if there is a selected field and this is not it
    return selectedField !== null && selectedField !== this.field;
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
    this.formBuilderService.$selectedField.set(this.field);
  }

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.formBuilderService.removeField(this.field);
  }

  onDragEnter(): void {
    this.$isDragOver.set(true);
  }

  onDragExit(): void {
    this.$isDragOver.set(false);
    this.$dropPosition.set(null);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.$isDragOver()) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;

    let position: DropPosition;
    if (relY < 0.25) {
      position = 'top';
    } else if (relY > 0.75) {
      position = 'bottom';
    } else if (relX < 0.5) {
      position = 'left';
    } else {
      position = 'right';
    }

    queueMicrotask(() => this.$dropPosition.set(position));
  }

  onDrop(event: CdkDragDrop<FormlyFieldConfig>): void {
    const position = this.$dropPosition() ?? 'bottom';
    this.$isDragOver.set(false);
    this.$dropPosition.set(null);

    // Determine if this is a palette drop (data is a field type string) or a field move
    const isFromPalette = typeof event.item.data === 'string';

    if (isFromPalette) {
      const fieldType = event.item.data as string;
      const newField = this.formBuilderService.createField(fieldType);
      this.formBuilderService.dropNewFieldAtPosition(newField, this.field, position);
    } else {
      const sourceField = event.item.data as FormlyFieldConfig;
      if (sourceField !== this.field) {
        this.formBuilderService.moveFieldToPosition(sourceField, this.field, position);
      }
    }
  }
}
