import { JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-properties-panel',
  imports: [JsonPipe, FormsModule, MatCardModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="properties-panel">
      <h5 class="mb-3">Field Properties</h5>
      @if ($selectedField()) {
        <mat-form-field class="full-width mb-3">
          <mat-label>Label</mat-label>
          <input
            matInput
            type="text"
            [ngModel]="getLabel()"
            (ngModelChange)="updateLabel($event)"
          />
        </mat-form-field>
        <mat-form-field class="full-width mb-3">
          <mat-label>Placeholder</mat-label>
          <input
            matInput
            type="text"
            [ngModel]="getPlaceholder()"
            (ngModelChange)="updatePlaceholder($event)"
          />
        </mat-form-field>
        <mat-form-field class="full-width mb-3">
          <mat-label>Description</mat-label>
          <input
            matInput
            type="text"
            [ngModel]="getDescription()"
            (ngModelChange)="updateDescription($event)"
          />
        </mat-form-field>
        <mat-form-field class="full-width mb-3">
          <mat-label>Default Value</mat-label>
          <input
            matInput
            type="text"
            [ngModel]="getDefaultValue()"
            (ngModelChange)="updateDefaultValue($event)"
          />
        </mat-form-field>
        <hr />
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <small class="text-muted">Debug: Field Config</small>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <pre class="mb-0"><code>{{ $selectedField() | json }}</code></pre>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card>
          <mat-card-content class="info-message">
            Select a component to configure its properties
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [
    `
      .properties-panel {
        padding: 1rem;
        height: 100%;
        background-color: #fafafa;
        border-left: 1px solid #e0e0e0;
        overflow-y: auto;
      }

      .full-width {
        width: 100%;
      }

      .info-message {
        color: #1976d2;
        padding: 1rem;
      }

      pre {
        background-color: #ffffff;
        padding: 1rem;
        border-radius: 0.25rem;
        max-height: 300px;
        overflow-y: auto;
      }

      hr {
        margin: 1rem 0;
        border: 0;
        border-top: 1px solid #e0e0e0;
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

  getDescription(): string {
    const field = this.$selectedField();
    if (!field || !field.props) {
      return '';
    }
    return field.props.description || '';
  }

  updateDescription(value: string) {
    const field = this.$selectedField();
    if (field) {
      if (!field.props) {
        field.props = {};
      }
      field.props.description = value === '' ? undefined : value;
      this.fieldUpdated.emit();
    }
  }

  getDefaultValue(): string {
    const field = this.$selectedField();
    if (!field) {
      return '';
    }
    return field.defaultValue !== undefined ? String(field.defaultValue) : '';
  }

  updateDefaultValue(value: string) {
    const field = this.$selectedField();
    if (field) {
      field.defaultValue = value === '' ? undefined : value;
      this.fieldUpdated.emit();
    }
  }
}
