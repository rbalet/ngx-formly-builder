import { Injectable, signal } from '@angular/core';

export type ScreenSize = 'sm' | 'md' | 'lg';

@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  $screenSize = signal<ScreenSize>('lg');

  setScreenSize(size: ScreenSize) {
    this.$screenSize.set(size);
  }
}
