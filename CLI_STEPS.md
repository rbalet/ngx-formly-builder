# CLI Steps to Bootstrap NGX Formly Builder

This document outlines the exact CLI commands used to bootstrap the Angular v21 app with ngx-formly form builder.

## 1. Create Angular v21 Application

```bash
# Create new Angular 21 app with specific configurations
npx @angular/cli@21 new formly-app \
  --skip-git=true \
  --package-manager=npm \
  --style=css \
  --routing=false \
  --ssr=false \
  --standalone=true \
  --skip-install=true
```

## 2. Install Dependencies

```bash
cd formly-app

# Install base dependencies
npm install

# Install ngx-formly and Bootstrap
npm install @ngx-formly/core @ngx-formly/bootstrap bootstrap @popperjs/core

# Install development tools
npm install --save-dev \
  @commitlint/cli \
  @commitlint/config-conventional \
  husky \
  eslint@^9.0.0 \
  prettier \
  eslint-config-prettier \
  typescript-eslint
```

## 3. Configure Angular

### Update `angular.json`
Add Bootstrap CSS to styles array:
```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
]
```

### Update `src/app/app.config.ts`
```typescript
import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideFormlyCore({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
    }),
  ],
};
```

### Update `package.json`
Add type and scripts:
```json
{
  "type": "module",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "eslint \"src/**/*.{ts,html}\"",
    "lint:fix": "eslint \"src/**/*.{ts,html}\" --fix",
    "format": "prettier --write \"src/**/*.{ts,html,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,css,json}\"",
    "prepare": "husky"
  }
}
```

## 4. Setup Code Quality Tools

### Create `commitlint.config.js`
```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'build',
        'ci'
      ]
    ]
  }
};
```

### Create `.husky/commit-msg`
```bash
mkdir -p .husky
cat > .husky/commit-msg << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit ${1}
EOF
chmod +x .husky/commit-msg
```

### Create `eslint.config.js`
```javascript
import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: ['dist/**', 'node_modules/**'],
  files: ['**/*.ts'],
  extends: [
    ...tseslint.configs.recommended,
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
});
```

## 5. Create Component Structure

```bash
# Create component directories
mkdir -p src/app/components/{field-palette,form-preview,properties-panel}
```

### Create components (see source files):
- `src/app/components/field-palette/field-palette.component.ts`
- `src/app/components/form-preview/form-preview.component.ts`
- `src/app/components/properties-panel/properties-panel.component.ts`

### Update main app component:
- `src/app/app.ts`
- `src/app/app.html`
- `src/app/app.css`

### Update global styles:
- `src/styles.css`

## 6. Verify Everything Works

```bash
# Run linting
npm run lint

# Run formatting
npm run format

# Check formatting
npm run format:check

# Build the application
npm run build

# Start development server
npm start
```

## 7. Test Conventional Commits

```bash
# This should succeed
git commit -m "feat: add new feature"

# This should fail (invalid type)
git commit -m "invalid: bad commit message"
```

## 8. Access the Application

Open browser and navigate to:
```
http://localhost:4200/
```

## File Structure Created

```
ngx-formly-builder/
├── .editorconfig
├── .gitignore
├── .husky/
│   └── commit-msg
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   ├── mcp.json
│   └── tasks.json
├── angular.json
├── commitlint.config.js
├── eslint.config.js
├── package.json
├── package-lock.json
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── field-palette/
│   │   │   │   └── field-palette.component.ts
│   │   │   ├── form-preview/
│   │   │   │   └── form-preview.component.ts
│   │   │   └── properties-panel/
│   │   │       └── properties-panel.component.ts
│   │   ├── app.config.ts
│   │   ├── app.css
│   │   ├── app.html
│   │   ├── app.spec.ts
│   │   └── app.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json
└── README.md
```

## Dependencies Installed

### Runtime Dependencies
- @angular/common: ^21.1.0
- @angular/compiler: ^21.1.0
- @angular/core: ^21.1.0
- @angular/forms: ^21.1.0
- @angular/platform-browser: ^21.1.0
- @angular/router: ^21.1.0
- @ngx-formly/bootstrap: ^7.1.0
- @ngx-formly/core: ^7.1.0
- @popperjs/core: ^2.11.8
- bootstrap: ^5.3.8
- rxjs: ~7.8.0
- tslib: ^2.3.0

### Development Dependencies
- @angular-eslint/*: ^21.2.0
- @angular/build: ^21.1.4
- @angular/cli: ^21.1.4
- @angular/compiler-cli: ^21.1.0
- @commitlint/cli: ^20.4.1
- @commitlint/config-conventional: ^20.4.1
- @typescript-eslint/*: ^8.55.0
- eslint: ^9.15.0
- eslint-config-prettier: ^10.1.8
- husky: ^9.1.7
- jsdom: ^27.1.0
- prettier: ^3.8.1
- typescript: ~5.9.2
- typescript-eslint: ^8.55.0
- vitest: ^4.0.8

## Verification Commands

```bash
# Check Angular version
ng version

# Check npm version
npm --version

# Check Node version
node --version

# Lint the code
npm run lint

# Format the code
npm run format

# Build for production
npm run build

# Run development server
npm start
```

## Notes

- The application uses **standalone components** (no NgModules)
- **Zoneless change detection** is enabled
- **Conventional commits** are enforced via husky hook
- **ESLint** and **Prettier** are configured and working
- The build produces a ~508KB bundle (slightly over the 500KB budget)
- Bootstrap 5 is used for styling
- ngx-formly handles dynamic form rendering
