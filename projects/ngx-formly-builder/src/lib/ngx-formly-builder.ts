import { Component, inject, input, signal } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldPaletteComponent } from './components/field-palette/field-palette.component';
import { FormPreviewComponent } from './components/form-preview/form-preview.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';
import { PREVIEW_MODE, SCREEN_SIZE } from './core/token';
import { FormBuilderService } from './services/form-builder.service';
import { FieldGroup } from './models/field-group.model';

@Component({
  selector: 'formly-builder',
  imports: [
    NavbarComponent,
    FieldPaletteComponent,
    FormPreviewComponent,
    PropertiesPanelComponent,
    DragDropModule,
  ],
  template: `
    <div class="app-container h-100">
      <app-navbar></app-navbar>

      <div class="main-content" cdkDropListGroup>
        @if (!$previewMode()) {
          <div class="palette-section">
            <app-field-palette
              [fieldGroups]="fieldGroups()"
              (fieldSelect)="onFieldSelect($event)"
            ></app-field-palette>
          </div>
        }
        <div class="preview-section" [class.preview-fullWidth]="$previewMode()">
          <app-form-preview
            [$fields]="$fields()"
            [($selectedField)]="$selectedField"
            [$screenSize]="$screenSize()"
            (fieldsReordered)="onFieldsReordered($event)"
            (fieldDropped)="onFieldDropped($event)"
          ></app-form-preview>

          <div class="app-background"></div>
        </div>
        @if (!$previewMode()) {
          <div class="properties-section">
            <app-properties-panel
              [$selectedField]="$selectedField()"
              (fieldUpdated)="onFieldUpdated()"
            ></app-properties-panel>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .app-container {
      display: flex;
      flex-direction: column;
    }

    .main-content {
      display: flex;
      flex: 1;
      min-height: 0;
    }

    .palette-section {
      width: 280px;
      flex-shrink: 0;
      overflow-y: auto;
    }

    .preview-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      position: relative;
    }

    .preview-fullWidth {
      width: 100%;
    }

    .properties-section {
      width: 320px;
      flex-shrink: 0;
      overflow-y: auto;
    }

    .app-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--mat-sys-surface-container-low);
      z-index: -1;
    }

    .h-100 {
      height: 100%;
    }
  `,
})
export class FormlyBuilder {
  readonly $screenSize = inject(SCREEN_SIZE);
  readonly $previewMode = inject(PREVIEW_MODE);
  readonly #formBuilderService = inject(FormBuilderService);

  // Input for custom field groups
  fieldGroups = input<FieldGroup[]>([]);

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

