import { InjectionToken, WritableSignal } from '@angular/core';
import { ScreenSize } from './type';

export const SCREEN_SIZE = new InjectionToken<WritableSignal<ScreenSize>>(
  'formly.builder.screen.size',
);
