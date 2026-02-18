import { JsonPipe } from '@angular/common';
import { Component, input, model, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-form-preview',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule, FormlyBootstrapModule, JsonPipe],
  template: `
    <div class="form-preview">
      <h5 class="mb-3 text-base font-semibold">Form Preview</h5>
      <form [formGroup]="form" class="mb-4">
        <formly-form
          [model]="$model()"
          [fields]="$fields()"
          [options]="options"
          [form]="form"
        ></formly-form>
      </form>

      @if (!$fields().length) {
        <div class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">Please add a new component here</div>
      } @else {
        <div class="border border-gray-200 rounded overflow-hidden">
          <div class="bg-gray-50 border-b border-gray-200 px-4 py-2">
            <strong>Model JSON</strong>
          </div>
          <div class="p-4">
            <pre class="mb-0"><code>{{ $model() | json }}</code></pre>
          </div>
        </div>
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

      pre {
        background-color: #f9fafb;
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
