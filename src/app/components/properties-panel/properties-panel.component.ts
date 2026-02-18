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
      <h5 class="mb-3">Field Properties</h5>
      @if ($selectedField()) {
        <div class="mb-3">
          <label class="form-label">Label</label>
          <input
            type="text"
            class="form-control"
            [ngModel]="getLabel()"
            (ngModelChange)="updateLabel($event)"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Placeholder</label>
          <input
            type="text"
            class="form-control"
            [ngModel]="getPlaceholder()"
            (ngModelChange)="updatePlaceholder($event)"
          />
        </div>
        <hr />
        <div class="card">
          <div class="card-header">
            <small class="text-muted">Debug: Field Config</small>
          </div>
          <div class="card-body">
            <pre class="mb-0"><code>{{ $selectedField() | json }}</code></pre>
          </div>
        </div>
      } @else {
        <div class="alert alert-info">Select a component to configure its properties</div>
      }
    </div>
  `,
  styles: [
    `
      .properties-panel {
        padding: 1rem;
        height: 100%;
        background-color: #f8f9fa;
        border-left: 1px solid #dee2e6;
        overflow-y: auto;
      }

      pre {
        background-color: #ffffff;
        padding: 1rem;
        border-radius: 0.25rem;
        max-height: 300px;
        overflow-y: auto;
      }

      .form-label {
        font-weight: 500;
        margin-bottom: 0.5rem;
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
