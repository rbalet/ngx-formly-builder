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
  $fields = signal<FormlyFieldConfig[]>([]);

  $selectedField = signal<FormlyFieldConfig | null>(null);

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

    this.$fields.update((fields) => [...fields, newField]);
    this.$selectedField.set(newField);
  }
}
