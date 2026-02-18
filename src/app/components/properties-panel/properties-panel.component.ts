import { Component, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="properties-panel">
      <h5 class="mb-3">Field Properties</h5>
      @if (selectedField()) {
        <div class="card">
          <div class="card-body">
            <pre class="mb-0"><code>{{ selectedField() | json }}</code></pre>
          </div>
        </div>
      } @else {
        <div class="alert alert-info">Select a field from the palette to add it to the form.</div>
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
      }

      pre {
        background-color: #ffffff;
        padding: 1rem;
        border-radius: 0.25rem;
        max-height: 500px;
        overflow-y: auto;
      }
    `,
  ],
})
export class PropertiesPanelComponent {
  selectedField = input<FormlyFieldConfig | null>(null);
}
