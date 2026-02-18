import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
          <mat-button-toggle-group [value]="screenSize()" (change)="onScreenSizeChange($event)" class="screen-size-toggle">
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
          <button mat-icon-button (click)="toggleTheme()" [title]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'">
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
        background-color: #1a1a1a;
        color: #ffffff;
        border-bottom: 1px solid #333;
        height: 56px;
      }

      .navbar-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .logo-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .title-section {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .app-title {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 500;
        white-space: nowrap;
      }

      .alpha-badge {
        background-color: #444;
        color: #ccc;
        padding: 0.125rem 0.375rem;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 500;
      }

      .navbar-center {
        display: flex;
        align-items: center;
        gap: 2rem;
        flex: 1;
        justify-content: center;
      }

      .menu-items {
        display: flex;
        gap: 0.25rem;
      }

      .menu-item {
        color: #ffffff;
        font-size: 0.875rem;
      }

      .navbar-controls {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .navbar-controls button {
        color: #ffffff;
      }

      .screen-size-toggle {
        height: 36px;
      }

      .navbar-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .preview-button {
        color: #ffffff;
      }

      .preview-button mat-icon {
        margin-right: 0.25rem;
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
  screenSize = signal<'sm' | 'md' | 'lg'>('lg');
  isDarkMode = signal<boolean>(true);

  onScreenSizeChange(event: any) {
    this.screenSize.set(event.value);
  }

  toggleTheme() {
    this.isDarkMode.update(value => !value);
  }
}
