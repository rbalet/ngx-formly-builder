import { Component, input, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-form-preview',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule, FormlyBootstrapModule, JsonPipe],
  template: `
    <div class="form-preview">
      <h5 class="mb-3">Form Preview</h5>
      <form [formGroup]="form" class="mb-4">
        <formly-form
          [model]="model()"
          [fields]="fields()"
          [options]="options"
          [form]="form"
        ></formly-form>
      </form>

      <div class="card">
        <div class="card-header">
          <strong>Model JSON</strong>
        </div>
        <div class="card-body">
          <pre class="mb-0"><code>{{ model() | json }}</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .form-preview {
        padding: 1.5rem;
        height: 100%;
        overflow-y: auto;
      }

      pre {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.25rem;
        max-height: 300px;
        overflow-y: auto;
      }
    `,
  ],
})
export class FormPreviewComponent {
  fields = input.required<FormlyFieldConfig[]>();

  form = new FormGroup({});
  model = signal<Record<string, unknown>>({});
  options = {};

  constructor() {
    // Watch for form value changes
    effect(() => {
      this.form.valueChanges.subscribe((value) => {
        this.model.set(value);
      });
    });
  }
}
