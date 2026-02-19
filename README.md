# NGX Formly Builder

A visual form builder for arranging ngx-formly fields, inspired by shadcn-builder. Built with Angular v21 (standalone, zoneless, no NgModules).

## Demo

[Try it on StackBlitz](https://stackblitz.com/~/github.com/rbalet/ngx-formly-builder)

## Features

- **3-Column Layout**: Field palette | Formly preview | Properties panel
- **Drag-and-Drop** (concept): Select field types from the palette to add to the form
- **Live Preview**: See form changes in real-time with Formly
- **Model JSON Display**: View the current form model as JSON
- **Field Types**: Input, Textarea, Select (with more to come)
- **Conventional Commits**: Enforced via commitlint and husky
- **Code Quality**: ESLint and Prettier configured

## Technology Stack

- Angular v21 (standalone components, zoneless)
- ngx-formly v7 (form management)
- Bootstrap 5 (styling)
- TypeScript
- npm (package manager)
- Vitest (testing)

## Prerequisites

- Node.js (v18 or higher)
- npm v11.6.2 or higher

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Testing

```bash
npm test
```

Run unit tests using Vitest.

### Code Quality

#### Linting

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Fix linting errors automatically
```

#### Formatting

```bash
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

## Project Structure

```
ngx-formly-builder/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── field-palette/       # Left panel: field type selector
│   │   │   ├── form-preview/        # Center: Formly form preview
│   │   │   └── properties-panel/    # Right panel: field properties
│   │   ├── app.ts                   # Main app component
│   │   ├── app.html                 # Main app template
│   │   ├── app.css                  # Main app styles
│   │   └── app.config.ts            # App configuration (zoneless, providers)
│   ├── main.ts                      # Bootstrap file
│   ├── index.html                   # HTML entry point
│   └── styles.css                   # Global styles
├── .husky/                          # Git hooks
│   └── commit-msg                   # Commitlint hook
├── angular.json                     # Angular CLI configuration
├── commitlint.config.js             # Commitlint configuration
├── eslint.config.js                 # ESLint configuration
├── package.json                     # npm dependencies and scripts
└── tsconfig.json                    # TypeScript configuration
```

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). All commit messages must follow this format:

```
<type>(<scope>): <subject>
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes

Example:
```bash
git commit -m "feat(form-builder): add drag and drop support"
```

The commit-msg hook will validate your commit message format automatically.

## How It Works

1. **Field Palette** (left): Click on a field type to add it to the form
2. **Form Preview** (center): See your form in action with live data binding
3. **Properties Panel** (right): View the selected field's configuration as JSON

The form uses ngx-formly to dynamically render form fields based on configuration. The model JSON updates in real-time as you fill out the form.

## Future Enhancements

- Drag-and-drop field reordering
- Field property editing panel
- More field types (checkbox, radio, datepicker, etc.)
- Form validation rules editor
- Export/import form configuration
- Field grouping and sections
- Conditional field visibility

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feat/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Angular Documentation](https://angular.dev)
- [ngx-formly Documentation](https://formly.dev)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
