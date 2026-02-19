import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { OpenTemplateDialogComponent } from '@components/open-template-dialog/open-template-dialog.component';
import { PREVIEW_MODE, SCREEN_SIZE } from '@core/token';
import { ExportService } from '@services/export.service';
import { FormBuilderService } from '@services/form-builder.service';
import { ImportService } from '@services/import.service';
import { ColorScheme, ThemeService } from '@services/theme.service';
import { Template } from 'src/app/models/template.model';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, MatButtonModule, MatMenuModule, MatButtonToggleModule, MatDividerModule],
  template: `
    <header class="navbar">
      <!-- Left Section -->
      <div class="navbar-left">
        <mat-icon class="logo-icon">grid_view</mat-icon>
        <h1 class="app-title">Formly Builder</h1>
        <span class="alpha-badge">Alpha</span>
      </div>

      <!-- Center Section -->
      <div class="navbar-center">
        @if (!$previewMode()) {
          <div class="menu-items">
            <button mat-button class="menu-item" [matMenuTriggerFor]="fileMenu">File</button>
            <mat-menu #fileMenu="matMenu">
              <button mat-menu-item (click)="onUpload()">
                <mat-icon>upload_file</mat-icon>
                <span>Upload</span>
              </button>
              <button mat-menu-item (click)="onOpenTemplate()">
                <mat-icon>folder_open</mat-icon>
                <span>Open Template</span>
              </button>
            </mat-menu>
            <button mat-button class="menu-item" [matMenuTriggerFor]="editMenu">Edit</button>
            <mat-menu #editMenu="matMenu">
              <button mat-menu-item [disabled]="!formBuilderService.$canUndo()" (click)="onUndo()">
                <mat-icon>undo</mat-icon>
                <span>Undo</span>
              </button>
              <button mat-menu-item [disabled]="!formBuilderService.$canRedo()" (click)="onRedo()">
                <mat-icon>redo</mat-icon>
                <span>Redo</span>
              </button>
              <mat-divider></mat-divider>
              <button
                mat-menu-item
                [disabled]="!formBuilderService.$selectedField()"
                (click)="onDuplicate()"
              >
                <mat-icon>content_copy</mat-icon>
                <span>Duplicate</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="onClearForm()">
                <mat-icon>delete</mat-icon>
                <span>Clear Form</span>
              </button>
            </mat-menu>
            <!-- <button mat-button class="menu-item">View</button>
            <button mat-button class="menu-item">Help</button> -->
          </div>
        }

        <div class="navbar-controls">
          @if (!$previewMode()) {
            <div class="left-controls">
              <button
                mat-icon-button
                title="Undo"
                [disabled]="!formBuilderService.$canUndo()"
                (click)="onUndo()"
              >
                <mat-icon>undo</mat-icon>
              </button>
              <button
                mat-icon-button
                title="Redo"
                [disabled]="!formBuilderService.$canRedo()"
                (click)="onRedo()"
              >
                <mat-icon>redo</mat-icon>
              </button>
            </div>
          }

          <div class="right-controls">
            <mat-button-toggle-group
              [value]="$screenSize()"
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
              [matMenuTriggerFor]="themeMenu"
              [title]="'Color scheme: ' + colorScheme()"
            >
              <mat-icon>{{ themeIcon() }}</mat-icon>
            </button>
            <mat-menu #themeMenu="matMenu">
              <button mat-menu-item (click)="setColorScheme('light')">
                <mat-icon>light_mode</mat-icon>
                <span>Light</span>
              </button>
              <button mat-menu-item (click)="setColorScheme('dark')">
                <mat-icon>dark_mode</mat-icon>
                <span>Dark</span>
              </button>
              <button mat-menu-item (click)="setColorScheme('system')">
                <mat-icon>computer</mat-icon>
                <span>System</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div class="navbar-right">
        @if (!$previewMode()) {
          <button mat-button class="preview-button" (click)="togglePreviewMode()">
            <mat-icon>play_arrow</mat-icon>
            Preview
          </button>
          <button mat-raised-button color="primary" class="export-button" (click)="onExport()">
            <mat-icon>open_in_new</mat-icon>
            Export
          </button>
        } @else {
          <button mat-stroked-button class="exit-preview-button" (click)="togglePreviewMode()">
            <mat-icon>close</mat-icon>
            Exit Preview
          </button>
        }
      </div>
    </header>
  `,
  styles: [
    `
      .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--mat-sys-outline-variant);
        background-color: var(--mat-sys-surface-container-lowest);
      }

      .navbar-left {
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 25%;
        min-width: 250px;
        box-sizing: border-box;
        border-right: 1px solid var(--mat-sys-outline-variant);
        height: 64px;
        position: relative;

        .logo-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        .app-title {
          margin: 0;
          white-space: nowrap;
        }

        .alpha-badge {
          background-color: #444;
          color: #fff;
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 500;
          text-transform: uppercase;
          border-radius: 0 0 0 3px;
          position: absolute;
          top: 0;
          right: 0;
        }
      }

      .navbar-center {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0 1rem;
        flex: 1;
        justify-content: space-between;
        flex-grow: 1;
        height: 64px;
      }

      .navbar-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 25%;
        min-width: 250px;
        justify-content: flex-end;
        padding: 0.5rem 1rem;
        box-sizing: border-box;
        border-left: 1px solid var(--mat-sys-outline-variant);
        height: 64px;
      }

      .menu-items {
        display: flex;
        gap: 0rem;
      }

      .menu-item {
        font-size: 0.813rem;
        min-width: auto;
        padding: 0 0.75rem;
      }

      .navbar-controls {
        display: flex;
        align-items: center;
        gap: 0.125rem;

        .right-controls {
          display: flex;
          align-items: center;
        }

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      .screen-size-toggle {
        height: 32px;
        margin-left: 0.25rem;
      }

      .preview-button {
        font-size: 0.875rem;

        mat-icon {
          margin-right: 0.25rem;
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      .export-button {
        font-size: 0.875rem;

        mat-icon {
          margin-right: 0.25rem;
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      .exit-preview-button {
        font-size: 0.875rem;

        mat-icon {
          margin-right: 0.25rem;
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    `,
  ],
})
export class NavbarComponent {
  readonly formBuilderService = inject(FormBuilderService);
  readonly themeService = inject(ThemeService);
  readonly exportService = inject(ExportService);
  readonly importService = inject(ImportService);
  readonly dialog = inject(MatDialog);
  readonly $screenSize = inject(SCREEN_SIZE);
  readonly $previewMode = inject(PREVIEW_MODE);

  // Expose color scheme from theme service
  get colorScheme() {
    return this.themeService.colorScheme;
  }

  // Compute the icon to display based on current color scheme
  themeIcon = computed(() => {
    const scheme = this.themeService.colorScheme();
    switch (scheme) {
      case 'light':
        return 'light_mode';
      case 'dark':
        return 'dark_mode';
      case 'system':
        return 'computer';
    }
  });

  onScreenSizeChange(event: MatButtonToggleChange) {
    this.$screenSize.set(event.value);
  }

  setColorScheme(scheme: ColorScheme) {
    this.themeService.setColorScheme(scheme);
  }

  onDuplicate() {
    const selectedField = this.formBuilderService.$selectedField();
    if (selectedField) {
      this.formBuilderService.duplicateField(selectedField);
    }
  }

  onExport() {
    const fields = this.formBuilderService.$fields();
    this.exportService.export(fields, 'form-settings');
  }

  togglePreviewMode() {
    this.$previewMode.set(!this.$previewMode());
  }

  onUndo() {
    this.formBuilderService.undo();
  }

  onRedo() {
    this.formBuilderService.redo();
  }

  async onUpload() {
    const fields = await this.importService.import();
    if (fields) {
      this.formBuilderService.importFields(fields);
    }
  }

  onOpenTemplate() {
    const dialogRef = this.dialog.open(OpenTemplateDialogComponent, {
      width: '1200px',
      maxWidth: '90vw',
      height: '700px',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((template: Template | null) => {
      if (template) {
        this.formBuilderService.importFields(template.fields);
      }
    });
  }

  onClearForm() {
    this.formBuilderService.clearForm();
  }
}
