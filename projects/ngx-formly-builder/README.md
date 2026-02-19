# NGX Formly Builder

A visual form builder library for Angular v21+ using ngx-formly. Provides a complete drag-and-drop interface for building forms with live preview and field configuration.

## Features

- **Visual Form Builder**: Drag-and-drop interface for creating forms
- **Live Preview**: See your form in real-time as you build it
- **Customizable Field Palette**: Define your own field groups or use the defaults
- **Properties Panel**: Configure field properties, validation, and options
- **Import/Export**: Save and load form configurations
- **Responsive Design**: Built with Angular Material for a modern look
- **TypeScript**: Fully typed for better development experience

## Installation

```bash
npm install ngx-formly-builder
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install @angular/animations @angular/cdk @angular/common @angular/core @angular/forms @angular/material
npm install @ngx-formly/core @ngx-formly/material
npm install ngx-markdown marked prismjs
```

## Usage

### 1. Import Required Modules and Configuration

In your `app.config.ts` (or main module), import and configure the library:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFormlyBuilder } from 'ngx-formly-builder';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideFormlyBuilder(),
    // ... other providers
  ],
};
```

### 2. Add Required Styles

Add the following to your `styles.scss`:

```scss
@import '@angular/material/prebuilt-themes/deeppurple-amber.css';
@import 'prismjs/themes/prism-okaidia.css';
```

Or in `angular.json`:

```json
"styles": [
  "node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css",
  "node_modules/prismjs/themes/prism-okaidia.css",
  "src/styles.scss"
],
"scripts": [
  "node_modules/prismjs/prism.js"
]
```

### 3. Use the Component

#### Basic Usage

```typescript
import { Component } from '@angular/core';
import { FormlyBuilder } from 'ngx-formly-builder';

@Component({
  selector: 'app-root',
  imports: [FormlyBuilder],
  template: '<formly-builder></formly-builder>',
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {}
```

#### Custom Field Groups

You can customize the field palette by providing your own field groups:

```typescript
import { Component } from '@angular/core';
import { FormlyBuilder, FieldGroup } from 'ngx-formly-builder';

@Component({
  selector: 'app-root',
  imports: [FormlyBuilder],
  template: '<formly-builder [fieldGroups]="customFieldGroups"></formly-builder>',
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  customFieldGroups: FieldGroup[] = [
    {
      category: 'Custom Fields',
      fields: [
        {
          type: 'input',
          label: 'Text Input',
          icon: 'input',
          description: 'A simple text input field'
        },
        {
          type: 'email',
          label: 'Email',
          icon: 'email',
          description: 'Email input with validation'
        }
      ]
    }
  ];
}
```

## API

### FormlyBuilder Component

#### Inputs

- `fieldGroups: FieldGroup[]` - Optional. Array of field groups to display in the palette. If not provided, defaults to the standard set of field types.

### provideFormlyBuilder()

Configuration function that provides all necessary services and configuration for the form builder.

**Returns**: `(Provider | EnvironmentProviders)[]`

### Types

#### FieldGroup

```typescript
interface FieldGroup {
  category: string;
  fields: FieldType[];
}
```

#### FieldType

```typescript
interface FieldType {
  type: string;
  label: string;
  icon: string;
  description: string;
}
```

## Default Field Types

When no custom `fieldGroups` are provided, the library includes:

- **Typography**: Text blocks with markdown support
- **Input Fields**: Text, Textarea, Number, Email, Password, Telephone, URL
- **Selection Fields**: Select, Checkbox, Multi-checkbox, Radio, Toggle
- **Date & Time**: Date picker

## Material Icons

This library uses Material Symbols Outlined. Make sure to include the following in your `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
```

## Development

To build the library:

```bash
npm run build ngx-formly-builder
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

Built with ❤️ using Angular and ngx-formly
