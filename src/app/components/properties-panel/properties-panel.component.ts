import { JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [JsonPipe, FormsModule],
  template: `
    <div class="properties-panel">
      <h5 class="mb-3 text-base font-semibold">Field Properties</h5>
      @if ($selectedField()) {
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-2">Label</label>
          <input
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [ngModel]="getLabel()"
            (ngModelChange)="updateLabel($event)"
          />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
          <input
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [ngModel]="getPlaceholder()"
            (ngModelChange)="updatePlaceholder($event)"
          />
        </div>
        <hr class="my-4 border-gray-200" />
        <div class="border border-gray-200 rounded overflow-hidden">
          <div class="bg-gray-50 border-b border-gray-200 px-4 py-2">
            <small class="text-gray-500">Debug: Field Config</small>
          </div>
          <div class="p-4">
            <pre class="mb-0"><code>{{ $selectedField() | json }}</code></pre>
          </div>
        </div>
      } @else {
        <div class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">Select a component to configure its properties</div>
      }
    </div>
  `,
  styles: [
    `
      .properties-panel {
        padding: 1rem;
        height: 100%;
        background-color: #f9fafb;
        border-left: 1px solid #e5e7eb;
        overflow-y: auto;
      }

      pre {
        background-color: #ffffff;
        padding: 1rem;
        border-radius: 0.25rem;
        max-height: 300px;
        overflow-y: auto;
      }
    `,
  ],
})
export class PropertiesPanelComponent {
  $selectedField = input<FormlyFieldConfig | null>(null);
  fieldUpdated = output<void>();

  getLabel(): string {
    const field = this.$selectedField();
    if (!field || !field.props) {
      return '';
    }
    return field.props.label || '';
  }

  getPlaceholder(): string {
    const field = this.$selectedField();
    if (!field || !field.props) {
      return '';
    }
    return field.props.placeholder || '';
  }

  updateLabel(value: string) {
    const field = this.$selectedField();
    if (field) {
      if (!field.props) {
        field.props = {};
      }
      field.props.label = value;
      this.fieldUpdated.emit();
    }
  }

  updatePlaceholder(value: string) {
    const field = this.$selectedField();
    if (field) {
      if (!field.props) {
        field.props = {};
      }
      field.props.placeholder = value;
      this.fieldUpdated.emit();
    }
  }
}
