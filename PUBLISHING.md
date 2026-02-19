# Publishing the ngx-formly-builder Library to npm

This guide explains how to publish the ngx-formly-builder library to npm.

## Prerequisites

1. You must have an npm account. If you don't have one, create one at [npmjs.com](https://www.npmjs.com/signup)
2. You must be logged in to npm in your terminal:
   ```bash
   npm login
   ```

## Build the Library

First, build the library:

```bash
npm run build:lib
```

This will create the library package in `dist/ngx-formly-builder/`.

## Verify the Package

Before publishing, verify the package contents:

```bash
cd dist/ngx-formly-builder
ls -la
```

You should see:
- `package.json` - Package metadata
- `README.md` - Library documentation
- `fesm2022/` - ES modules
- `types/` - TypeScript definitions

## Test the Package Locally (Optional)

You can test the package locally before publishing:

```bash
# From the dist/ngx-formly-builder directory
npm pack
```

This creates a `.tgz` file that you can install in another project:

```bash
# In another Angular project
npm install /path/to/ngx-formly-builder-0.0.1.tgz
```

## Publish to npm

### For First Release

```bash
cd dist/ngx-formly-builder
npm publish
```

### For Scoped Package (if using organization)

```bash
cd dist/ngx-formly-builder
npm publish --access public
```

## Version Management

Before each new release:

1. Update the version in `projects/ngx-formly-builder/package.json`:
   ```json
   {
     "version": "0.1.0"
   }
   ```

2. Follow semantic versioning:
   - **Patch** (0.0.x): Bug fixes
   - **Minor** (0.x.0): New features (backwards compatible)
   - **Major** (x.0.0): Breaking changes

3. Rebuild and republish:
   ```bash
   npm run build:lib
   cd dist/ngx-formly-builder
   npm publish
   ```

## Automated Publishing (Future)

Consider setting up GitHub Actions for automated publishing:

1. Create `.github/workflows/publish.yml`
2. Configure npm token in GitHub Secrets
3. Trigger on version tags (e.g., `v0.1.0`)

## After Publishing

1. Verify on [npmjs.com](https://www.npmjs.com/package/ngx-formly-builder)
2. Test installation in a fresh project:
   ```bash
   npm install ngx-formly-builder
   ```
3. Update GitHub repository with release notes

## Troubleshooting

### Permission Denied

If you get a permission error, ensure you're logged in and have rights to publish:
```bash
npm whoami
```

### Package Name Taken

If the package name is taken, you can:
1. Choose a different name
2. Use a scoped package: `@your-org/ngx-formly-builder`

### Version Already Published

You cannot republish the same version. Update the version number in `package.json` first.

## Support

For issues or questions:
- GitHub Issues: https://github.com/rbalet/ngx-formly-builder/issues
- npm Package: https://www.npmjs.com/package/ngx-formly-builder
