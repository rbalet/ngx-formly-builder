import { CdkDrag, CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
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
              (cdkDropListEntered)="onDragEntered()"
              (cdkDropListExited)="onDragExited()"
              [cdkDropListSortPredicate]="shouldAllowSort"
              class="field-list"
              id="form-preview-list"
            >
              @for (field of $fields(); track field.key ?? $index) {
                <div
                  class="field-item"
                  [class.selected]="field === $selectedField()"
                  (click)="onFieldClick(field)"
                  (dragover)="onFieldDragOver($event, field)"
                >
                  <!-- Left drop zone indicator - only show during external drag -->
                  @if ($isDragging()) {
                    <div
                      class="drop-zone drop-zone-left"
                      [class.drop-zone-active]="$hoveredField() === field && $hoveredSide() === 'left'"
                    ></div>
                  }
                  
                  <!-- Right drop zone indicator - only show during external drag -->
                  @if ($isDragging()) {
                    <div
                      class="drop-zone drop-zone-right"
                      [class.drop-zone-active]="$hoveredField() === field && $hoveredSide() === 'right'"
                    ></div>
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

      .drop-zone {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 50%;
        z-index: 10;
        pointer-events: none;
        transition: background-color 0.2s ease;
      }

      .drop-zone-left {
        left: 0;
        border-left: 3px solid transparent;
      }

      .drop-zone-right {
        right: 0;
        border-right: 3px solid transparent;
      }

      .drop-zone-active {
        background-color: rgba(var(--md-sys-color-primary-rgb, 103, 80, 164), 0.1);
      }

      .drop-zone-left.drop-zone-active {
        border-left-color: var(--md-sys-color-primary);
      }

      .drop-zone-right.drop-zone-active {
        border-right-color: var(--md-sys-color-primary);
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
  fieldDroppedBeside = output<{ fieldType: string; targetField: FormlyFieldConfig; side: 'left' | 'right' }>();

  form = new FormGroup({});
  $model = signal<Record<string, unknown>>({});
  options = {};

  // Track which field and which side (left/right) is being hovered during drag
  $hoveredField = signal<FormlyFieldConfig | null>(null);
  $hoveredSide = signal<'left' | 'right' | null>(null);
  $isDragging = signal<boolean>(false);

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
      
      // Check if we're hovering over a drop zone (left or right side of a field)
      const hoveredField = this.$hoveredField();
      const hoveredSide = this.$hoveredSide();
      
      if (hoveredField && hoveredSide) {
        // Drop beside an existing field to create two-column layout
        this.fieldDroppedBeside.emit({
          fieldType: fieldType,
          targetField: hoveredField,
          side: hoveredSide,
        });
      } else {
        // Regular drop at a specific index
        this.fieldDropped.emit({
          fieldType: fieldType,
          index: event.currentIndex,
        });
      }
    } else {
      // Internal reordering
      if (event.previousIndex !== event.currentIndex) {
        this.fieldsReordered.emit({
          previousIndex: event.previousIndex,
          currentIndex: event.currentIndex,
        });
      }
    }
    
    // Clear drag state after drop
    this.$isDragging.set(false);
    this.$hoveredField.set(null);
    this.$hoveredSide.set(null);
  }

  onFieldClick(field: FormlyFieldConfig) {
    this.$selectedField.set(field);
  }

  onFieldDragOver(event: DragEvent, field: FormlyFieldConfig) {
    // Only handle dragover during external drag operations
    if (!this.$isDragging()) {
      return;
    }
    
    event.preventDefault(); // Allow drop
    
    // Determine which side of the field we're hovering over
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const midpoint = rect.width / 2;
    
    const side = x < midpoint ? 'left' : 'right';
    
    // Only update if changed to minimize re-renders
    if (this.$hoveredField() !== field || this.$hoveredSide() !== side) {
      // Defer updates to avoid ExpressionChangedAfterItHasBeenCheckedError
      queueMicrotask(() => {
        this.$hoveredField.set(field);
        this.$hoveredSide.set(side);
      });
    }
  }

  onDragEntered() {
    this.$isDragging.set(true);
  }

  onDragExited() {
    this.$isDragging.set(false);
    this.$hoveredField.set(null);
    this.$hoveredSide.set(null);
  }

  // Controls whether CDK should allow automatic sorting/reordering
  shouldAllowSort = (): boolean => {
    // Don't allow CDK sorting when hovering over a drop zone
    // This prevents automatic "insert at index" behavior and lets drop zones handle the drop
    return this.$hoveredField() === null;
  };
}
