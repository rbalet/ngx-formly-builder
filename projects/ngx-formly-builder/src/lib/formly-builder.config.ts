import { EnvironmentProviders, importProvidersFrom, Provider, signal } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { provideFormlyCore } from '@ngx-formly/core';
import { FormlyMaterialModule, withFormlyMaterial } from '@ngx-formly/material';
import { FormlyMatCheckboxModule } from '@ngx-formly/material/checkbox';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { FormlyMatInputModule } from '@ngx-formly/material/input';
import { FormlyMatMultiCheckboxModule } from '@ngx-formly/material/multicheckbox';
import { FormlyMatRadioModule } from '@ngx-formly/material/radio';
import { FormlyMatSelectModule } from '@ngx-formly/material/select';
import { FormlyMatTextAreaModule } from '@ngx-formly/material/textarea';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { provideMarkdown } from 'ngx-markdown';
import { PREVIEW_MODE, SCREEN_SIZE, EXPORT_SERVICE } from './core/token';
import { MarkdownFieldComponent } from './types/markdown-field.component';
import { FieldWrapperComponent } from './wrappers/field-wrapper.component';
import { FormBuilderService } from './services/form-builder.service';
import { ThemeService } from './services/theme.service';
import { ExportService } from './services/export.service';
import { ImportService } from './services/import.service';
import { TemplateService } from './services/template.service';

/**
 * Provides all necessary configuration for ngx-formly-builder.
 * This includes formly configuration, Material UI configuration, and markdown support.
 * 
 * @example
 * ```ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideFormlyBuilder(),
 *     provideAnimationsAsync(),
 *     // ... other providers
 *   ],
 * };
 * ```
 */
export function provideFormlyBuilder(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: 'material-symbols-outlined' },
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },

    { provide: SCREEN_SIZE, useValue: signal('lg') },
    { provide: PREVIEW_MODE, useValue: signal(false) },
    { provide: EXPORT_SERVICE, useClass: ExportService },

    FormBuilderService,
    ThemeService,
    ImportService,
    TemplateService,

    provideMarkdown(),

    importProvidersFrom([
      FormlyMatCheckboxModule,
      FormlyMatDatepickerModule,
      FormlyMaterialModule,
      FormlyMatFormFieldModule,
      FormlyMatInputModule,
      FormlyMatMultiCheckboxModule,
      FormlyMatRadioModule,
      FormlyMatSelectModule,
      FormlyMatTextAreaModule,
      FormlyMatToggleModule,
      MatDatepickerModule,
      MatDialogModule,
      MatNativeDateModule,
    ]),

    provideFormlyCore({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
      wrappers: [{ name: 'field-wrapper', component: FieldWrapperComponent }],
      types: [{ name: 'markdown', component: MarkdownFieldComponent }],
      ...withFormlyMaterial(),
    }),
  ];
}
