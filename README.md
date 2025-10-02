# CoWrite Web

Modern React application for collaborative writing with authentication and rich text editing.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run preview` - Preview production build locally

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and fix issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### CI/CD

- `npm run ci` - Run all checks (type-check + lint + format:check)
- `npm run fix` - Fix all auto-fixable issues (lint:fix + format)

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Radix UI
- **Forms**: React Hook Form + Zod
- **API**: React Query (TanStack Query)
- **Editor**: TipTap
- **Routing**: React Router DOM
- **Code Quality**: ESLint + Prettier

## 📝 Features

- ✅ User authentication (login/register)
- ✅ Form validation with Zod
- ✅ Rich text editor with TipTap
- ✅ Responsive design with Tailwind CSS
- ✅ Dark mode support
- ✅ File system workspace management
- ✅ API integration with React Query
- ✅ JWT token management

## 🔧 Development Workflow

1. **Before committing**:

   ```bash
   npm run ci
   ```

2. **Auto-fix issues**:

   ```bash
   npm run fix
   ```

3. **Check types**:
   ```bash
   npm run type-check
   ```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
