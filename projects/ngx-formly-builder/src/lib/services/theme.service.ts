import { Injectable, signal, effect } from '@angular/core';

export type ColorScheme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'color-scheme';

  // The user's selected preference (light, dark, or system)
  colorScheme = signal<ColorScheme>(this.getInitialScheme());

  // The actual theme being applied (light or dark, resolved from system if needed)
  private systemPreference = signal<'light' | 'dark'>(this.getSystemPreference());

  constructor() {
    // Listen for system preference changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        this.systemPreference.set(e.matches ? 'dark' : 'light');
      });
    }

    // Apply theme whenever it changes
    effect(() => {
      this.applyTheme();
    });
  }

  /**
   * Get the initial color scheme from localStorage or default to 'system'
   */
  private getInitialScheme(): ColorScheme {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'system';
    }

    const stored = localStorage.getItem(this.STORAGE_KEY) as ColorScheme | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }

    return 'system';
  }

  /**
   * Get the system's preferred color scheme
   */
  private getSystemPreference(): 'light' | 'dark' {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Get the resolved theme (light or dark)
   */
  getResolvedTheme(): 'light' | 'dark' {
    const scheme = this.colorScheme();
    if (scheme === 'system') {
      return this.systemPreference();
    }
    return scheme;
  }

  /**
   * Set the color scheme and persist to localStorage
   */
  setColorScheme(scheme: ColorScheme): void {
    this.colorScheme.set(scheme);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, scheme);
    }
  }

  /**
   * Apply the theme to the DOM
   */
  private applyTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const resolvedTheme = this.getResolvedTheme();

    // Update the color-scheme CSS property on body
    document.body.style.colorScheme = resolvedTheme;

    // Add/remove dark mode class for additional styling if needed
    if (resolvedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }
}
