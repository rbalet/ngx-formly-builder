import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFormlyCore } from '@ngx-formly/core';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
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
import { PREVIEW_MODE, SCREEN_SIZE } from './core/token';
import { FieldWrapperComponent } from './wrappers/field-wrapper.component';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: 'material-symbols-outlined' },
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },

    { provide: SCREEN_SIZE, useValue: signal('lg') },
    { provide: PREVIEW_MODE, useValue: signal(false) },

    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),

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
      ...withFormlyMaterial(),
    }),
  ],
};
