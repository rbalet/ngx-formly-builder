import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PREVIEW_MODE } from '@core/token';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'formly-field-markdown',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MarkdownComponent,
    FormlyModule,
  ],
  template: `
    @if (!$previewMode()) {
      <mat-form-field class="w-100" subscriptSizing="dynamic">
        <mat-label>{{ props.label }}</mat-label>
        <textarea
          matInput
          [formControl]="formControl"
          [formlyAttributes]="field"
          [placeholder]="props.placeholder || ''"
          rows="6"
        ></textarea>
      </mat-form-field>
    } @else {
      <div class="markdown-preview">
        <markdown [data]="formControl.value || ''"></markdown>
      </div>
    }
  `,
  styles: [
    `
      .markdown-preview {
        padding: 1rem;
        background-color: var(--mat-sys-surface-container);
        border-radius: 0.25rem;
        min-height: 100px;
      }

      .w-100 {
        width: 100%;
      }
    `,
  ],
})
export class MarkdownFieldComponent extends FieldType<FieldTypeConfig> {
  readonly $previewMode = inject(PREVIEW_MODE);
}
