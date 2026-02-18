import { JsonPipe } from '@angular/common';
import { Component, input, model, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-form-preview',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule, FormlyMaterialModule, JsonPipe, MatCardModule],
  template: `
    <div class="form-preview">
      <h5 class="mb-3">Form Preview</h5>
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
  `,
  styles: [
    `
      .form-preview {
        padding: 1.5rem;
        height: 100%;
        overflow-y: auto;
      }

      .info-message {
        color: #1976d2;
        padding: 1rem;
      }

      pre {
        background-color: #f5f5f5;
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

  form = new FormGroup({});
  $model = signal<Record<string, unknown>>({});
  options = {};

  constructor() {
    // Watch for form value changes
    this.form.valueChanges.subscribe((value) => {
      this.$model.set(value);
    });
  }
}
