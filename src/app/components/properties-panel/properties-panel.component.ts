import { JsonPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  OptionItem,
  OptionsEditorDialogComponent,
} from '../options-editor-dialog/options-editor-dialog.component';

@Component({
  selector: 'app-properties-panel',
  imports: [
    JsonPipe,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
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
              <p class="placeholder-text">Validation options coming soon...</p>
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
}
