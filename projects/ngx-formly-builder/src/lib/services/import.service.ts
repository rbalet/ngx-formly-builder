import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Service responsible for importing form builder data
 * This service handles file selection and JSON parsing
 */
@Injectable({
  providedIn: 'root',
})
export class ImportService {
  /**
   * Opens a file picker to import JSON data
   * @returns Promise that resolves with parsed FormlyFieldConfig array, or null if cancelled
   */
  async import(): Promise<FormlyFieldConfig[] | null> {
    return new Promise((resolve) => {
      // Create a temporary file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json,.json';

      // Handle file selection
      input.onchange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) {
          resolve(null);
          return;
        }

        try {
          const reader = new FileReader();

          reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
              const text = e.target?.result as string;
              const data = JSON.parse(text) as FormlyFieldConfig[];

              // Basic validation - ensure it's an array
              if (!Array.isArray(data)) {
                console.error('Invalid file format: expected an array of FormlyFieldConfig');
                resolve(null);
                return;
              }

              resolve(data);
            } catch (error) {
              console.error('Error parsing JSON:', error);
              resolve(null);
            }
          };

          reader.onerror = () => {
            console.error('Error reading file');
            resolve(null);
          };

          reader.readAsText(file);
        } catch (error) {
          console.error('Error reading file:', error);
          resolve(null);
        }
      };

      // Handle cancel
      input.oncancel = () => {
        resolve(null);
      };

      // Trigger file picker
      input.click();
    });
  }
}
