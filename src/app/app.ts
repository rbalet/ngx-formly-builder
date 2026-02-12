import { Component, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldPaletteComponent } from './components/field-palette/field-palette.component';
import { FormPreviewComponent } from './components/form-preview/form-preview.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';

@Component({
  selector: 'app-root',
  imports: [FieldPaletteComponent, FormPreviewComponent, PropertiesPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  fields = signal<FormlyFieldConfig[]>([
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'Full Name',
        placeholder: 'Enter your name',
        required: true,
      },
    },
    {
      key: 'comments',
      type: 'textarea',
      props: {
        label: 'Comments',
        placeholder: 'Enter your comments',
        rows: 5,
      },
    },
    {
      key: 'country',
      type: 'select',
      props: {
        label: 'Country',
        placeholder: 'Select country',
        required: true,
        options: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'ca', label: 'Canada' },
          { value: 'au', label: 'Australia' },
        ],
      },
    },
  ]);

  selectedField = signal<FormlyFieldConfig | null>(null);

  onFieldSelect(fieldType: string) {
    const newField: FormlyFieldConfig = {
      key: `field_${Date.now()}`,
      type: fieldType,
      props: {
        label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}`,
        placeholder: `Enter ${fieldType}`,
      },
    };

    if (fieldType === 'select') {
      newField.props!.options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];
    }

    if (fieldType === 'textarea') {
      newField.props!.rows = 5;
    }

    this.fields.update((fields) => [...fields, newField]);
    this.selectedField.set(newField);
  }
}
