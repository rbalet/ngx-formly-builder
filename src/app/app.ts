import { Component, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FieldPaletteComponent } from './components/field-palette/field-palette.component';
import { FormPreviewComponent } from './components/form-preview/form-preview.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';
import { UiStateService } from './services/ui-state.service';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, FieldPaletteComponent, FormPreviewComponent, PropertiesPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  $fields = signal<FormlyFieldConfig[]>([
    {
      key: 'firstName',
      type: 'input',
      wrappers: ['field-wrapper'],
      props: {
        label: 'First Name',
        placeholder: 'Enter your first name',
        required: true,
      },
    },
    {
      key: 'email',
      type: 'input',
      wrappers: ['field-wrapper'],
      props: {
        label: 'Email',
        placeholder: 'Enter your email',
        type: 'email',
      },
    },
  ]);

  $selectedField = signal<FormlyFieldConfig | null>(null);

  constructor(public uiStateService: UiStateService) {}

  onFieldSelect(fieldType: string) {
    // Field types that use the 'input' Formly type with specific HTML input types
    const inputFieldTypes = ['number', 'email', 'password', 'telephone', 'url'];

    // Map field types to Formly type and HTML input type
    let formlyType = fieldType;
    let inputType: string | undefined;

    if (inputFieldTypes.includes(fieldType)) {
      formlyType = 'input';
      inputType = fieldType === 'telephone' ? 'tel' : fieldType;
    }

    const newField: FormlyFieldConfig = {
      key: `field_${Date.now()}`,
      type: formlyType,
      wrappers: ['field-wrapper'],
      props: {
        label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}`,
        placeholder: `Enter ${fieldType}`,
      },
    };

    if (inputType) {
      newField.props!.type = inputType;
    }

    if (fieldType === 'select') {
      newField.props!.options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];
    }

    if (fieldType === 'textarea') {
      newField.props!.rows = 5;
    }

    if (fieldType === 'multicheckbox' || fieldType === 'radio') {
      newField.props!.options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ];
    }

    if (fieldType === 'checkbox' || fieldType === 'toggle') {
      newField.props!.label = `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}`;
      delete newField.props!.placeholder;
    }

    if (fieldType === 'datepicker') {
      newField.props!.placeholder = 'Select a date';
    }

    this.$fields.update((fields) => [...fields, newField]);
    this.$selectedField.set(newField);
  }

  onFieldUpdated() {
    // Force update of fields array to trigger change detection
    this.$fields.update((fields) => [...fields]);
  }
}
