import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, MatButtonModule, MatMenuModule, MatButtonToggleModule],
  template: `
    <header class="navbar">
      <!-- Left Section -->
      <div class="navbar-left">
        <mat-icon class="logo-icon">grid_view</mat-icon>
        <div class="title-section">
          <h1 class="app-title">Formly Builder</h1>
          <span class="alpha-badge">Alpha</span>
        </div>
      </div>

      <!-- Center Section -->
      <div class="navbar-center">
        <div class="menu-items">
          <button mat-button class="menu-item">File</button>
          <button mat-button class="menu-item">Edit</button>
          <button mat-button class="menu-item">View</button>
          <button mat-button class="menu-item">Help</button>
        </div>
        <div class="navbar-controls">
          <button mat-icon-button title="Undo">
            <mat-icon>undo</mat-icon>
          </button>
          <button mat-icon-button title="Redo">
            <mat-icon>redo</mat-icon>
          </button>
          <button mat-icon-button title="History">
            <mat-icon>history</mat-icon>
          </button>
          <mat-button-toggle-group
            [value]="screenSize()"
            (change)="onScreenSizeChange($event)"
            class="screen-size-toggle"
            hideSingleSelectionIndicator
          >
            <mat-button-toggle value="sm" title="Small screen">
              <mat-icon>smartphone</mat-icon>
            </mat-button-toggle>
            <mat-button-toggle value="md" title="Medium screen">
              <mat-icon>tablet</mat-icon>
            </mat-button-toggle>
            <mat-button-toggle value="lg" title="Large screen">
              <mat-icon>desktop_windows</mat-icon>
            </mat-button-toggle>
          </mat-button-toggle-group>
          <button
            mat-icon-button
            (click)="toggleTheme()"
            [title]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <mat-icon>{{ isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
        </div>
      </div>

      <!-- Right Section -->
      <div class="navbar-right">
        <button mat-button class="preview-button">
          <mat-icon>play_arrow</mat-icon>
          Preview
        </button>
        <button mat-raised-button color="primary" class="export-button">
          <mat-icon>open_in_new</mat-icon>
          Export
        </button>
      </div>
    </header>
  `,
  styles: [
    `
      .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid #333;
        height: 56px;
        gap: 1rem;
      }

      .navbar-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: fit-content;
      }

      .logo-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .title-section {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .app-title {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 500;
        white-space: nowrap;
      }

      .alpha-badge {
        background-color: #444;
        color: #aaa;
        padding: 0.125rem 0.375rem;
        border-radius: 3px;
        font-size: 0.65rem;
        font-weight: 500;
        text-transform: uppercase;
      }

      .navbar-center {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
        justify-content: center;
        max-width: 800px;
      }

      .menu-items {
        display: flex;
        gap: 0rem;
      }

      .menu-item {
        color: #ffffff;
        font-size: 0.813rem;
        min-width: auto;
        padding: 0 0.75rem;
      }

      .navbar-controls {
        display: flex;
        align-items: center;
        gap: 0.125rem;
      }

      .navbar-controls button {
        color: #aaa;
      }

      .navbar-controls button:hover {
        color: #ffffff;
      }

      .navbar-controls mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .screen-size-toggle {
        height: 32px;
        margin-left: 0.25rem;
      }

      .navbar-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: fit-content;
      }

      .preview-button {
        color: #ffffff;
        font-size: 0.875rem;
      }

      .preview-button mat-icon {
        margin-right: 0.25rem;
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .export-button {
        font-size: 0.875rem;
      }

      .export-button mat-icon {
        margin-right: 0.25rem;
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    `,
  ],
})
export class NavbarComponent {
  readonly #uiStateService = inject(UiStateService);

  isDarkMode = signal<boolean>(true);

  get screenSize() {
    return this.#uiStateService.$screenSize;
  }

  onScreenSizeChange(event: MatButtonToggleChange) {
    this.#uiStateService.setScreenSize(event.value);
  }

  toggleTheme() {
    this.isDarkMode.update((value) => !value);
  }
}
