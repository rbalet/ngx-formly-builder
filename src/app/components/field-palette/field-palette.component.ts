import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

interface FieldType {
  type: string;
  label: string;
  icon: string;
  description: string;
}

interface FieldGroup {
  category: string;
  fields: FieldType[];
}

@Component({
  selector: 'app-field-palette',
  imports: [MatListModule, MatIconModule],
  template: `
    <div class="field-palette">
      <h5 class="mb-3">Field Types</h5>
      @for (group of fieldGroups; track group.category) {
        <div class="field-group">
          <div class="group-header">{{ group.category }}</div>
          <mat-action-list>
            @for (field of group.fields; track field.type) {
              <button mat-list-item (click)="onFieldSelect(field.type)">
                <mat-icon matListItemIcon>{{ field.icon }}</mat-icon>
                <div matListItemTitle>
                  <div class="field-label">{{ field.label }}</div>
                  <div class="field-description">{{ field.description }}</div>
                </div>
              </button>
            }
          </mat-action-list>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .field-palette {
        padding: 1rem;
        background-color: var(--mat-sys-surface-container-lowest);
        border-right: 1px solid var(--mat-sys-outline-variant);
        min-height: 100%;
        box-sizing: border-box;
      }

      .field-group {
        margin-bottom: 1.5rem;
      }

      .field-group:last-child {
        margin-bottom: 0;
      }

      .group-header {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--mat-sys-on-surface-variant);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
      }

      .field-label {
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--mat-sys-on-surface);
        margin-bottom: 0.125rem;
      }

      .field-description {
        font-size: 0.8125rem;
        color: var(--mat-sys-on-surface-variant);
        line-height: 1.3;
      }

      .me-2 {
        margin-right: 0.5rem;
      }
    `,
  ],
})
export class FieldPaletteComponent {
  fieldSelect = output<string>();

  fieldGroups: FieldGroup[] = [
    {
      category: 'Input Fields',
      fields: [
        {
          type: 'input',
          label: 'Text Input',
          icon: 'input',
          description: 'Single line text input',
        },
        {
          type: 'textarea',
          label: 'Textarea',
          icon: 'description',
          description: 'Multi-line text input',
        },
        { type: 'number', label: 'Number', icon: 'numbers', description: 'Numeric input' },
        { type: 'email', label: 'Email', icon: 'email', description: 'Email input' },
        { type: 'password', label: 'Password', icon: 'lock', description: 'Password input' },
        { type: 'telephone', label: 'Telephone', icon: 'phone', description: 'Phone number input' },
        { type: 'url', label: 'URL', icon: 'link', description: 'Website URL input' },
      ],
    },
    {
      category: 'Selection Fields',
      fields: [
        { type: 'select', label: 'Select', icon: 'list', description: 'Dropdown select' },
        { type: 'checkbox', label: 'Checkbox', icon: 'check_box', description: 'Single checkbox' },
        {
          type: 'multicheckbox',
          label: 'Checkbox Group',
          icon: 'checklist',
          description: 'Multiple checkboxes',
        },
        {
          type: 'radio',
          label: 'Radio Group',
          icon: 'radio_button_checked',
          description: 'Radio button group',
        },
        { type: 'toggle', label: 'Toggle', icon: 'toggle_on', description: 'Toggle switch' },
      ],
    },
    {
      category: 'Date & Time',
      fields: [
        {
          type: 'datepicker',
          label: 'Date Picker',
          icon: 'calendar_today',
          description: 'Date picker',
        },
      ],
    },
  ];

  onFieldSelect(type: string) {
    this.fieldSelect.emit(type);
  }
}
