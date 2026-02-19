import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Template, TemplateCategory } from '../../models/template.model';
import { TemplateService } from '../../services/template.service';

type ViewMode = 'categories' | 'templates';

@Component({
  selector: 'app-open-template-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    FormlyModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <mat-icon class="header-icon">folder_open</mat-icon>
        <h2 mat-dialog-title>Open Template</h2>
      </div>
      <button mat-icon-button (click)="close()" aria-label="Close dialog">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <div class="template-browser">
        @if ($viewMode() === 'categories') {
          <!-- Categories List View -->
          <div class="categories-view">
            <div class="categories-header">
              <div class="header-cell">Category</div>
              <div class="header-cell-count">Total Templates</div>
            </div>
            <mat-list class="categories-list">
              @for (category of categories; track category.id) {
                <mat-list-item
                  class="category-item"
                  (click)="selectCategory(category)"
                  [class.selected]="$selectedCategory()?.id === category.id"
                >
                  <mat-icon matListItemIcon class="category-icon">{{ category.icon }}</mat-icon>
                  <div matListItemTitle class="category-name">{{ category.name }}</div>
                  <div matListItemMeta class="category-count">{{ category.templates.length }}</div>
                </mat-list-item>
              }
            </mat-list>
          </div>
        } @else {
          <!-- Templates List View -->
          <div class="templates-view">
            <!-- Back navigation -->
            <div class="templates-header">
              <button mat-button class="back-button" (click)="backToCategories()">
                <mat-icon>arrow_back</mat-icon>
                <span>...</span>
              </button>
              <div class="header-cell">Name</div>
            </div>

            <div class="templates-content">
              <!-- Templates List -->
              <div class="templates-list-container">
                <mat-list class="templates-list">
                  @for (template of $selectedCategory()?.templates; track template.id) {
                    <mat-list-item
                      class="template-item"
                      (click)="selectTemplate(template)"
                      [class.selected]="$selectedTemplate()?.id === template.id"
                    >
                      <mat-icon matListItemIcon class="template-icon">description</mat-icon>
                      <div matListItemTitle class="template-name">{{ template.name }}</div>
                    </mat-list-item>
                  }
                </mat-list>
              </div>

              <!-- Template Preview -->
              <div class="template-preview">
                @if ($selectedTemplate(); as template) {
                  <div class="preview-content">
                    <div class="preview-header">
                      <h3>{{ template.name }}</h3>
                      @if (template.description) {
                        <p class="preview-description">{{ template.description }}</p>
                      }
                    </div>
                    <div class="preview-form">
                      <form [formGroup]="previewForm">
                        <formly-form
                          [form]="previewForm"
                          [fields]="template.fields"
                          [model]="previewModel"
                        ></formly-form>
                      </form>
                    </div>
                  </div>
                } @else {
                  <div class="preview-placeholder">
                    <mat-icon class="placeholder-icon">search</mat-icon>
                    <p>Select a template from the list to preview it</p>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!$selectedTemplate()"
        (click)="openTemplate()"
      >
        Open Template
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem 0.5rem;
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .header-icon {
        color: var(--mat-sys-on-surface-variant);
      }

      h2 {
        margin: 0;
      }

      mat-dialog-content {
        padding: 0;
        margin: 0;
        min-height: 400px;
        max-height: 600px;
        overflow: hidden;
      }

      .template-browser {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      /* Categories View */
      .categories-view {
        padding: 1rem;
      }

      .categories-header {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        margin-bottom: 0.5rem;
        font-weight: 500;
        font-size: 0.875rem;
        color: var(--mat-sys-on-surface-variant);
      }

      .header-cell-count {
        text-align: right;
        min-width: 120px;
      }

      .categories-list {
        padding: 0;
      }

      .category-item {
        cursor: pointer;
        border-radius: 8px;
        margin-bottom: 0.25rem;
        transition: background-color 0.2s;
        padding: 0.75rem 1rem;
        border: 1px solid transparent;
      }

      .category-item:hover {
        background-color: var(--mat-sys-surface-container-high);
      }

      .category-item.selected {
        background-color: var(--mat-sys-surface-container-highest);
        border-color: var(--mat-sys-outline);
      }

      .category-icon {
        color: var(--mat-sys-on-surface-variant);
        margin-right: 0.5rem;
      }

      .category-name {
        font-weight: 500;
      }

      .category-count {
        color: var(--mat-sys-on-surface-variant);
        font-size: 0.875rem;
        min-width: 120px;
        text-align: right;
      }

      /* Templates View */
      .templates-view {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .templates-header {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid var(--mat-sys-outline-variant);
        align-items: center;
        font-weight: 500;
        font-size: 0.875rem;
        color: var(--mat-sys-on-surface-variant);
      }

      .back-button {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        min-width: auto;
        padding: 0 0.5rem;
      }

      .templates-content {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        height: 100%;
        overflow: hidden;
      }

      .templates-list-container {
        border-right: 1px solid var(--mat-sys-outline-variant);
        overflow-y: auto;
        padding: 0.5rem;
      }

      .templates-list {
        padding: 0;
      }

      .template-item {
        cursor: pointer;
        border-radius: 8px;
        margin-bottom: 0.25rem;
        transition: background-color 0.2s;
        padding: 0.75rem 1rem;
        border: 1px solid transparent;
      }

      .template-item:hover {
        background-color: var(--mat-sys-surface-container-high);
      }

      .template-item.selected {
        background-color: var(--mat-sys-surface-container-highest);
        border-color: var(--mat-sys-outline);
      }

      .template-icon {
        color: var(--mat-sys-on-surface-variant);
        margin-right: 0.5rem;
      }

      .template-name {
        font-weight: 500;
      }

      .template-preview {
        overflow-y: auto;
        padding: 1rem;
      }

      .preview-content {
        height: 100%;
      }

      .preview-header {
        margin-bottom: 1.5rem;
      }

      .preview-header h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        font-weight: 500;
      }

      .preview-description {
        margin: 0;
        color: var(--mat-sys-on-surface-variant);
        font-size: 0.875rem;
      }

      .preview-form {
        /* FormlyForm styles are handled by ngx-formly */
      }

      .preview-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--mat-sys-on-surface-variant);
        text-align: center;
      }

      .placeholder-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        opacity: 0.3;
        margin-bottom: 1rem;
      }

      mat-dialog-actions {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--mat-sys-outline-variant);
      }
    `,
  ],
})
export class OpenTemplateDialogComponent {
  readonly #dialogRef = inject(MatDialogRef<OpenTemplateDialogComponent>);
  readonly #templateService = inject(TemplateService);

  readonly categories = this.#templateService.getCategories();

  readonly $viewMode = signal<ViewMode>('categories');
  readonly $selectedCategory = signal<TemplateCategory | null>(null);
  readonly $selectedTemplate = signal<Template | null>(null);

  readonly previewForm = new FormGroup({});
  readonly previewModel = {};

  selectCategory(category: TemplateCategory): void {
    this.$selectedCategory.set(category);
    this.$viewMode.set('templates');
    this.$selectedTemplate.set(null);
  }

  backToCategories(): void {
    this.$viewMode.set('categories');
    this.$selectedCategory.set(null);
    this.$selectedTemplate.set(null);
  }

  selectTemplate(template: Template): void {
    this.$selectedTemplate.set(template);
  }

  openTemplate(): void {
    const template = this.$selectedTemplate();
    if (template) {
      this.#dialogRef.close(template);
    }
  }

  close(): void {
    this.#dialogRef.close(null);
  }
}
