import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input, model, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PREVIEW_MODE } from '@core/token';
import { ScreenSize } from '@core/type';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

@Component({
  selector: 'app-form-preview',
  imports: [
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    JsonPipe,
    MatCardModule,
    MatIconModule,
    DragDropModule,
  ],
  template: `
    <div class="form-preview">
      <div [class]="previewContainerClass()">
        <form [formGroup]="form" class="mb-4">
          @if (!$previewMode()) {
            <div cdkDropList (cdkDropListDropped)="onDrop($event)" class="field-list">
              @for (field of $fields(); track field.key) {
                <div
                  cdkDrag
                  class="field-item"
                  [class.selected]="field === $selectedField()"
                  (click)="onFieldClick(field)"
                >
                  <div class="field-content">
                    <div class="drag-handle" cdkDragHandle>
                      <mat-icon>drag_indicator</mat-icon>
                    </div>
                    <div class="field-wrapper">
                      <formly-form
                        [model]="$model()"
                        [fields]="[field]"
                        [options]="options"
                        [form]="form"
                      ></formly-form>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <formly-form
              [model]="$model()"
              [fields]="$fields()"
              [options]="options"
              [form]="form"
            ></formly-form>
          }
        </form>

        @if (!$fields().length) {
          <mat-card>
            <mat-card-content class="info-message">
              Please add a new component here
            </mat-card-content>
          </mat-card>
        } @else {
          <mat-card>
            <mat-card-header>
              <mat-card-title>Model JSON</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <pre class="mb-0"><code>{{ $model() | json }}</code></pre>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .form-preview {
        margin-top: 1rem;
        padding: 1.5rem;
        height: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }

      .preview-container {
        transition: max-width 0.3s ease-in-out;
        margin: 0 auto;
        width: 100%;
      }

      .preview-container.size-sm {
        max-width: 375px;
      }

      .preview-container.size-md {
        max-width: 768px;
      }

      .preview-container.size-lg {
        max-width: 100%;
      }

      .info-message {
        padding: 1rem;
      }

      pre {
        padding: 1rem;
        border-radius: 0.25rem;
        max-height: 300px;
        overflow-y: auto;
      }

      .field-list {
        min-height: 50px;
      }

      .field-item {
        position: relative;
        margin-bottom: 1rem;
        border: 2px solid transparent;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .field-item:hover {
        border-color: #e0e0e0;
        background-color: #fafafa;
      }

      .field-item.selected {
        border-color: var(--md-sys-color-primary);
        background-color: var(--md-sys-color-primary-container);
      }

      .field-item.cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .field-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
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

      .field-item:hover .drag-handle {
        opacity: 1;
      }

      .drag-handle mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .field-wrapper {
        flex: 1;
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
export class FormPreviewComponent {
  $fields = input.required<FormlyFieldConfig[]>();
  $selectedField = model.required<FormlyFieldConfig | null>();
  $screenSize = input<ScreenSize>('lg');
  $previewMode = inject(PREVIEW_MODE);

  fieldsReordered = output<{ previousIndex: number; currentIndex: number }>();

  form = new FormGroup({});
  $model = signal<Record<string, unknown>>({});
  options = {};

  previewContainerClass = computed(() => {
    return `preview-container size-${this.$screenSize()}`;
  });

  constructor() {
    // Watch for form value changes
    this.form.valueChanges.subscribe((value) => {
      this.$model.set(value);
    });
  }

  onDrop(event: CdkDragDrop<FormlyFieldConfig[]>) {
    if (event.previousIndex !== event.currentIndex) {
      this.fieldsReordered.emit({
        previousIndex: event.previousIndex,
        currentIndex: event.currentIndex,
      });
    }
  }

  onFieldClick(field: FormlyFieldConfig) {
    this.$selectedField.set(field);
  }
}
