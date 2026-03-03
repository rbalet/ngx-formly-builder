import { inject, InjectionToken, WritableSignal } from '@angular/core';
import { ExportService } from '../services/export.service';
import { ScreenSize } from './type';

export const SCREEN_SIZE = new InjectionToken<WritableSignal<ScreenSize>>(
  'formly.builder.screen.size',
);

export const PREVIEW_MODE = new InjectionToken<WritableSignal<boolean>>(
  'formly.builder.preview.mode',
);

export const DEBUG_MODE = new InjectionToken<WritableSignal<boolean>>('formly.builder.debug.mode');

export const EXPORT_SERVICE = new InjectionToken<ExportService>('formly.builder.export.service', {
  providedIn: 'root',
  factory: () => inject(ExportService),
});
