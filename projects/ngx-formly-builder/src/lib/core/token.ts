import { InjectionToken, WritableSignal } from '@angular/core';
import { ScreenSize } from './type';
import { ExportService } from '../services/export.service';

export const SCREEN_SIZE = new InjectionToken<WritableSignal<ScreenSize>>(
  'formly.builder.screen.size',
);

export const PREVIEW_MODE = new InjectionToken<WritableSignal<boolean>>(
  'formly.builder.preview.mode',
);

export const EXPORT_SERVICE = new InjectionToken<ExportService>(
  'formly.builder.export.service',
);
