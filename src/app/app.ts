import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldPaletteComponent } from 'projects/ngx-formly-builder/src/lib/components/field-palette/field-palette.component';
import { FormPreviewComponent } from 'projects/ngx-formly-builder/src/lib/components/form-preview/form-preview.component';
import { NavbarComponent } from 'projects/ngx-formly-builder/src/lib/components/navbar/navbar.component';
import { PropertiesPanelComponent } from 'projects/ngx-formly-builder/src/lib/components/properties-panel/properties-panel.component';
import { PREVIEW_MODE, SCREEN_SIZE } from 'projects/ngx-formly-builder/src/lib/core/token';
import { FormBuilderService } from 'projects/ngx-formly-builder/src/lib/services/form-builder.service';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    FieldPaletteComponent,
    FormPreviewComponent,
    PropertiesPanelComponent,
    DragDropModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly $screenSize = inject(SCREEN_SIZE);
  readonly $previewMode = inject(PREVIEW_MODE);
  readonly #formBuilderService = inject(FormBuilderService);

  // Expose service signals for template use
  $fields;
  $selectedField;

  constructor() {
    this.$fields = this.#formBuilderService.$fields;
    this.$selectedField = this.#formBuilderService.$selectedField;

    // Initialize with default fields
    this.#formBuilderService.$fields.set([
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
  }

  onFieldSelect(fieldType: string) {
    const newField = this.createFieldConfig(fieldType);
    this.#formBuilderService.addField(newField);
    this.#formBuilderService.$selectedField.set(newField);
  }

  onFieldUpdated() {
    // Force update of fields array to trigger change detection
    this.#formBuilderService.updateFields();
  }

  onFieldsReordered(event: { previousIndex: number; currentIndex: number }) {
    this.#formBuilderService.reorderFields(event.previousIndex, event.currentIndex);
  }

  onFieldDropped(event: { fieldType: string; index: number }) {
    const newField = this.createFieldConfig(event.fieldType);
    this.#formBuilderService.addFieldAtIndex(newField, event.index);
    this.#formBuilderService.$selectedField.set(newField);
  }

  private createFieldConfig(fieldType: string): FormlyFieldConfig {
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

    if (fieldType === 'markdown') {
      newField.props!.label = 'Text Block';
      newField.props!.placeholder = 'Enter markdown content...';
      newField.defaultValue = '# Heading\n\nYour text here...';
    }

    return newField;
  }
}
