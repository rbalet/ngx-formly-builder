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
        background-color: #fafafa;
        border-right: 1px solid #e0e0e0;
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
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
      }

      .field-label {
        font-size: 0.9375rem;
        font-weight: 500;
        color: #333;
        margin-bottom: 0.125rem;
      }

      .field-description {
        font-size: 0.8125rem;
        color: #666;
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
        { type: 'input', label: 'Text Input', icon: 'input', description: 'Basic text input field for single-line text' },
        { type: 'textarea', label: 'Textarea', icon: 'description', description: 'Multi-line text input field for longer content' },
        { type: 'number', label: 'Number', icon: 'numbers', description: 'Input field for numeric values only' },
        { type: 'email', label: 'Email', icon: 'email', description: 'Input field for email addresses with validation' },
        { type: 'password', label: 'Password', icon: 'lock', description: 'Input field for passwords with hidden characters' },
        { type: 'telephone', label: 'Telephone', icon: 'phone', description: 'Input field for phone numbers' },
        { type: 'url', label: 'URL', icon: 'link', description: 'Input field for website URLs with validation' },
      ],
    },
    {
      category: 'Selection Fields',
      fields: [
        { type: 'select', label: 'Select', icon: 'list', description: 'Dropdown menu for selecting one option from a list' },
        { type: 'checkbox', label: 'Checkbox', icon: 'check_box', description: 'Single checkbox for yes/no or true/false choices' },
        { type: 'multicheckbox', label: 'Checkbox Group', icon: 'checklist', description: 'Multiple checkboxes for selecting multiple options' },
        { type: 'radio', label: 'Radio Group', icon: 'radio_button_checked', description: 'Radio buttons for selecting one option from a group' },
        { type: 'toggle', label: 'Toggle', icon: 'toggle_on', description: 'Toggle switch for on/off or enabled/disabled states' },
      ],
    },
    {
      category: 'Date & Time',
      fields: [
        { type: 'datepicker', label: 'Date Picker', icon: 'calendar_today', description: 'Calendar widget for selecting dates' },
      ],
    },
  ];

  onFieldSelect(type: string) {
    this.fieldSelect.emit(type);
  }
}
