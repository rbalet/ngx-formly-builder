import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFormlyCore } from '@ngx-formly/core';

import { FieldWrapperComponent } from './wrappers/field-wrapper.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideFormlyCore({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
      wrappers: [{ name: 'field-wrapper', component: FieldWrapperComponent }],
    }),
  ],
};
