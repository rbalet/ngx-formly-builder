import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject, input } from '@angular/core';
import { FieldPaletteComponent } from './components/field-palette/field-palette.component';
import { FormPreviewComponent } from './components/form-preview/form-preview.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';
import { PREVIEW_MODE, SCREEN_SIZE } from './core/token';
import { FieldGroup } from './models/field-group.model';
import { FormBuilderService } from './services/form-builder.service';
import { TemplateService } from './services/template.service';

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
      <formly-builder-navbar></formly-builder-navbar>

      <div class="main-content" cdkDropListGroup>
        @if (!$previewMode()) {
          <div class="palette-section">
            <formly-builder-field-palette
              [fieldGroups]="fieldGroups()"
              (fieldSelect)="onFieldSelect($event)"
            ></formly-builder-field-palette>
          </div>
        }
        <div class="preview-section" [class.preview-fullWidth]="$previewMode()">
          <formly-builder-form-preview
            [$fields]="$fields()"
            [($selectedField)]="$selectedField"
            [$screenSize]="$screenSize()"
            (templateSelected)="onTemplateSelected($event)"
          ></formly-builder-form-preview>

          <div class="app-background"></div>
        </div>
        @if (!$previewMode()) {
          <div class="properties-section">
            <formly-builder-properties-panel
              [$selectedField]="$selectedField()"
              (fieldUpdated)="onFieldUpdated()"
            ></formly-builder-properties-panel>
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
  readonly #templateService = inject(TemplateService);

  // Input for custom field groups
  fieldGroups = input<FieldGroup[]>([]);

  // Expose service signals for template use
  $fields;
  $selectedField;

  constructor() {
    this.$fields = this.#formBuilderService.$fields;
    this.$selectedField = this.#formBuilderService.$selectedField;
  }

  onFieldSelect(fieldType: string) {
    const newField = this.#formBuilderService.createField(fieldType);
    this.#formBuilderService.addField(newField);
    this.#formBuilderService.$selectedField.set(newField);
  }

  onFieldUpdated() {
    // Force update of fields array to trigger change detection
    this.#formBuilderService.updateFields();
  }

  onTemplateSelected(templateId: string) {
    // Find the template by ID across all categories
    const categories = this.#templateService.getCategories();
    const selectedTemplate = categories
      .flatMap(c => c.templates)
      .find(t => t.id === templateId);

    // Load the template if found
    if (selectedTemplate) {
      this.#formBuilderService.importFields(
        selectedTemplate.fields,
        selectedTemplate.name
      );
    }
  }
}
