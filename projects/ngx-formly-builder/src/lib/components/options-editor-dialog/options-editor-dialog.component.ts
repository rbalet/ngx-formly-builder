import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface OptionItem {
  label: string;
  description?: string;
  value: string | number;
}

export interface OptionsEditorDialogData {
  options: OptionItem[];
}

@Component({
  selector: 'formly-builder-options-editor-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Manage Options</h2>
    <mat-dialog-content>
      <div class="options-editor">
        <div class="options-header">
          <div class="header-cell">Label</div>
          <div class="header-cell">Label Description</div>
          <div class="header-cell">Value</div>
          <div class="header-cell-action"></div>
        </div>
        @for (option of options; track $index) {
          <div class="option-row">
            <mat-form-field class="field-input" subscriptSizing="dynamic">
              <input matInput [(ngModel)]="option.label" placeholder="Option {{ $index + 1 }}" />
            </mat-form-field>
            <mat-form-field class="field-input" subscriptSizing="dynamic">
              <input
                matInput
                [(ngModel)]="option.description"
                placeholder="Option {{ $index + 1 }} Description"
              />
            </mat-form-field>
            <mat-form-field class="field-input" subscriptSizing="dynamic">
              <input matInput [(ngModel)]="option.value" placeholder="option{{ $index + 1 }}" />
            </mat-form-field>
            <button
              mat-icon-button
              class="delete-btn"
              (click)="removeOption($index)"
              aria-label="Delete option"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        }
        <button mat-stroked-button class="add-option-btn" (click)="addOption()">
          <mat-icon>add</mat-icon>
          Add Option
        </button>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()">
        <mat-icon>save</mat-icon>
        Save Options
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .options-editor {
        padding: 1rem 0;
      }

      .options-header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 48px;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding: 0 0.5rem;
      }

      .header-cell {
        font-weight: 500;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
      }

      .header-cell-action {
        width: 48px;
      }

      .option-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 48px;
        gap: 0.5rem;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .field-input {
        width: 100%;
      }

      .delete-btn:hover {
        color: #f44336;
      }

      .add-option-btn {
        margin-top: 1rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      mat-dialog-actions {
        padding: 1rem 1.5rem;
        margin: 0;
      }

      mat-dialog-content {
        max-height: 70vh;
      }
    `,
  ],
})
export class OptionsEditorDialogComponent {
  private dialogRef = inject(MatDialogRef<OptionsEditorDialogComponent>);
  private data = inject<OptionsEditorDialogData>(MAT_DIALOG_DATA);

  options: OptionItem[] = [];
  private nextOptionIndex = 1;

  constructor() {
    // Deep clone the options to avoid mutating the original data
    this.options = structuredClone(this.data.options || []);

    // Calculate the next option index based on existing options
    this.calculateNextOptionIndex();
  }

  private calculateNextOptionIndex() {
    // Find the highest numeric suffix in existing option values
    // This ensures new options don't conflict with existing ones that follow the optionN pattern
    // For custom values (e.g., 'yes', 'no'), the regex won't match and maxIndex stays 0
    let maxIndex = 0;
    this.options.forEach((option) => {
      const match = String(option.value).match(/^option(\d+)$/);
      if (match) {
        const index = parseInt(match[1], 10);
        if (index > maxIndex) {
          maxIndex = index;
        }
      }
    });
    this.nextOptionIndex = maxIndex + 1;
  }

  addOption() {
    const index = this.nextOptionIndex;
    this.options.push({
      label: `Option ${index}`,
      description: `Option ${index} Description`,
      value: `option${index}`,
    });
    this.nextOptionIndex++;
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
  }

  save() {
    this.dialogRef.close(this.options);
  }

  cancel() {
    this.dialogRef.close();
  }
}
