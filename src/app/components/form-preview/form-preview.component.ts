import { JsonPipe } from '@angular/common';
import { Component, computed, input, model, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ScreenSize } from '../../core/type';

@Component({
  selector: 'app-form-preview',
  imports: [ReactiveFormsModule, FormlyModule, FormlyMaterialModule, JsonPipe, MatCardModule],
  template: `
    <div class="form-preview">
      <h5 class="mb-3">Form Preview</h5>
      <div [class]="previewContainerClass()">
        <form [formGroup]="form" class="mb-4">
          <formly-form
            [model]="$model()"
            [fields]="$fields()"
            [options]="options"
            [form]="form"
          ></formly-form>
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
        color: #1976d2;
        padding: 1rem;
      }

      pre {
        padding: 1rem;
        border-radius: 0.25rem;
        max-height: 300px;
        overflow-y: auto;
      }
    `,
  ],
})
export class FormPreviewComponent {
  $fields = input.required<FormlyFieldConfig[]>();
  $selectedField = model.required<FormlyFieldConfig | null>();
  $screenSize = input<ScreenSize>('lg');

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
}
