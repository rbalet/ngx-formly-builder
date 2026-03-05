import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input, model, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { DEBUG_MODE, PREVIEW_MODE } from '../../core/token';
import { ScreenSize } from '../../core/type';
import { FormBuilderService } from '../../services/form-builder.service';
import { QuickStartComponent } from '../quick-start/quick-start.component';

@Component({
  selector: 'formly-builder-form-preview',
  imports: [
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    JsonPipe,
    MatCardModule,
    MatIconModule,
    DragDropModule,
    QuickStartComponent,
  ],
  template: `
    <div class="form-preview">
      <div [class]="previewContainerClass()">
        <form [formGroup]="form" class="mb-4">
          @if (!$previewMode()) {
            <div class="field-list grid grid-cols-12 gap-4">
              @for (field of $fields(); track field.key ?? $index) {
                <div [class]="getFieldItemClass(field)" (click)="onFieldClick(field)">
                  <formly-form
                    [model]="$model()"
                    [fields]="[field]"
                    [options]="options"
                    [form]="form"
                  ></formly-form>
                </div>
              }
              @if (!$fields().length) {
                <div
                  cdkDropList
                  (cdkDropListDropped)="onEmptyDrop($event)"
                  class="empty-drop-zone col-span-12"
                >
                  <div class="empty-hint">
                    <mat-icon class="empty-hint-icon">drag_indicator</mat-icon>
                    <p class="empty-hint-text">
                      <span>Drag &amp; drop a field here</span>
                      <span>or click a field in the palette</span>
                    </p>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="field-list grid grid-cols-12 gap-4">
              <formly-form
                [model]="$model()"
                [fields]="$fields()"
                [options]="options"
                [form]="form"
              ></formly-form>
            </div>
          }
        </form>

        @if (!$fields().length) {
          <formly-builder-quick-start
            (templateSelected)="onTemplateSelected($event)"
          ></formly-builder-quick-start>
        } @else if ($debugMode()) {
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
        max-width: 1074px;
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
        background: var(--mat-sys-surface-container-low);
        border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));
        border: 1px solid var(--mat-sys-outline-variant);
        padding: 1rem;
      }

      .field-item {
        position: relative;
      }

      .empty-drop-zone {
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed var(--mat-sys-outline-variant);
        border-radius: var(--mat-sys-corner-medium);
        transition: border-color 0.2s ease;

        &:hover {
          border-color: var(--mat-sys-primary);
        }
      }

      .empty-hint {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        pointer-events: none;
      }

      .empty-hint-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        color: var(--mat-sys-on-surface-variant);
        opacity: 0.6;
      }

      .empty-hint-text {
        margin: 0;
        font-size: 0.875rem;
        color: var(--mat-sys-on-surface-variant);
        text-align: center;
        line-height: 1.5;
        opacity: 0.8;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class FormPreviewComponent {
  readonly $debugMode = inject(DEBUG_MODE);
  readonly #formBuilderService = inject(FormBuilderService);

  $fields = input.required<FormlyFieldConfig[]>();
  $selectedField = model.required<FormlyFieldConfig | null>();
  $screenSize = input<ScreenSize>('lg');
  $previewMode = inject(PREVIEW_MODE);

  templateSelected = output<string>();

  form = new FormGroup({});
  $model = signal<Record<string, unknown>>({});
  options = {};

  previewContainerClass = computed(() => {
    return `preview-container size-${this.$screenSize()}`;
  });

  getFieldItemClass(field: FormlyFieldConfig): string {
    const classes = ['field-item'];

    // Add selected class if this is the selected field
    if (field === this.$selectedField()) {
      classes.push('selected');
    }

    // Check if field has a className property
    if (field.className) {
      // Split className into individual classes, filtering out empty strings
      const fieldClasses = field.className.split(' ').filter((cls) => cls.trim() !== '');

      // Check if any class is a col-span-* class
      const hasColSpan = fieldClasses.some((cls) => cls.match(/col-span-\d+/));

      // Add all field classes
      classes.push(...fieldClasses);

      // If no col-span class found, add default
      if (!hasColSpan) {
        classes.push('col-span-12');
      }
    } else {
      // No className at all - add default
      classes.push('col-span-12');
    }

    return classes.join(' ');
  }

  constructor() {
    // Watch for form value changes
    this.form.valueChanges.subscribe((value) => {
      this.$model.set(value);
    });
  }

  /** Handles drops onto the empty-form fallback drop zone (first field from palette). */
  onEmptyDrop(event: CdkDragDrop<FormlyFieldConfig[]>) {
    const fieldType = event.item.data as string;
    if (typeof fieldType === 'string') {
      const newField = this.#formBuilderService.createField(fieldType);
      this.#formBuilderService.addField(newField);
      this.#formBuilderService.$selectedField.set(newField);
    }
  }

  onFieldClick(field: FormlyFieldConfig) {
    this.$selectedField.set(field);
  }

  onTemplateSelected(templateId: string) {
    this.templateSelected.emit(templateId);
  }
}
