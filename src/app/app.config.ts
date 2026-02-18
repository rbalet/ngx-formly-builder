import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFormlyCore } from '@ngx-formly/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
import { FieldWrapperComponent } from './wrappers/field-wrapper.component';

export const appConfig: ApplicationConfig = {
  providers: [
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
      MatNativeDateModule,
    ]),

    provideFormlyCore({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
      wrappers: [{ name: 'field-wrapper', component: FieldWrapperComponent }],
      ...withFormlyMaterial(),
    }),
  ],
};
