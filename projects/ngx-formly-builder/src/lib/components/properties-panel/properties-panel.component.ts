import { JsonPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ValidationCondition, ValidationConditionType } from '../../core/type';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  OptionItem,
  OptionsEditorDialogComponent,
} from '../options-editor-dialog/options-editor-dialog.component';

interface ExtendedFieldProps {
  validationConditions?: ValidationCondition[];
  [key: string]: unknown;
}

@Component({
  selector: 'app-properties-panel',
  imports: [
    JsonPipe,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatExpansionModule,
    MatSelectModule,
  ],
  template: `
    <div class="properties-panel">
      @if ($selectedField()) {
        <mat-accordion [multi]="true">
          @if (hasOptions()) {
            <mat-expansion-panel [expanded]="true">
              <mat-expansion-panel-header>
                <mat-panel-title>Data Options</mat-panel-title>
              </mat-expansion-panel-header>
              <div class="panel-content">
                <div class="options-table">
                  <div class="table-header">
                    <div class="table-cell">Label</div>
                    <div class="table-cell">Value</div>
                  </div>
                  @for (option of getOptions(); track $index) {
                    <div class="table-row">
                      <div class="table-cell">{{ option.label }}</div>
                      <div class="table-cell">{{ option.value }}</div>
                    </div>
                  }
                </div>
                <button
                  mat-stroked-button
                  class="full-width mt-2 manage-options-btn"
                  (click)="openOptionsEditor()"
                >
                  <mat-icon>list</mat-icon>
                  Manage Options
                </button>
              </div>
            </mat-expansion-panel>
          }

          <mat-expansion-panel [expanded]="true">
            <mat-expansion-panel-header>
              <mat-panel-title>Input</mat-panel-title>
            </mat-expansion-panel-header>
            <div class="panel-content">
              <mat-form-field class="full-width mb-3">
                <mat-label>Value</mat-label>
                <input
                  matInput
                  type="text"
                  [ngModel]="getDefaultValue()"
                  (ngModelChange)="updateDefaultValue($event)"
                />
              </mat-form-field>
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
            </div>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>Validation</mat-panel-title>
            </mat-expansion-panel-header>
            <div class="panel-content">
              <div class="validation-row">
                <label class="validation-label">Required</label>
                <mat-button-toggle-group
                  [value]="getRequired() ? 'yes' : 'no'"
                  (change)="updateRequired($event.value === 'yes')"
                  class="validation-toggle"
                >
                  <mat-button-toggle value="yes">yes</mat-button-toggle>
                  <mat-button-toggle value="no">no</mat-button-toggle>
                </mat-button-toggle-group>
              </div>
              <div class="validation-row">
                <label class="validation-label">Disabled</label>
                <mat-button-toggle-group
                  [value]="getDisabled() ? 'yes' : 'no'"
                  (change)="updateDisabled($event.value === 'yes')"
                  class="validation-toggle"
                >
                  <mat-button-toggle value="yes">yes</mat-button-toggle>
                  <mat-button-toggle value="no">no</mat-button-toggle>
                </mat-button-toggle-group>
              </div>

              @if (getValidationConditions().length > 0) {
                <div class="conditions-container">
                  @for (condition of getValidationConditions(); track $index) {
                    <div class="condition-row">
                      <mat-form-field class="condition-type" subscriptSizing="dynamic">
                        <mat-select
                          [value]="condition.type"
                          (selectionChange)="updateConditionType($index, $event.value)"
                        >
                          <mat-option value="contains">Contains</mat-option>
                          <mat-option value="notContains">Does not contain</mat-option>
                          <mat-option value="minLength">Min length</mat-option>
                          <mat-option value="maxLength">Max length</mat-option>
                        </mat-select>
                      </mat-form-field>

                      <mat-form-field class="condition-value" subscriptSizing="dynamic">
                        <input
                          matInput
                          type="text"
                          placeholder="Value"
                          [ngModel]="condition.value"
                          (ngModelChange)="updateConditionValue($index, $event)"
                        />
                      </mat-form-field>

                      <button
                        mat-icon-button
                        class="delete-condition-btn"
                        (click)="deleteCondition($index)"
                        aria-label="Delete condition"
                      >
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    @if ($index < getValidationConditions().length - 1) {
                      <div class="condition-separator">AND</div>
                    }
                  }
                </div>
              }

              <button
                mat-stroked-button
                class="full-width add-condition-btn"
                (click)="addCondition()"
              >
                <mat-icon>add</mat-icon>
                Add condition
              </button>
            </div>
          </mat-expansion-panel>
        </mat-accordion>

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
        <p class="info-text">Select a component to configure its properties</p>
      }
    </div>
  `,
  styles: [
    `
      .properties-panel {
        padding: 1rem;
        height: 100%;
        background-color: var(--mat-sys-surface-container-lowest);
        border-left: 1px solid var(--mat-sys-outline-variant);
        overflow-y: auto;
        min-height: 100%;
        box-sizing: border-box;
      }

      .full-width {
        width: 100%;
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

      hr {
        margin: 1rem 0;
        border: 0;
        border-top: 1px solid #e0e0e0;
      }

      .panel-content {
        padding-top: 1rem;
      }

      .options-table {
        border: 1px solid #e0e0e0;
        border-radius: 0.25rem;
        overflow: hidden;
      }

      .table-header {
        display: grid;
        grid-template-columns: 1fr 1fr;
        font-weight: 500;
        border-bottom: 1px solid #e0e0e0;
      }

      .table-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        border-bottom: 1px solid #e0e0e0;
      }

      .table-row:last-child {
        border-bottom: none;
      }

      .table-cell {
        padding: 0.75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .table-header .table-cell {
        border-right: 1px solid #e0e0e0;
      }

      .table-header .table-cell:last-child,
      .table-row .table-cell:last-child {
        border-right: none;
      }

      .table-row .table-cell {
        border-right: 1px solid #e0e0e0;
      }

      .manage-options-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .placeholder-text {
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
      }

      .mt-2 {
        margin-top: 0.5rem;
      }

      .mb-3 {
        margin-bottom: 1rem;
      }

      .validation-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
      }

      .validation-label {
        margin: 0;
        font-size: 0.875rem;
        color: var(--mat-sys-on-surface);
      }

      .validation-toggle {
        flex-shrink: 0;
      }

      .conditions-container {
        margin-top: 1rem;
        margin-bottom: 1rem;
      }

      .condition-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .condition-type {
        flex: 1;
        min-width: 150px;
      }

      .condition-value {
        flex: 1;
      }

      .delete-condition-btn {
        flex-shrink: 0;
        color: var(--mat-sys-error);
      }

      .condition-separator {
        text-align: center;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mat-sys-on-surface-variant);
        margin: 0.5rem 0;
        padding: 0.25rem 0;
      }

      .add-condition-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class PropertiesPanelComponent {
  $selectedField = input<FormlyFieldConfig | null>(null);
  fieldUpdated = output<void>();
  private dialog = inject(MatDialog);

  hasOptions(): boolean {
    const field = this.$selectedField();
    if (!field || !field.props) {
      return false;
    }
    return Array.isArray(field.props.options) && field.props.options.length > 0;
  }

  getOptions(): Array<{ label: string; value: string | number }> {
    const field = this.$selectedField();
    if (!field || !field.props || !Array.isArray(field.props.options)) {
      return [];
    }
    return field.props.options as Array<{ label: string; value: string | number }>;
  }

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
    // Convert any defaultValue type to string for display in text input
    return field.defaultValue !== undefined ? String(field.defaultValue) : '';
  }

  updateDefaultValue(value: string) {
    const field = this.$selectedField();
    if (field) {
      // Store defaultValue as string from text input; clear field if empty
      field.defaultValue = value === '' ? undefined : value;
      this.fieldUpdated.emit();
    }
  }

  getRequired(): boolean {
    const field = this.$selectedField();
    if (!field || !field.props) {
      return false;
    }
    return field.props.required === true;
  }

  updateRequired(value: boolean) {
    const field = this.$selectedField();
    if (field) {
      if (!field.props) {
        field.props = {};
      }
      field.props.required = value;
      this.fieldUpdated.emit();
    }
  }

  getDisabled(): boolean {
    const field = this.$selectedField();
    if (!field || !field.props) {
      return false;
    }
    return field.props.disabled === true;
  }

  updateDisabled(value: boolean) {
    const field = this.$selectedField();
    if (field) {
      if (!field.props) {
        field.props = {};
      }
      field.props.disabled = value;
      this.fieldUpdated.emit();
    }
  }

  openOptionsEditor() {
    const field = this.$selectedField();
    if (!field || !field.props) {
      return;
    }

    const currentOptions = this.getOptions();

    const dialogRef = this.dialog.open(OptionsEditorDialogComponent, {
      width: '900px',
      data: { options: currentOptions },
    });

    dialogRef.afterClosed().subscribe((result: OptionItem[] | undefined) => {
      if (result && field.props) {
        field.props.options = result;
        this.fieldUpdated.emit();
      }
    });
  }

  getValidationConditions(): ValidationCondition[] {
    const field = this.$selectedField();
    if (!field || !field.props) {
      return [];
    }
    // Store validation conditions in a custom property
    const props = field.props as ExtendedFieldProps;
    return props.validationConditions || [];
  }

  addCondition() {
    const field = this.$selectedField();
    if (field) {
      if (!field.props) {
        field.props = {};
      }
      const conditions = this.getValidationConditions();
      const newCondition: ValidationCondition = {
        type: 'contains',
        value: '',
      };
      (field.props as ExtendedFieldProps).validationConditions = [...conditions, newCondition];
      this.fieldUpdated.emit();
    }
  }

  updateConditionType(index: number, type: ValidationConditionType) {
    const field = this.$selectedField();
    if (field && field.props) {
      const conditions = this.getValidationConditions();
      if (conditions[index]) {
        conditions[index].type = type;
        (field.props as ExtendedFieldProps).validationConditions = [...conditions];
        this.fieldUpdated.emit();
      }
    }
  }

  updateConditionValue(index: number, value: string) {
    const field = this.$selectedField();
    if (field && field.props) {
      const conditions = this.getValidationConditions();
      if (conditions[index]) {
        conditions[index].value = value;
        (field.props as ExtendedFieldProps).validationConditions = [...conditions];
        this.fieldUpdated.emit();
      }
    }
  }

  deleteCondition(index: number) {
    const field = this.$selectedField();
    if (field && field.props) {
      const conditions = this.getValidationConditions();
      conditions.splice(index, 1);
      (field.props as ExtendedFieldProps).validationConditions = [...conditions];
      this.fieldUpdated.emit();
    }
  }
}
