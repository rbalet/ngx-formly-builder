import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input, model, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { PREVIEW_MODE } from '../../core/token';
import { ScreenSize } from '../../core/type';

@Component({
  selector: 'formly-builder-form-preview',
  imports: [
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    JsonPipe,
    MatCardModule,
    DragDropModule,
  ],
  template: `
    <div class="form-preview">
      <div [class]="previewContainerClass()">
        <form [formGroup]="form" class="mb-4">
          @if (!$previewMode()) {
            <div
              cdkDropList
              (cdkDropListDropped)="onDrop($event)"
              class="field-list grid grid-cols-12 gap-4"
              id="form-preview-list"
            >
              @for (field of $fields(); track field.key) {
                <div
                  [class]="getFieldItemClass(field)"
                  (click)="onFieldClick(field)"
                >
                  <formly-form
                    [model]="$model()"
                    [fields]="[field]"
                    [options]="options"
                    [form]="form"
                  ></formly-form>
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
    `,
  ],
})
export class FormPreviewComponent {
  $fields = input.required<FormlyFieldConfig[]>();
  $selectedField = model.required<FormlyFieldConfig | null>();
  $screenSize = input<ScreenSize>('lg');
  $previewMode = inject(PREVIEW_MODE);

  fieldsReordered = output<{ previousIndex: number; currentIndex: number }>();
  fieldDropped = output<{ fieldType: string; index: number }>();

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
      // Split className into individual classes
      const fieldClasses = field.className.split(' ').filter(c => c.trim());
      
      // Check if any class is a col-span-* class
      const hasColSpan = fieldClasses.some(c => c.match(/col-span-\d+/));
      
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

  onDrop(event: CdkDragDrop<FormlyFieldConfig[]>) {
    // Check if this is an external drop from the palette
    if (event.previousContainer !== event.container) {
      // External drop from field palette
      const fieldType = event.item.data as string;
      this.fieldDropped.emit({
        fieldType: fieldType,
        index: event.currentIndex,
      });
    } else {
      // Internal reordering
      if (event.previousIndex !== event.currentIndex) {
        this.fieldsReordered.emit({
          previousIndex: event.previousIndex,
          currentIndex: event.currentIndex,
        });
      }
    }
  }

  onFieldClick(field: FormlyFieldConfig) {
    this.$selectedField.set(field);
  }
}
