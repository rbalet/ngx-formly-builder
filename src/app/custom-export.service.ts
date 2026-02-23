import { Injectable } from '@angular/core';

/**
 * Service responsible for exporting form builder data
 * This service can be extended or replaced to support different export formats
 */
@Injectable({
  providedIn: 'root',
})
export class CustomExportService {
  /**
   * Downloads data as a JSON file
   * @param data - The data to export
   * @param filename - The name of the file (without extension)
   */
  export(data: unknown, filename: string = 'form-settings'): void {
    console.info('Exported from custom export service:', data);
    // Convert data to JSON string with formatting
    const jsonString = JSON.stringify(data, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a temporary anchor element to trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
