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
              (cdkDropListEntered)="onDragEnter()"
              (cdkDropListExited)="onDragLeave()"
              (dragover)="onDropListDragOver($event)"
              class="field-list"
              id="form-preview-list"
            >
              @for (field of $fields(); track field.key ?? $index; let i = $index) {
                <div
                  class="field-item"
                  [class.selected]="field === $selectedField()"
                  (click)="onFieldClick(field)"
                  (dragover)="onFieldDragOver($event, i)"
                >
                  <!-- Drop zone overlays -->
                  @if ($isDraggingExternal() && $hoveredFieldIndex() === i) {
                    <div class="drop-zone-container">
                      @if ($dropPosition() === 'left') {
                        <div class="drop-zone drop-zone-left"></div>
                      }
                      @if ($dropPosition() === 'right') {
                        <div class="drop-zone drop-zone-right"></div>
                      }
                      @if ($dropPosition() === 'full') {
                        <div class="drop-zone drop-zone-full"></div>
                      }
                    </div>
                  }
                  
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
        gap: 1.4rem;
      }

      .field-item {
        position: relative;
      }

      .drop-zone-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 10;
      }

      .drop-zone {
        position: absolute;
        background-color: var(--mat-sys-primary-container);
        border: 2px dashed var(--mat-sys-primary);
        border-radius: 4px;
        opacity: 0.5;
        transition: opacity 0.2s;
      }

      .drop-zone-full {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .drop-zone-left {
        top: 0;
        left: 0;
        width: 50%;
        bottom: 0;
      }

      .drop-zone-right {
        top: 0;
        right: 0;
        width: 50%;
        bottom: 0;
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
  fieldDropped = output<{ fieldType: string; index: number; position?: 'left' | 'right' | 'full'; targetField?: FormlyFieldConfig }>();

  form = new FormGroup({});
  $model = signal<Record<string, unknown>>({});
  options = {};

  // Drag-and-drop state (protected for template access)
  protected $isDraggingExternal = signal(false);
  protected $hoveredFieldIndex = signal<number | null>(null);
  protected $dropPosition = signal<'left' | 'right' | 'full'>('full');

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
    // Check if this is an external drop from the palette
    if (event.previousContainer !== event.container) {
      // External drop from field palette
      const fieldType = event.item.data as string;
      const dropIndex = event.currentIndex;
      const fields = this.$fields();
      
      // Determine if we're dropping beside a field
      const targetField = fields[dropIndex];
      const position = this.$dropPosition();
      
      this.fieldDropped.emit({
        fieldType: fieldType,
        index: dropIndex,
        position: position,
        targetField: targetField,
      });
      
      // Reset drag state
      this.$isDraggingExternal.set(false);
      this.$hoveredFieldIndex.set(null);
      this.$dropPosition.set('full');
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

  onDragEnter() {
    this.$isDraggingExternal.set(true);
  }

  onDragLeave() {
    this.$isDraggingExternal.set(false);
    this.$hoveredFieldIndex.set(null);
  }

  onDropListDragOver(event: DragEvent) {
    // This handles dragging over empty space in the drop list
    // Only reset if not over a field-item
    const target = event.target as HTMLElement;
    if (target.classList.contains('field-list')) {
      event.preventDefault();
      queueMicrotask(() => {
        this.$hoveredFieldIndex.set(null);
        this.$dropPosition.set('full');
      });
    }
  }

  onFieldDragOver(event: DragEvent, fieldIndex: number) {
    event.preventDefault();
    
    const fields = this.$fields();
    if (fieldIndex >= fields.length) {
      // Dropping at the end - full width
      queueMicrotask(() => {
        this.$hoveredFieldIndex.set(fieldIndex);
        this.$dropPosition.set('full');
      });
      return;
    }

    // Calculate drop position based on pointer x-coordinate
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const threshold = rect.width * 0.5;

    queueMicrotask(() => {
      this.$hoveredFieldIndex.set(fieldIndex);
      this.$dropPosition.set(relativeX < threshold ? 'left' : 'right');
    });
  }

  onFieldClick(field: FormlyFieldConfig) {
    this.$selectedField.set(field);
  }
}
