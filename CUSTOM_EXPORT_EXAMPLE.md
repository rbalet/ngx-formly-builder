# Custom Export Service Example

This document demonstrates how to create a custom export service for ngx-formly-builder.

**Note**: The `EXPORT_SERVICE` injection token has a default factory that automatically provides the `ExportService` class. You only need to provide your custom implementation if you want to override the default JSON export behavior.

## Basic Example: YAML Export

```typescript
import { Injectable } from '@angular/core';
import { ExportService, EXPORT_SERVICE, provideFormlyBuilder } from 'ngx-formly-builder';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@Injectable()
export class YamlExportService extends ExportService {
  override export(data: unknown, filename: string = 'form-settings'): void {
    // Convert data to YAML string
    const yamlString = this.convertToYaml(data);
    
    // Create a Blob from the YAML string
    const blob = new Blob([yamlString], { type: 'text/yaml' });
    
    // Create a temporary anchor element to trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.yaml`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  private convertToYaml(data: unknown): string {
    // Simple YAML conversion (use a proper YAML library in production)
    return JSON.stringify(data, null, 2)
      .replace(/"/g, '')
      .replace(/,/g, '')
      .replace(/\{/g, '')
      .replace(/\}/g, '');
  }
}

// In your app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideFormlyBuilder(),
    { provide: EXPORT_SERVICE, useClass: YamlExportService },
  ],
};
```

## Advanced Example: API Export

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExportService, EXPORT_SERVICE } from 'ngx-formly-builder';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiExportService extends ExportService {
  readonly #http = inject(HttpClient);
  
  override async export(data: unknown, filename: string = 'form-settings'): Promise<void> {
    try {
      // Send data to your API
      const response = await lastValueFrom(
        this.#http.post('https://your-api.com/forms', {
          name: filename,
          config: data,
        })
      );
      
      console.log('Form saved to API:', response);
      
      // Optionally, also download locally
      super.export(data, filename);
    } catch (error) {
      console.error('Failed to save form to API:', error);
      
      // Fallback to local download
      super.export(data, filename);
    }
  }
}

// In your app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
    provideFormlyBuilder(),
    { provide: EXPORT_SERVICE, useClass: ApiExportService },
  ],
};
```

## Example: Custom Format with User Notification

```typescript
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExportService, EXPORT_SERVICE } from 'ngx-formly-builder';

@Injectable()
export class XmlExportService extends ExportService {
  readonly #snackBar = inject(MatSnackBar);
  
  override export(data: unknown, filename: string = 'form-settings'): void {
    try {
      // Convert to XML
      const xmlString = this.convertToXml(data);
      
      // Create blob and download
      const blob = new Blob([xmlString], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.xml`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success notification
      this.#snackBar.open('Form exported as XML successfully!', 'Close', {
        duration: 3000,
      });
    } catch (error) {
      // Show error notification
      this.#snackBar.open('Failed to export form', 'Close', {
        duration: 3000,
      });
      console.error('Export error:', error);
    }
  }
  
  private convertToXml(data: unknown): string {
    // Simple XML conversion (use a proper XML library in production)
    return `<?xml version="1.0" encoding="UTF-8"?>
<form>
  <config>${JSON.stringify(data, null, 2)}</config>
</form>`;
  }
}

// In your app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideFormlyBuilder(),
    { provide: EXPORT_SERVICE, useClass: XmlExportService },
  ],
};
```

## Key Points

1. **Extend the ExportService class** - Your custom service should extend `ExportService` to maintain compatibility
2. **Override the export method** - Implement your custom export logic
3. **Provide via EXPORT_SERVICE token** - Use the injection token to replace the default implementation
4. **Provide after provideFormlyBuilder()** - Ensure your custom service is provided after the library configuration to override the default
5. **Use super.export()** - You can call the parent implementation as a fallback
6. **Default factory** - The `EXPORT_SERVICE` token has a factory that automatically provides `ExportService`, so no explicit configuration is needed unless overriding

## Testing Your Custom Export Service

```typescript
import { TestBed } from '@angular/core/testing';
import { ExportService, EXPORT_SERVICE } from 'ngx-formly-builder';
import { YamlExportService } from './yaml-export.service';

describe('YamlExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: EXPORT_SERVICE, useClass: YamlExportService },
      ],
    });
    service = TestBed.inject(EXPORT_SERVICE);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of YamlExportService', () => {
    expect(service).toBeInstanceOf(YamlExportService);
  });
});
```
