import { Component, inject, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface QuickStartTemplate {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'formly-builder-quick-start',
  imports: [MatIconModule],
  template: `
    <div class="quick-start-container">
      <div class="quick-start-content">
        <h2 class="quick-start-title">Quick Start</h2>
        <p class="quick-start-subtitle">
          Choose from common form types to get started quickly
        </p>

        <div class="template-list">
          @for (template of templates; track template.id) {
            <button
              class="template-item"
              (click)="onTemplateClick(template.id)"
            >
              <mat-icon class="template-icon">{{ template.icon }}</mat-icon>
              <span class="template-name">{{ template.name }}</span>
              <mat-icon class="arrow-icon">chevron_right</mat-icon>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .quick-start-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        padding: 2rem;
      }

      .quick-start-content {
        max-width: 400px;
        width: 100%;
        background-color: var(--mat-sys-surface-container);
        border-radius: var(--mat-sys-corner-large);
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .quick-start-title {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
        color: var(--mat-sys-on-surface);
      }

      .quick-start-subtitle {
        margin: 0 0 2rem 0;
        font-size: 0.875rem;
        text-align: center;
        color: var(--mat-sys-on-surface-variant);
        line-height: 1.5;
      }

      .template-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .template-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: var(--mat-sys-surface-container-high);
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: var(--mat-sys-corner-medium);
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
        font-size: 1rem;
        color: var(--mat-sys-on-surface);
        font-family: inherit;
        width: 100%;

        &:hover {
          background-color: var(--mat-sys-surface-container-highest);
          border-color: var(--mat-sys-outline);
          transform: translateX(4px);
        }

        &:active {
          transform: translateX(2px);
        }
      }

      .template-icon {
        flex-shrink: 0;
        color: var(--mat-sys-on-surface-variant);
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .template-name {
        flex: 1;
        font-weight: 500;
      }

      .arrow-icon {
        flex-shrink: 0;
        color: var(--mat-sys-on-surface-variant);
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    `,
  ],
})
export class QuickStartComponent {
  templateSelected = output<string>();

  readonly templates: QuickStartTemplate[] = [
    { id: 'job-application', name: 'Job Application', icon: 'description' },
    { id: 'vehicle-reservation', name: 'Vehicle Reservation', icon: 'description' },
    { id: 'contact-us', name: 'Contact Us', icon: 'description' },
    { id: 'update-profile', name: 'Profile Update', icon: 'description' },
  ];

  onTemplateClick(templateId: string): void {
    this.templateSelected.emit(templateId);
  }
}
