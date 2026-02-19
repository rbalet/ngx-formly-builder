# AGENTS Instructions for NGX Formly Builder

## Project Overview

- **Purpose:** Visual form builder for ngx-formly, built with Angular v21 (standalone, zoneless, no NgModules).
- **Architecture:** 3-column layout: Field Palette (left), Form Preview (center), Properties Panel (right). State is managed via Angular signals and services.
- **Key Technologies:** Angular v21, ngx-formly v7, Bootstrap 5, TypeScript, Vitest.

## Service Injection Pattern

## Signal Naming Convention

- **Private signals** should be named with a `#$` prefix (e.g., `readonly #$undoStack = signal<T>([])`).
- This distinguishes private signals from public signals and other private fields.

### Example:
```ts
readonly #$undoStack = signal<FormlyFieldConfig[][]>([]);
```

**Inject services using Angular's inject() function:**
```ts
readonly #uiStateService = inject(UiStateService);
```
- Do **not** use constructor injection for services. See AGENTS.md for rationale and examples.

**If a service only exposes a single signal, prefer using an InjectionToken instead of a service.**

### Example: Using InjectionToken for a single signal

Define the token (see `src/app/core/token.ts`):
```ts
import { InjectionToken, WritableSignal } from '@angular/core';
import { ScreenSize } from './type';

export const SCREEN_SIZE = new InjectionToken<WritableSignal<ScreenSize>>(
  'formly.builder.screen.size',
);
```

Provide the token in your app config (see `src/app/app.config.ts`):
```ts
import { SCREEN_SIZE } from './core/token';
import { signal } from '@angular/core';

export const appConfig = {
  providers: [
    { provide: SCREEN_SIZE, useValue: signal('lg') },
    // ...other providers
  ],
};
```

Inject the signal where needed:
```ts
import { inject } from '@angular/core';
import { SCREEN_SIZE } from './core/token';

const screenSize = inject(SCREEN_SIZE);
```

## State Management

- **Signals:** Shared state (e.g., screen size, form fields) is managed using Angular signals in services (see `src/app/services/`).
- **Cross-component communication:** Use service signals for state changes (e.g., `UiStateService`, `FormBuilderService`).

## Component Structure

- **Standalone components:** All components are standalone (no NgModules). See `src/app/components/` for examples.
- **Preview Responsiveness:** Form preview supports responsive width modes (sm, md, lg) via signals and CSS classes.
- **Material UI:** Uses Angular Material for UI controls (menus, toggles, icons).

## Developer Workflows

- **Install dependencies:** `npm install`
- **Start dev server:** `npm start` (http://localhost:4200/)
- **Run tests:** `npm test` (Vitest)
- **Build:** `npm run build`
- **Lint:** `npm run lint` / `npm run lint:fix`
- **Format:** `npm run format` / `npm run format:check`

## Commit Conventions

- **Conventional Commits** enforced via commitlint and husky. Example:
  ```bash
  git commit -m "feat(form-builder): add drag and drop support"
  ```

## Key Patterns & Examples

- **Service injection:** See AGENTS.md for the required pattern.
- **Signals for state:**
  ```ts
  readonly #formBuilderService = inject(FormBuilderService);
  fields = this.#formBuilderService.$fields;
  ```
- **Material menu:**
  ```html
  <button mat-button [matMenuTriggerFor]="menu">Menu</button>
  <mat-menu #menu="matMenu">
    <button mat-menu-item>Item</button>
  </mat-menu>
  ```
- **Responsive preview:** See `form-preview.component.ts` for width mode logic.

## References

- [README.md](../../README.md) for setup, structure, and workflow details
- [AGENTS.md](../../AGENTS.md) for service injection and agent-specific conventions
- [src/app/services/](../../src/app/services/) for state management patterns
- [src/app/components/](../../src/app/components/) for UI/component structure

---

If any conventions or patterns are unclear, review AGENTS.md and README.md, or ask for clarification.
