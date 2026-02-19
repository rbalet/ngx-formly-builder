# Example: Using ngx-formly-builder Library

This example shows how to use the ngx-formly-builder library in your Angular application.

## Installation

```bash
npm install ngx-formly-builder
npm install @angular/animations @angular/cdk @angular/material
npm install @ngx-formly/core @ngx-formly/material
npm install ngx-markdown marked prismjs
```

## Configuration

### app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFormlyBuilder } from 'ngx-formly-builder';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideFormlyBuilder(),
  ],
};
```

### index.html

Add Material Symbols font:

```html
<head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
</head>
```

### angular.json

Add required styles and scripts:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css",
              "node_modules/prismjs/themes/prism-okaidia.css",
              "src/styles.scss"
            ],
            "scripts": [
              "node_modules/prismjs/prism.js"
            ]
          }
        }
      }
    }
  }
}
```

## Basic Usage

### app.component.ts

```typescript
import { Component } from '@angular/core';
import { FormlyBuilder } from 'ngx-formly-builder';

@Component({
  selector: 'app-root',
  imports: [FormlyBuilder],
  template: `
    <formly-builder></formly-builder>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {}
```

## Custom Field Groups

### app.component.ts

```typescript
import { Component } from '@angular/core';
import { FormlyBuilder, FieldGroup } from 'ngx-formly-builder';

@Component({
  selector: 'app-root',
  imports: [FormlyBuilder],
  template: `
    <formly-builder [fieldGroups]="customFieldGroups"></formly-builder>
  `,
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
      category: 'Basic Inputs',
      fields: [
        {
          type: 'input',
          label: 'Text Field',
          icon: 'input',
          description: 'Simple text input'
        },
        {
          type: 'email',
          label: 'Email Field',
          icon: 'email',
          description: 'Email input with validation'
        },
        {
          type: 'textarea',
          label: 'Text Area',
          icon: 'description',
          description: 'Multi-line text input'
        }
      ]
    },
    {
      category: 'Selection',
      fields: [
        {
          type: 'select',
          label: 'Dropdown',
          icon: 'list',
          description: 'Dropdown selection'
        },
        {
          type: 'checkbox',
          label: 'Checkbox',
          icon: 'check_box',
          description: 'Single checkbox'
        },
        {
          type: 'radio',
          label: 'Radio Buttons',
          icon: 'radio_button_checked',
          description: 'Radio button group'
        }
      ]
    },
    {
      category: 'Advanced',
      fields: [
        {
          type: 'datepicker',
          label: 'Date Picker',
          icon: 'calendar_today',
          description: 'Select a date'
        },
        {
          type: 'markdown',
          label: 'Rich Text',
          icon: 'article',
          description: 'Markdown editor'
        }
      ]
    }
  ];
}
```

## Available Field Types

The library supports the following field types out of the box:

### Input Fields
- `input` - Text input
- `textarea` - Multi-line text
- `number` - Numeric input
- `email` - Email with validation
- `password` - Password input
- `telephone` - Phone number
- `url` - Website URL

### Selection Fields
- `select` - Dropdown select
- `checkbox` - Single checkbox
- `multicheckbox` - Multiple checkboxes
- `radio` - Radio button group
- `toggle` - Toggle switch

### Date & Time
- `datepicker` - Date picker

### Typography
- `markdown` - Rich text editor with markdown support

## Features

When you use the FormlyBuilder component, you get:

1. **Field Palette** (left panel)
   - Browse and select field types
   - Drag and drop fields into the form

2. **Form Preview** (center panel)
   - Live preview of your form
   - Responsive width modes (sm, md, lg)
   - Drag to reorder fields
   - Click to select and edit fields

3. **Properties Panel** (right panel)
   - Edit field properties
   - Configure validation rules
   - Set field options
   - View field configuration JSON

4. **Toolbar**
   - Toggle preview mode
   - Change responsive width
   - Export/import form JSON
   - Switch theme (light/dark)

## Customization

### Using Only Specific Field Types

```typescript
customFieldGroups: FieldGroup[] = [
  {
    category: 'Contact Form',
    fields: [
      {
        type: 'input',
        label: 'Name',
        icon: 'person',
        description: 'Full name'
      },
      {
        type: 'email',
        label: 'Email',
        icon: 'email',
        description: 'Email address'
      },
      {
        type: 'textarea',
        label: 'Message',
        icon: 'message',
        description: 'Your message'
      }
    ]
  }
];
```

### Material Icons

You can use any Material Symbol icon. Browse available icons at:
https://fonts.google.com/icons

## TypeScript Types

```typescript
import { FieldGroup, FieldType } from 'ngx-formly-builder';

interface FieldType {
  type: string;        // Formly field type
  label: string;       // Display label
  icon: string;        // Material Symbol icon name
  description: string; // Field description
}

interface FieldGroup {
  category: string;    // Group category name
  fields: FieldType[]; // Array of field types
}
```

## Best Practices

1. **Always provide animations**: The library requires Angular animations
   ```typescript
   provideAnimationsAsync()
   ```

2. **Include Material Icons font**: Required for the UI icons
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
   ```

3. **Set proper container height**: The component needs a defined height
   ```css
   :host {
     display: block;
     height: 100vh;
   }
   ```

4. **Use semantic versioning**: Lock to a specific version to avoid breaking changes
   ```json
   "ngx-formly-builder": "^0.0.1"
   ```

## Troubleshooting

### Library doesn't display correctly

Make sure you've:
1. Added `provideAnimationsAsync()` to providers
2. Included Material theme CSS
3. Added Material Symbols font link
4. Set a height on the host element

### Icons not showing

Add the Material Symbols font:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
```

### Formly errors

Ensure you've called `provideFormlyBuilder()` which configures formly automatically.

## More Information

- Library README: [projects/ngx-formly-builder/README.md](../projects/ngx-formly-builder/README.md)
- Publishing Guide: [PUBLISHING.md](../PUBLISHING.md)
- ngx-formly docs: https://formly.dev
- Angular Material: https://material.angular.io
