# 📁 Folder Structure Documentation

**Project:** NextGen Admin Dashboard  
**Framework:** Vue.js 3 + Vite  
**Last Updated:** January 21, 2026

---

## 🗂️ Root Directory

```
nextgen-admin/
├── .editorconfig           # Editor configuration for consistent code style
├── .env                    # Environment variables (local)
├── .env.example            # Example environment variables template
├── .gitignore              # Git ignore rules
├── .prettierrc.json        # Prettier code formatter configuration
├── eslint.config.js        # ESLint linting rules
├── jsconfig.json           # JavaScript configuration for IDE
├── vite.config.js          # Vite build tool configuration
├── package.json            # Project dependencies and scripts
├── index.html              # HTML entry point
├── README.md               # Project documentation
├── folder_Structure.md     # This file - folder structure documentation
├── public/                 # Static assets (not processed by Vite)
├── src/                    # Source code (main application)
└── node_modules/           # Installed dependencies
```

### 📋 Root Files Purpose

| File               | Purpose                                                                    |
| ------------------ | -------------------------------------------------------------------------- |
| `.editorconfig`    | Ensures consistent coding styles across different editors/IDEs             |
| `.env`             | Stores environment-specific variables (API URLs, keys) - **Not committed** |
| `.env.example`     | Template for environment variables - safe to commit                        |
| `.prettierrc.json` | Code formatting rules (indentation, quotes, etc.)                          |
| `eslint.config.js` | JavaScript/Vue linting rules for code quality                              |
| `jsconfig.json`    | Path aliases and JavaScript config for better IDE support                  |
| `vite.config.js`   | Build configuration, plugins, dev server settings                          |
| `package.json`     | Dependencies, scripts (dev, build, lint), project metadata                 |
| `index.html`       | Single-page application entry point, loads Vue app                         |

---

## 📂 `/public` - Static Assets

```
public/
├── favicon.ico             # Browser tab icon
└── images/                 # Static images (logos, icons, etc.)
```

**Purpose:**  
Contains static files served as-is without processing. Files here are accessible via root URL path (e.g., `/images/logo.png`).

**Use for:**

- Favicon and app icons
- Static images that don't need optimization
- Files that need specific public URLs
- Third-party assets

---

## 🎨 `/src` - Source Code (Main Application)

```
src/
├── main.js                 # Application entry point
├── App.vue                 # Root Vue component
├── api/                    # API communication layer
├── assets/                 # Processed static assets (styles, images)
├── components/             # Reusable Vue components
├── composables/            # Vue composition functions (reusable logic)
├── layout/                 # Page layout components
├── router/                 # Vue Router configuration
├── stores/                 # Pinia state management stores
├── utils/                  # Utility functions and helpers
└── views/                  # Page-level components (route views)
```

---

### 📡 `/src/api` - API Layer

```
api/
└── api.js                  # Axios instance, API endpoints, HTTP methods
```

**Purpose:**  
Centralized API communication logic. Handles HTTP requests, authentication, error handling, and response formatting.

**Contains:**

- Axios instance configuration
- Base URL setup
- Request/response interceptors
- API endpoint functions (GET, POST, PUT, DELETE)
- Error handling middleware

**Example:**

```js
// api/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

export const getSkills = () => api.get('/skills')
export const createSkill = (data) => api.post('/skills', data)
```

---

### 🎨 `/src/assets` - Processed Assets

```
assets/
├── main.css                # Global styles, CSS variables
└── images/                 # Images processed by Vite (optimized)
```

**Purpose:**  
Assets that are imported in code and processed by Vite (optimization, bundling).

**Contains:**

- Global CSS files
- CSS variables and design tokens
- Images that need optimization
- Fonts

**Difference from `/public`:**

- Assets here are processed/optimized
- Use relative imports in components
- Better for images that need compression

---

### 🧩 `/src/components` - Reusable Components

```
components/
├── charts/                 # Chart components
│   ├── BarChart.vue
│   └── ProgressBarChart.vue
│
├── common/                 # Common/shared components
│   ├── Breadcrumbs.vue
│   ├── CrudPageTemplate.vue
│   ├── EmptyState.vue
│   ├── NoData.vue
│   └── PageHeader.vue
│
├── form/                   # Form-related components
│   └── BaseForm.vue
│
├── layout/                 # Layout components
│   ├── AppNavbar.vue
│   └── AppSidebar.vue
│
└── ui/                     # UI components
    ├── base/               # Primitive/base UI components
    └── (composite components)
```

#### 📊 `/src/components/charts`

**Purpose:** Reusable chart components for data visualization

**Components:**

- `BarChart.vue` - Bar chart for category distribution
- `ProgressBarChart.vue` - Progress bars for completion tracking

**Use cases:** Dashboard metrics, analytics, reports

---

#### 🔗 `/src/components/common`

**Purpose:** Shared components used across multiple features

| Component              | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `Breadcrumbs.vue`      | Navigation breadcrumb trail                     |
| `CrudPageTemplate.vue` | Template for CRUD pages (Skills, Schools, etc.) |
| `EmptyState.vue`       | Empty state with icon and message               |
| `NoData.vue`           | Simple "no data" message                        |
| `PageHeader.vue`       | Page title with action buttons                  |

**Use cases:** Repeated patterns across different pages

---

#### 📝 `/src/components/form`

**Purpose:** Form-specific components and wrappers

**Components:**

- `BaseForm.vue` - Form container with validation handling

**Use cases:** All forms (create, edit, filters)

---

#### 🏗️ `/src/components/layout`

**Purpose:** Main application layout components

| Component        | Purpose                                               |
| ---------------- | ----------------------------------------------------- |
| `AppNavbar.vue`  | Top navigation bar (search, notifications, user menu) |
| `AppSidebar.vue` | Side navigation menu                                  |

**Use cases:** Main dashboard layout structure

---

#### 🎨 `/src/components/ui`

**Purpose:** All UI elements and components

```
ui/
├── base/                   # Primitive building blocks
│   ├── BaseBadge.vue       # Status badges (Active, Pending)
│   ├── BaseButton.vue      # Button with variants and states
│   ├── BaseCard.vue        # Card container
│   ├── BaseInput.vue       # Text input field
│   ├── BaseModal.vue       # Modal dialog
│   ├── BasePagination.vue  # Pagination controls
│   ├── BaseSelect.vue      # Dropdown select
│   ├── BaseTable.vue       # Data table with actions
│   ├── BaseTextarea.vue    # Multi-line text input
│   ├── BaseToast.vue       # Toast notification
│   ├── BaseTooltip.vue     # Tooltip on hover
│   └── ConfirmDialog.vue   # Confirmation dialog
│
├── ActionButtons.vue       # View/Edit/Delete action buttons
├── ActivityItem.vue        # Recent activity list item
├── ChartCard.vue           # Card wrapper for charts
├── DetailView.vue          # Modal detail view
├── LoadingSpinner.vue      # Loading spinner indicator
├── QuickActionCard.vue     # Dashboard quick action card
├── StatCard.vue            # Dashboard statistics card
└── ToastContainer.vue      # Toast notification manager
```

##### 🔷 `/src/components/ui/base` - Base Components

**Purpose:** Primitive, reusable UI building blocks used throughout the app

**Characteristics:**

- Highly reusable
- Minimal business logic
- Accept props for customization
- Emit events for parent handling
- Styled with Bootstrap classes

**Examples:**

- `BaseButton.vue` - Buttons with variants (primary, danger, etc.)
- `BaseInput.vue` - Form inputs with validation
- `BaseModal.vue` - Modal dialogs
- `BaseTable.vue` - Data tables with sorting/actions

##### 🔶 Composite UI Components

**Purpose:** More complex components built from base components

**Examples:**

- `StatCard.vue` - Combines BaseCard + icon + stats
- `ActionButtons.vue` - Group of buttons for table actions
- `ToastContainer.vue` - Manages multiple toast notifications

---

### 🔧 `/src/composables` - Composition Functions

```
composables/
├── useConfirm.js           # Confirmation dialog logic
├── useRequiredValidation.js # Form validation logic
└── useToast.js             # Toast notification logic
```

**Purpose:**  
Reusable Vue 3 Composition API functions that encapsulate logic.

**Contains:**

- Shared reactive state
- Business logic
- Helper functions
- Side effects management

**Benefits:**

- Code reusability
- Separation of concerns
- Easier testing
- Better organization

**Example:**

```js
// composables/useToast.js
export function useToast() {
  const showSuccess = (message) => {
    /* ... */
  }
  const showError = (message) => {
    /* ... */
  }
  return { showSuccess, showError }
}

// Usage in component
const { showSuccess } = useToast()
showSuccess('Skill created!')
```

---

### 🎭 `/src/layout` - Layout Wrappers

```
layout/
└── DashboardLayout.vue     # Main dashboard layout wrapper
```

**Purpose:**  
Page layout templates that wrap route views.

**Contains:**

- Navbar + Sidebar + Content area structure
- Layout-specific logic (sidebar toggle, theme)
- Slot for page content

**Usage:**

```vue
<DashboardLayout>
  <router-view /> <!-- Page content goes here -->
</DashboardLayout>
```

---

### 🧭 `/src/router` - Vue Router Configuration

```
router/
└── index.js                # Route definitions and navigation guards
```

**Purpose:**  
Defines all application routes and navigation logic.

**Contains:**

- Route paths and components
- Route names and metadata
- Navigation guards (auth, permissions)
- Lazy loading configuration
- Redirect rules

**Example:**

```js
const routes = [
  { path: '/dashboard', component: DashboardView },
  { path: '/skills', component: SkillsView, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView },
]
```

---

### 🗄️ `/src/stores` - Pinia State Management

```
stores/
├── auth.js                 # Authentication state (user, token, login/logout)
├── counter.js              # Example counter store
└── theme.js                # Theme preferences (dark/light mode)
```

**Purpose:**  
Centralized state management using Pinia.

**Contains:**

- Global application state
- State mutations
- Async actions
- Getters (computed state)

**Use cases:**

- User authentication
- Global settings
- Shared data across components
- Theme/preferences

**Example:**

```js
// stores/auth.js
export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, token: null }),
  actions: {
    login(credentials) {
      /* ... */
    },
  },
})
```

---

### 🛠️ `/src/utils` - Utility Functions

```
utils/
└── (helper functions, formatters, validators)
```

**Purpose:**  
Pure utility functions that don't depend on Vue.

**Contains:**

- Date formatters
- String manipulation
- Data validators
- Constants
- Helper functions

**Examples:**

```js
export const formatDate = (date) => {
  /* ... */
}
export const truncateText = (text, length) => {
  /* ... */
}
export const API_BASE_URL = 'https://api.example.com'
```

**Difference from composables:**

- No Vue reactivity
- Pure JavaScript functions
- Easier to test
- Can be used outside Vue

---

### 📄 `/src/views` - Page Components

```
views/
├── DashboardView.vue       # Dashboard page
├── LoginView.vue           # Login page
├── NotFoundView.vue        # 404 error page
├── category/               # Category management pages
├── degree/                 # Degree management pages
├── profile/                # User profile pages
├── school/                 # School management pages
└── subject/                # Subject management pages
```

**Purpose:**  
Page-level components that correspond to routes.

**Characteristics:**

- One view per route
- Compose smaller components
- Handle page-specific logic
- Fetch data for the page
- Manage local page state

**Naming convention:** `[Feature]View.vue`

**Example structure:**

```
category/
├── CategoryListView.vue    # List all categories
├── CategoryCreateView.vue  # Create new category
└── CategoryEditView.vue    # Edit existing category
```

---

## 🎯 Component Architecture Guidelines

### When to use each folder:

#### Use `/src/components/ui/base/`

- Simple, reusable UI elements
- No business logic
- Used across multiple features
- Examples: buttons, inputs, cards

#### Use `/src/components/ui/`

- More complex UI components
- May contain some logic
- Composed of base components
- Examples: StatCard, ActionButtons

#### Use `/src/components/common/`

- Shared across multiple features
- Not purely UI-focused
- Application-specific
- Examples: PageHeader, CrudPageTemplate

#### Use `/src/components/[feature]/`

- Feature-specific components
- Only used within one feature
- Examples: SkillDetailPanel, SchoolCard

#### Use `/src/views/`

- Page-level components
- Connected to routes
- Orchestrates multiple components
- Examples: DashboardView, SkillsView

---

## 📦 Import Path Examples

```js
// Base components
import BaseButton from '@/components/ui/base/BaseButton.vue'
import BaseInput from '@/components/ui/base/BaseInput.vue'

// Common components
import PageHeader from '@/components/common/PageHeader.vue'

// Composables
import { useToast } from '@/composables/useToast'

// Stores
import { useAuthStore } from '@/stores/auth'

// API
import { getSkills } from '@/api/api'

// Utils
import { formatDate } from '@/utils/formatters'

// Views
import DashboardView from '@/views/DashboardView.vue'
```

---

## 🚀 Best Practices

### Component Organization

1. **Base components** → Most reusable, no business logic
2. **Common components** → Shared patterns with some logic
3. **Feature components** → Specific to one feature
4. **Views** → Page-level, route components

### File Naming

- **Components:** PascalCase (e.g., `BaseButton.vue`)
- **Composables:** camelCase with "use" prefix (e.g., `useToast.js`)
- **Stores:** camelCase (e.g., `auth.js`)
- **Utils:** camelCase (e.g., `formatters.js`)

### Imports

- Use `@` alias for `src/` directory
- Absolute imports preferred over relative
- Group imports by type (Vue, libraries, local)

### State Management

- **Local state** → Use in component (`ref`, `reactive`)
- **Shared state** → Use composables
- **Global state** → Use Pinia stores

---

## 📚 Quick Reference

| Need            | Location              | Example             |
| --------------- | --------------------- | ------------------- |
| Reusable button | `components/ui/base/` | BaseButton.vue      |
| Form input      | `components/ui/base/` | BaseInput.vue       |
| Page layout     | `layout/`             | DashboardLayout.vue |
| Page component  | `views/`              | SkillsView.vue      |
| Reusable logic  | `composables/`        | useToast.js         |
| Global state    | `stores/`             | auth.js             |
| API calls       | `api/`                | api.js              |
| Helper function | `utils/`              | formatDate()        |
| Chart           | `components/charts/`  | BarChart.vue        |
| Navigation      | `components/layout/`  | AppNavbar.vue       |

---

**Note:** This structure follows Vue.js best practices and is designed for scalability and maintainability. As the project grows, new folders can be added while maintaining this organizational pattern.

---

## 🚀 Best Practices

### Component Organization

1. **Base components** → Most reusable, no business logic
2. **Common components** → Shared patterns with some logic
3. **Feature components** → Specific to one feature
4. **Views** → Page-level, route components

### File Naming

- **Components:** PascalCase (e.g., `BaseButton.vue`)
- **Composables:** camelCase with "use" prefix (e.g., `useToast.js`)
- **Stores:** camelCase (e.g., `auth.js`)
- **Utils:** camelCase (e.g., `formatters.js`)

### Imports

- Use `@` alias for `src/` directory
- Absolute imports preferred over relative
- Group imports by type (Vue, libraries, local)

### State Management

- **Local state** → Use in component (`ref`, `reactive`)
- **Shared state** → Use composables
- **Global state** → Use Pinia stores

---

## 📚 Quick Reference

| Need            | Location              | Example             |
| --------------- | --------------------- | ------------------- |
| Reusable button | `components/ui/base/` | BaseButton.vue      |
| Form input      | `components/ui/base/` | BaseInput.vue       |
| Page layout     | `layout/`             | DashboardLayout.vue |
| Page component  | `views/`              | SkillsView.vue      |
| Reusable logic  | `composables/`        | useToast.js         |
| Global state    | `stores/`             | auth.js             |
| API calls       | `api/`                | api.js              |
| Helper function | `utils/`              | formatDate()        |
| Chart           | `components/charts/`  | BarChart.vue        |
| Navigation      | `components/layout/`  | AppNavbar.vue       |

---

**Note:** This structure follows Vue.js best practices and is designed for scalability and maintainability. As the project grows, new folders can be added while maintaining this organizational pattern.
