# Source Code Documentation

This document provides a comprehensive overview of the `src` directory structure, explaining the purpose, contents, and functionality of all folders and files in this Next.js application.

## Table of Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
  - [app/](#app)
  - [components/](#components)
  - [config/](#config)
  - [contexts/](#contexts)
  - [hooks/](#hooks)
  - [lib/](#lib)
  - [schemas/](#schemas)
  - [services/](#services)
  - [types/](#types)
  - [utils/](#utils)
- [Architecture Flow](#architecture-flow)
- [Key Patterns](#key-patterns)

---

## Overview

This is a Next.js 14 application built with TypeScript, React Query, and Tailwind CSS. It follows a multi-tenant architecture pattern where each tenant has their own subdomain. The application supports both e-commerce and service-based website types.

**Key Technologies:**

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: React Query (TanStack Query) + React Context
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI + Tailwind CSS
- **Authentication**: JWT-based with customer and admin roles
- **Styling**: Tailwind CSS with custom utilities

---

## Directory Structure

### app/

The `app` directory contains Next.js App Router pages and layouts. This directory follows Next.js 14 App Router conventions.

#### Files:

##### `layout.tsx`

**Purpose**: Root layout component that wraps all pages in the application.

**Contents**:

- Imports `Metadata` type from Next.js for SEO configuration
- Configures Inter font from Google Fonts
- Sets up global CSS via `globals.css`
- Wraps the application with essential providers:
  - `QueryProvider`: Provides React Query context for data fetching
  - `CartProvider`: Provides shopping cart context for e-commerce functionality
- Includes `Toaster` component from Sonner for toast notifications
- Defines global metadata (title and description)
- Applies Inter font class and Tailwind utility classes for styling

**Key Features**:

- Server component (default in App Router)
- Provides global context to all child pages
- Configures font optimization
- Sets up notification system

**Flow**: All pages in the application inherit from this layout, receiving React Query capabilities, cart management, and global styling.

---

##### `page.tsx`

**Purpose**: Home page component - the default landing page.

**Contents**:

- Simple React functional component (`HomePage`)
- Displays welcome message with heading and description
- Includes call-to-action button ("Get Started")
- Uses Tailwind CSS for styling
- Responsive container with centered content

**Key Features**:

- Client-side rendered component
- Minimal initial page structure
- Can be extended with additional sections

**Flow**: This is the entry point when users visit the root URL (`/`).

---

##### `globals.css`

**Purpose**: Global CSS stylesheet containing Tailwind directives and custom CSS variables.

**Contents**:

- Tailwind CSS directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)
- CSS custom properties (CSS variables) for theming
- Global styles for HTML elements
- Dark mode support variables
- Custom utility classes

**Key Features**:

- Defines the design system colors, spacing, and typography
- Supports light/dark mode theming
- Provides base styles for the entire application

---

##### `favicon.ico`

**Purpose**: Site favicon displayed in browser tabs and bookmarks.

---

### components/

Reusable React components organized by purpose and functionality.

#### `ui/`

Contains shadcn/ui-based components built on Radix UI primitives. These are low-level, accessible, reusable UI components following the shadcn/ui pattern.

**Form Components**:

- **`button.tsx`**: Button component with variants (default, destructive, outline, secondary, ghost, link), sizes, and loading states. Uses Radix UI Slot for composition.
- **`input.tsx`**: Text input component with error states, disabled states, and proper accessibility attributes.
- **`textarea.tsx`**: Multi-line text input component with auto-resize capabilities.
- **`select.tsx`**: Dropdown select component using Radix UI Select primitive with search and keyboard navigation.
- **`checkbox.tsx`**: Checkbox input with indeterminate state support.
- **`radio-group.tsx`**: Radio button group component for single selection.
- **`switch.tsx`**: Toggle switch component for boolean inputs.
- **`form.tsx`**: Form wrapper component that integrates with React Hook Form, providing form context and field error handling.

**Layout Components**:

- **`card.tsx`**: Card container component with header, title, description, content, and footer sections.
- **`separator.tsx`**: Horizontal or vertical divider component.
- **`resizable.tsx`**: Resizable panel component using react-resizable-panels for drag-to-resize functionality.
- **`scroll-area.tsx`**: Custom scrollable container with styled scrollbars.
- **`sidebar.tsx`**: Sidebar navigation component with collapsible sections and mobile support.

**Overlay Components**:

- **`dialog.tsx`**: Modal dialog component using Radix UI Dialog with backdrop, animations, and focus management.
- **`drawer.tsx`**: Slide-out drawer component (mobile-friendly) using Vaul library.
- **`sheet.tsx`**: Side sheet component that slides in from edges.
- **`popover.tsx`**: Popover component for contextual information.
- **`tooltip.tsx`**: Tooltip component for hover information.
- **`hover-card.tsx`**: Card that appears on hover with rich content.
- **`alert-dialog.tsx`**: Confirmation dialog for destructive actions.

**Navigation Components**:

- **`navigation-menu.tsx`**: Complex navigation menu with dropdowns and mega menus.
- **`menubar.tsx`**: Menu bar component similar to desktop application menus.
- **`breadcrumb.tsx`**: Breadcrumb navigation component showing page hierarchy.
- **`tabs.tsx`**: Tabbed interface component with keyboard navigation.
- **`pagination.tsx`**: Pagination component for navigating through pages of data.

**Data Display Components**:

- **`table.tsx`**: Data table component with sorting, filtering, and selection capabilities.
- **`badge.tsx`**: Badge component for labels, status indicators, and tags.
- **`avatar.tsx`**: Avatar component with fallback images and initials.
- **`skeleton.tsx`**: Loading skeleton component for content placeholders.
- **`empty.tsx`**: Empty state component for when no data is available.
- **`chart.tsx`**: Chart component wrapper for Recharts integration.

**Feedback Components**:

- **`alert.tsx`**: Alert component for displaying important messages (info, warning, error, success).
- **`sonner.tsx`**: Toast notification system integration using Sonner library.
- **`spinner.tsx`**: Loading spinner component.
- **`progress.tsx`**: Progress bar component for showing completion status.

**Interactive Components**:

- **`accordion.tsx`**: Collapsible accordion component for FAQ sections and expandable content.
- **`collapsible.tsx`**: Simple collapsible component for show/hide functionality.
- **`carousel.tsx`**: Image/content carousel using Embla Carousel.
- **`slider.tsx`**: Range slider component for numeric input.
- **`command.tsx`**: Command palette component (Cmd+K interface) using cmdk library.
- **`context-menu.tsx`**: Right-click context menu component.
- **`dropdown-menu.tsx`**: Dropdown menu component with submenus.

**Utility Components**:

- **`field.tsx`**: Form field wrapper with label and error message.
- **`item.tsx`**: List item component for consistent list styling.
- **`kbd.tsx`**: Keyboard key indicator component for shortcuts.
- **`label.tsx`**: Form label component with proper accessibility.
- **`aspect-ratio.tsx`**: Component for maintaining aspect ratios.
- **`input-group.tsx`**: Input group component for combining inputs with buttons/icons.
- **`input-otp.tsx`**: OTP (One-Time Password) input component using input-otp library.
- **`toggle.tsx`**: Toggle button component.
- **`toggle-group.tsx`**: Group of toggle buttons for multi-select.
- **`button-group.tsx`**: Group of buttons with consistent spacing.
- **`calendar.tsx`**: Date picker calendar component using react-day-picker.

**Pattern**: All UI components follow shadcn/ui conventions:

- Built on Radix UI primitives for accessibility
- Styled with Tailwind CSS
- Use `cn()` utility for class merging
- Support variants via `class-variance-authority`
- Fully typed with TypeScript

---

#### `common/`

Shared utility components used across the application.

##### `ImageWithFallback.tsx`

**Purpose**: Enhanced image component with fallback handling and editing capabilities.

**Contents**:

- Wraps Next.js `Image` component
- Handles image loading errors by falling back to a default image
- Integrates with image manager for editable images
- Shows "Change Image" overlay on hover for images with an `id` prop
- Opens `ImageManagerModal` when clicking editable images
- Updates image map via API when image is changed
- Uses `getImageUrl()` from site config to resolve image paths
- Supports all Next.js Image props (fill, width, height, etc.)

**Key Features**:

- Automatic fallback on image load error
- In-place image editing for builder/admin interfaces
- Toast notifications for success/error states
- Responsive hover states

**Usage**: Used throughout the application for displaying images that may need to be updated or may fail to load.

---

#### `builder/`

Page builder and content management components for admin/content editing interfaces.

##### `ImageManagerModal.tsx`

**Purpose**: Modal dialog for managing and selecting images from the media library.

**Contents**:

- Uses Radix UI Dialog component for modal functionality
- Implements tabbed interface with two tabs:
  - "Media Library": Browse existing images
  - "Upload New": Upload new images
- Manages selected image state
- Calls `onSelect` callback when image is chosen
- Handles modal open/close state
- Responsive design (95vw on mobile, max-w-4xl on desktop)
- Full-height modal (90vh on mobile, 85vh on desktop)

**Key Features**:

- Tab switching between library and upload
- Image selection with visual feedback
- Cancel and Select buttons
- Auto-closes after selection
- Can be opened with initial tab specified

**Flow**: Used in page builder interfaces where users need to select or change images. Opens `MediaLibrary` or `UploadPane` based on active tab.

---

##### `image-manager/MediaLibrary.tsx`

**Purpose**: Displays grid of existing images from the media library.

**Contents**:

- Uses `useImages()` hook to fetch image map from API
- Displays images in responsive grid (2-5 columns based on screen size)
- Shows loading spinner while fetching
- Displays error message if fetch fails
- Highlights selected image with border and checkmark
- Shows image filename on hover
- Uses `ScrollArea` for scrollable container
- Each image is clickable to select it
- Uses Next.js `Image` component with `fill` prop for aspect ratio

**Key Features**:

- Responsive grid layout
- Visual selection feedback
- Loading and error states
- Scrollable container for many images
- Image preview with proper aspect ratios

**Flow**: Fetches images via `useImages()` hook → displays in grid → user clicks image → calls `onSelect` callback with image key.

---

##### `image-manager/UploadPane.tsx`

**Purpose**: Handles uploading new images to the media library.

**Contents**:

- Drag-and-drop file upload interface
- Click-to-upload functionality
- Uses `useUploadImage()` hook for upload mutation
- Shows upload progress with loading spinner
- Displays success callback when upload completes
- Accepts image files only (`accept="image/*"`)
- Styled upload area with dashed border
- Upload icon and instructions

**Key Features**:

- Drag and drop support
- File type validation
- Upload progress indication
- Automatic library refresh after upload
- Toast notifications for success/error

**Flow**: User selects/drops file → `useUploadImage` mutation → API upload → invalidates image cache → calls `onUploadSuccess` callback.

---

#### `providers/`

React context providers that wrap the application to provide global state.

##### `query-provider.tsx`

**Purpose**: Sets up React Query (TanStack Query) client for the entire application.

**Contents**:

- Creates `QueryClient` instance with default options:
  - `staleTime`: 5 minutes (data considered fresh for 5 minutes)
  - `retry`: 3 attempts on failure
  - `refetchOnWindowFocus`: false (prevents refetch on tab focus)
- Provides `QueryClientProvider` to wrap children
- Includes `ReactQueryDevtools` for development (hidden by default)
- Uses `useState` to create singleton QueryClient instance

**Key Features**:

- Centralized data fetching configuration
- Automatic caching and background refetching
- Devtools for debugging queries
- Optimistic updates support

**Flow**: Wraps entire app in `layout.tsx` → all components can use `useQuery` and `useMutation` hooks → queries are cached and managed automatically.

---

### config/

Application configuration files that define settings, URLs, and endpoints.

##### `site.ts`

**Purpose**: Central configuration for API endpoints, media URLs, and site settings.

**Contents**:

- Reads tenant name from `tenant.json` file
- Defines `siteConfig` object with:
  - `name`: Site name ("Nepdora")
  - `description`: Site description
  - `apiBaseUrl`: Dynamic getter that returns API base URL
    - Uses `NEXT_PUBLIC_API_URL` env variable if set
    - Otherwise constructs URL from tenant name: `https://{tenant}.nepdora.baliyoventures.com`
  - `mediaBaseUrl`: Dynamic getter for media files URL
    - Constructs: `https://nepdora.baliyoventures.com/media/workspaces/{tenant}/public`
  - `endpoints`: Object with endpoint builder functions:
    - `fetchImage(path)`: Returns full URL for an image path
    - `listImages()`: Returns endpoint for listing all images
    - `updateImageMap()`: Returns endpoint for updating image map
    - `uploadImage()`: Returns endpoint for uploading images
- Helper functions:
  - `getApiBaseUrl()`: Returns the API base URL
  - `getImageUrl(path)`: Returns full URL for an image, handling:
    - Empty paths (returns empty string)
    - Already full URLs (returns as-is)
    - Relative paths (prepends media base URL)

**Key Features**:

- Multi-tenant support via tenant name
- Environment variable override capability
- Centralized URL management
- Path normalization for images

**Flow**: Imported by all services and components that need to make API calls or display images. Ensures consistent URL construction across the application.

---

### contexts/

React Context providers for global state management that persists across component trees.

##### `AuthContext.tsx`

**Purpose**: Manages customer authentication state and operations.

**Contents**:

- **State Management**:

  - `user`: Current authenticated user object (null if not logged in)
  - `tokens`: JWT access and refresh tokens
  - `isLoading`: Loading state during auth operations
  - `isAuthenticated`: Computed boolean from user and tokens

- **Initialization** (`useEffect`):

  - Loads tokens from `localStorage` ("customer-authTokens" key)
  - Decodes JWT access token using `jwt-decode`
  - Checks token expiration (compares `exp` claim to current time)
  - Extracts user info from token payload
  - Removes expired tokens and shows error toast

- **`login(data)` Function**:

  - Calls `loginUser()` API service
  - Extracts access and refresh tokens from response
  - Decodes access token to get user information
  - Stores tokens in localStorage
  - Updates context state
  - Shows success toast
  - Handles redirect logic:
    - Checks `sessionStorage` for redirect URL
    - Falls back to URL search params
    - Extracts subdomain from current URL or hostname
    - Redirects to home page or specified redirect URL

- **`signup(data)` Function**:

  - Calls `signupUser()` API service
  - Removes `confirmPassword` field before sending
  - Shows success toast
  - Redirects to login page (doesn't auto-login)
  - Extracts subdomain from URL for tenant-specific redirect

- **`logout()` Function**:

  - Clears user and tokens from state
  - Removes tokens from localStorage
  - Clears redirect URL from sessionStorage
  - Shows success toast
  - Redirects to login page

- **Error Handling**:

  - `getErrorMessage()` function handles various error formats:
    - Error arrays with codes (too_many_login_attempts, invalid_credentials, etc.)
    - HTTP status codes (401, 400, 403, 404, 429, 500)
    - Network errors
    - Provides user-friendly error messages

- **Token Storage Format**:
  ```typescript
  {
    access: string,
    refresh: string,
    access_token: string // For backward compatibility
  }
  ```

**Key Features**:

- JWT token management
- Automatic token expiration checking
- Persistent authentication (localStorage)
- Smart redirect handling
- Comprehensive error handling
- Subdomain-aware routing

**Exports**: `AuthContext` (context object), `CustomerPublishAuthProvider` (provider component)

**Flow**:

1. App loads → checks localStorage for tokens
2. If valid tokens exist → decodes and sets user state
3. User logs in → API call → store tokens → update state → redirect
4. User logs out → clear state → clear storage → redirect to login

---

##### `CartContext.tsx`

**Purpose**: Manages shopping cart state with localStorage persistence.

**Contents**:

- **State Management**:

  - `cartItems`: Array of `CartItem` objects
  - Each item contains:
    - `product`: Product object (normalized)
    - `quantity`: Number of items
    - `selectedVariant`: Optional variant object with id, price, and option_values

- **Initialization** (`useEffect`):

  - Loads cart from localStorage ("nepdora_cart" key) on mount
  - Parses JSON and sets initial cart state
  - Handles parse errors gracefully

- **Persistence** (`useEffect`):

  - Saves cart to localStorage whenever `cartItems` changes
  - Automatic sync between state and storage

- **`addToCart(product, quantity, selectedVariant)` Function**:

  - Normalizes product using `normalizeProductForCart()` utility
  - Checks if item with same product AND variant already exists
  - If exists: increments quantity
  - If new: adds new item to cart
  - Handles variant matching (null variants match each other)

- **`removeFromCart(productId, variantId)` Function**:

  - Filters out item matching both productId and variantId
  - Supports removing items with or without variants

- **`updateQuantity(productId, quantity, variantId)` Function**:

  - Updates quantity for matching item
  - If quantity <= 0, calls `removeFromCart` instead
  - Finds item by productId AND variantId match

- **`clearCart()` Function**:

  - Empties the cart array

- **Computed Values**:
  - `itemCount`: Sum of all item quantities
  - `totalPrice`: Sum of (price × quantity) for all items
    - Uses variant price if available, otherwise product price
    - Parses string prices to numbers

**Key Features**:

- Variant support (same product, different variants = different cart items)
- Automatic localStorage sync
- Quantity management
- Price calculation with variant support
- Normalized product handling

**Exports**: `CartContext` (context object), `CartProvider` (provider component)

**Flow**:

1. App loads → cart loaded from localStorage
2. User adds product → `addToCart` called → state updated → localStorage synced
3. User updates quantity → `updateQuantity` called → state updated → localStorage synced
4. User removes item → `removeFromCart` called → state updated → localStorage synced
5. Components using cart re-render automatically

---

### hooks/

Custom React hooks that encapsulate data fetching logic, business logic, and side effects. All hooks follow React Query patterns for server state management.

#### Data Fetching Hooks (React Query)

These hooks use `@tanstack/react-query` for data fetching, caching, and synchronization.

##### `use-product.ts`

**Purpose**: Product CRUD operations and filtering.

**Contents**:

- **`useProductFilters()`**: Extracts filter parameters from URL search params

  - Reads: page, page_size, search, sort_by, sort_order
  - Category filters: category, sub_category, category_id, sub_category_id
  - Boolean filters: is_featured, is_popular, in_stock
  - Price range: min_price, max_price
  - Returns `ProductFilterParams` object
  - Uses `useMemo` for performance

- **`useProducts(additionalParams)`**: Fetches paginated list of products

  - Merges URL filters with additional params (additionalParams take priority)
  - Uses `useQuery` with queryKey: `["products", mergedParams]`
  - Calls `productApi.getProducts(mergedParams)`
  - Configures staleTime: 5 minutes, gcTime: 10 minutes
  - Returns: `{ data, isLoading, error, refetch }`

- **`useProductsWithParams(params)`**: Fetches products without URL filtering

  - For admin/management pages that don't use URL params
  - Same query structure but params passed directly

- **`useProduct(slug)`**: Fetches single product by slug

  - QueryKey: `["product", slug]`
  - Enabled only when slug exists
  - Returns single product object

- **`useCreateProduct()`**: Mutation hook for creating products

  - Uses `useMutation`
  - Calls `productApi.createProduct(data)`
  - On success: invalidates `["products"]` queries, shows success toast
  - On error: shows error toast

- **`useUpdateProduct()`**: Mutation hook for updating products

  - Takes `{ slug, data }` parameters
  - On success: invalidates `["products"]` and `["product", slug]` queries
  - Shows success toast

- **`useDeleteProduct()`**: Mutation hook for deleting products

  - Takes slug parameter
  - On success: invalidates `["products"]` queries
  - Shows success toast

- **`useUpdateFilters()`**: Utility hook for updating URL with filters
  - Uses `useRouter` and `useSearchParams`
  - `updateFilters(newFilters)`: Updates URL search params
    - Removes params with null/undefined/empty values
    - Resets to page 1 when filters change (unless page explicitly updated)
  - `clearFilters()`: Removes all search params

**Key Features**:

- URL-based filtering for shareable product list URLs
- Automatic cache invalidation on mutations
- Toast notifications for user feedback
- Type-safe with TypeScript

**Flow**: Component calls hook → React Query checks cache → Fetches if stale → Returns data/loading/error → Component renders

---

##### `use-category.ts`

**Purpose**: Category CRUD operations.

**Contents**:

- **`useCategories(params)`**: Fetches paginated categories

  - QueryKey: `["categories", params]`
  - Supports pagination, search, sorting
  - StaleTime: 5 minutes

- **`useCategory(slug)`**: Fetches single category by slug

  - Enabled when slug exists

- **`useCreateCategory()`**: Creates new category

  - Invalidates categories list on success
  - Toast notifications

- **`useUpdateCategory()`**: Updates category

  - Invalidates list and specific category
  - Takes `{ slug, data }` parameters

- **`useDeleteCategory()`**: Deletes category
  - Invalidates categories list

**Pattern**: Same structure as `use-product.ts` but for categories.

---

##### `use-subcategory.ts`

**Purpose**: Subcategory CRUD operations.

**Contents**: Similar to `use-category.ts` but for subcategories. Includes category relationship handling.

---

##### `use-collections.ts`

**Purpose**: Collection management operations.

**Contents**: CRUD hooks for product collections (groupings of products).

---

##### `use-blogs.ts`

**Purpose**: Blog post management operations.

**Contents**: CRUD hooks for blog posts with support for categories, tags, and publishing status.

---

##### `use-portfolio.ts`

**Purpose**: Portfolio item management operations.

**Contents**: CRUD hooks for portfolio items (projects, case studies, etc.).

---

##### `use-services.ts`

**Purpose**: Service management operations.

**Contents**: CRUD hooks for services offered by the business.

---

##### `use-orders.ts`

**Purpose**: Order management operations.

**Contents**:

- Fetch orders with filtering (status, date range, customer)
- Create orders
- Update order status
- Order details fetching

---

##### `use-cart.ts`

**Purpose**: Hook to access CartContext.

**Contents**:

- Simple wrapper around `useContext(CartContext)`
- Throws error if used outside `CartProvider`
- Returns all cart context values (cartItems, addToCart, removeFromCart, etc.)

**Usage**: Alternative to using `useContext(CartContext)` directly. Provides better error messaging.

---

##### `use-booking.ts`

**Purpose**: Booking/appointment booking operations.

**Contents**: Hooks for creating and managing bookings/appointments.

---

##### `use-appointment.ts`

**Purpose**: Appointment management operations.

**Contents**: CRUD hooks for appointments with time slot management.

---

##### `use-banner.ts`

**Purpose**: Banner management operations.

**Contents**: CRUD hooks for promotional banners (homepage banners, promotional banners).

---

##### `use-faq.ts`

**Purpose**: FAQ management operations.

**Contents**: CRUD hooks for frequently asked questions.

---

##### `use-testimonials.ts`

**Purpose**: Testimonial management operations.

**Contents**: CRUD hooks for customer testimonials/reviews.

---

##### `use-team-member.ts`

**Purpose**: Team member management operations.

**Contents**: CRUD hooks for team member profiles.

---

##### `use-our-client.ts`

**Purpose**: Client management operations.

**Contents**: CRUD hooks for client logos/testimonials.

---

##### `use-videos.ts`

**Purpose**: Video management operations.

**Contents**: CRUD hooks for video content with support for YouTube, Vimeo, etc.

---

##### `use-popup.ts`

**Purpose**: Popup/modal management operations.

**Contents**: CRUD hooks for popup modals (promotional popups, newsletter signups, etc.).

---

##### `use-newsletter.ts`

**Purpose**: Newsletter subscription operations.

**Contents**:

- Subscribe to newsletter
- Unsubscribe
- Newsletter management (admin)

---

##### `use-contact.ts`

**Purpose**: Contact form submission operations.

**Contents**:

- Submit contact form
- Fetch contact submissions (admin)

---

##### `use-pricing.ts`

**Purpose**: Pricing plan management operations.

**Contents**: CRUD hooks for pricing plans/tiers.

---

##### `use-promocode.ts`

**Purpose**: Promo code management operations.

**Contents**: CRUD hooks for discount codes.

---

##### `use-promo-code-validate.ts`

**Purpose**: Promo code validation operations.

**Contents**:

- Validate promo code
- Get discount amount
- Check code eligibility

---

##### `use-payment-gateway.ts`

**Purpose**: Payment gateway integration operations.

**Contents**:

- Process payments
- Payment status checking
- Refund operations

---

##### `use-delivery-charges.ts`

**Purpose**: Delivery charge management operations.

**Contents**: CRUD hooks for delivery charge rules and zones.

---

##### `use-delivery-charge-calculator.ts`

**Purpose**: Calculate delivery charges based on location and order.

**Contents**:

- Calculate delivery charge for address
- Get available delivery zones
- Estimate delivery time

---

##### `use-site-config.ts`

**Purpose**: Site configuration management operations.

**Contents**:

- Fetch site configuration
- Update site settings
- Theme, logo, contact info management

---

##### `use-template.ts`

**Purpose**: Template management operations.

**Contents**: CRUD hooks for page templates.

---

##### `use-search-products.ts`

**Purpose**: Product search functionality.

**Contents**:

- Search products by query
- Advanced search with filters
- Search suggestions/autocomplete

---

##### `use-images.ts`

**Purpose**: Image management operations.

**Contents**:

- **`useImages()`**: Fetches image map from API

  - QueryKey: `["images"]`
  - Returns object mapping image keys to paths
  - Used by `MediaLibrary` component

- **`useUploadImage(onSuccess)`**: Mutation hook for uploading images
  - Takes File object
  - Calls `uploadImage()` service
  - On success: invalidates `["images"]` query, shows success toast, calls `onSuccess` callback
  - On error: shows error toast

**Flow**: Used by `UploadPane` component for image uploads.

---

#### Utility Hooks

##### `use-mobile.tsx`

**Purpose**: Detect if user is on a mobile device.

**Contents**:

- Uses `window.matchMedia` to detect screen width < 768px
- Listens to window resize events
- Returns boolean: `true` if mobile, `false` if desktop
- Initial state is `undefined` until first check completes

**Key Features**:

- Responsive breakpoint detection
- Event listener cleanup
- SSR-safe (returns `false` initially)

**Usage**: Used for conditional rendering based on device type.

---

##### `use-google-analytics.ts`

**Purpose**: Google Analytics integration.

**Contents**:

- Initialize GA tracking
- Track page views
- Track events
- E-commerce tracking

---

##### `use-whatsapp.ts`

**Purpose**: WhatsApp integration.

**Contents**:

- Open WhatsApp chat
- Send WhatsApp message
- WhatsApp business API integration

---

### lib/

Shared utility libraries and helper functions used across the application.

##### `utils.ts`

**Purpose**: Core utility functions for common operations.

**Contents**:

- **`cn(...inputs)`**: Class name utility function
  - Combines `clsx` (conditional class names) and `tailwind-merge` (Tailwind class merging)
  - Handles conflicting Tailwind classes (e.g., `p-4` and `p-2` → keeps last one)
  - Accepts strings, objects, arrays, undefined/null
  - Essential for component styling

**Usage**: Used in every component for className prop: `className={cn("base-class", condition && "conditional-class")}`

---

##### `jwt-utils.ts`

**Purpose**: JWT token decoding and validation utilities.

**Contents**:

- **`base64UrlDecode(str)`**: Decodes base64url-encoded strings

  - Replaces `-` with `+` and `_` with `/`
  - Adds padding if needed
  - Handles URL-safe base64 encoding used in JWTs

- **`decodeJWT(token)`**: Decodes JWT token and extracts payload

  - Splits token into header, payload, signature
  - Decodes payload using `base64UrlDecode`
  - Parses JSON payload
  - Returns `JWTPayload` object or `null` on error

- **`isTokenExpired(exp)`**: Checks if token is expired

  - Compares expiration timestamp (`exp`) to current time
  - Returns `true` if expired, `false` if valid

- **`JWTPayload` Interface**: TypeScript interface for decoded token payload
  - `token_type`: Token type (usually "access" or "refresh")
  - `exp`, `iat`: Expiration and issued-at timestamps
  - `jti`: JWT ID
  - `user_id`: User identifier
  - `email`: User email
  - `store_name`: Store/tenant name
  - `has_profile`: Profile completion status
  - `role`: User role
  - `phone_number`: User phone
  - `domain`, `sub_domain`: Domain information
  - `has_profile_completed`: Profile completion flag
  - `is_template_account`: Template account flag
  - `first_login`, `is_onboarding_complete`: Onboarding flags
  - `website_type`: Type of website (ecommerce/service)

**Usage**: Used by `AuthContext` to decode tokens and check expiration.

---

##### `string-utils.ts`

**Purpose**: String manipulation utilities.

**Contents**:

- **`capitalizeWords(str)`**: Capitalizes first letter of each word
  - Splits string by spaces
  - Capitalizes first character, lowercases rest
  - Joins back with spaces
  - Example: "hello world" → "Hello World"

**Usage**: Used for formatting names, titles, etc.

---

##### `video-utils.ts`

**Purpose**: Video platform URL parsing and embed URL generation.

**Contents**:

- **`VideoPlatform` Type**: Union type for supported platforms

  - "youtube", "facebook", "instagram", "tiktok", "other"

- **`VideoInfo` Interface**: Structure for video information

  - `platform`: Platform type
  - `id`: Video ID extracted from URL
  - `embedUrl`: Embeddable URL for iframe
  - `thumbnailUrl`: Thumbnail image URL

- **`extractVideoInfo(url)`**: Extracts video information from URL

  - Tests URL against regex patterns for each platform
  - Extracts video ID
  - Generates embed URL and thumbnail URL
  - Returns `VideoInfo` object
  - Supports:
    - YouTube: watch, youtu.be, embed, shorts URLs
    - TikTok: tiktok.com, vm.tiktok.com URLs
    - Instagram: instagram.com/p/, instagr.am URLs
    - Facebook: facebook.com/reel/, fb.watch URLs
  - Returns platform "other" if no match

- **`getVideoEmbedUrl(platform, id, originalUrl)`**: Generates embed URL

  - YouTube: `https://www.youtube.com/embed/{id}?rel=0`
  - Facebook: Uses Facebook embed plugin URL with various formats
  - Instagram: `https://www.instagram.com/p/{id}/embed`
  - TikTok: `https://www.tiktok.com/video/{id}`
  - Returns `null` for unsupported platforms

- **`getVideoThumbnail(platform, id)`**: Generates thumbnail URL
  - YouTube: `https://img.youtube.com/vi/{id}/hqdefault.jpg`
  - Other platforms: Returns `null` (UI should show placeholder)

**Usage**: Used in video components to parse user-provided video URLs and generate embed codes.

---

##### `facebook.ts`

**Purpose**: Facebook Messenger API integration for customer support.

**Contents**:

- **Interfaces**:

  - `FacebookUser`: User profile structure
  - `FacebookMessage`: Message structure with sender, content, timestamp
  - `FacebookConversation`: Conversation structure with participants, snippet

- **`verifyTokenPermissions(pageAccessToken)`**: Verifies Facebook page access token

  - Checks required permissions (pages_messaging, pages_read_engagement)
  - Returns verification result

- **`getPageInfo(pageAccessToken, pageId)`**: Fetches Facebook page information

  - Gets page name, profile picture, etc.
  - Uses Facebook Graph API

- **`getConversations(pageAccessToken, pageId, limit)`**: Fetches list of conversations

  - Returns paginated list of conversations
  - Includes snippet, sender info, updated time
  - Supports pagination with `limit` parameter

- **`getConversationMessages(pageAccessToken, conversationId, limit)`**: Fetches messages in a conversation

  - Returns array of messages
  - Includes sender, content, attachments, timestamp
  - Supports pagination

- **`sendMessage(pageAccessToken, recipientId, message)`**: Sends message via Messenger

  - Takes recipient PSID and message text
  - Returns message ID on success

- **`getUserProfile(pageAccessToken, userId)`**: Gets user profile information

  - Fetches name, profile picture from Facebook

- **`formatTimestamp(timestamp)`**: Formats ISO timestamp to readable format

  - Converts to relative time (e.g., "2 minutes ago")

- **`formatDate(timestamp)`**: Formats timestamp to date string
  - Returns formatted date (e.g., "Jan 15, 2024")

**Usage**: Used in customer support/admin interfaces for Facebook Messenger integration.

---

##### `facebook-utils.ts`

**Purpose**: Facebook-specific utility functions.

**Contents**:

- **`ConversationIdManager` Class**: Manages conversation ID formats
  - **`normalizeConversationId(conversationId, pageId?, senderId?)`**:
    - Converts between different ID formats
    - Facebook uses format: `t_{pageId}_{senderId}`
    - Handles various input formats and normalizes to standard format
  - **`parseConversationId(conversationId)`**:
    - Extracts pageId and senderId from conversation ID
    - Returns object with `pageId` and `senderId`

**Usage**: Used with Facebook Messenger integration to handle conversation IDs consistently.

---

##### `message-store.ts`

**Purpose**: In-memory message store for real-time message management.

**Contents**:

- **`MessageStore` Class**: Event-driven message storage

  - **State**:

    - `messages`: Map of conversationId → MessageData[]
    - `conversations`: Map of conversationId → ConversationUpdate
    - `listeners`: Map of event → Set of listener functions

  - **Methods**:
    - `on(event, listener)`: Subscribe to events
    - `off(event, listener)`: Unsubscribe from events
    - `emit(event, data)`: Emit event to all listeners
    - `addMessage(message)`: Add message to store
      - Prevents duplicates
      - Emits "message_update" event
    - `updateConversation(update)`: Update conversation metadata
      - Emits "conversation_update" event
    - `getMessages(conversationId)`: Get messages for conversation
    - `getConversation(conversationId)`: Get conversation metadata
    - `getStats()`: Get store statistics (total messages, conversations, listeners)

- **Events**:

  - `"message_update"`: Emitted when new message added
  - `"conversation_update"`: Emitted when conversation updated

- **Exports**: `messageStore` singleton instance

**Usage**: Used for real-time message synchronization in chat/messaging interfaces.

---

##### `location-widget/index.ts`

**Purpose**: Location confirmation widget utilities.

**Contents**:

- **`ConfirmPayload` Type**: Structure for confirmation data

  - `orderId`: Order identifier
  - `callbackUrl`: URL to call after confirmation
  - `redirectUrl`: URL to redirect after confirmation
  - `extraParams`: Additional parameters

- **`BuildConfirmUrlOptions` Type**: Options for building confirmation URL

  - `confirmPageUrl`: Base URL for confirmation page
  - `orderId`: Order ID
  - `callbackUrl`, `redirectUrl`: Optional URLs
  - `extraParams`: Optional extra parameters

- **`buildConfirmUrl(options)`**: Builds confirmation URL with short ID

  - POSTs to `/location/url` endpoint with order data
  - Receives `shortId` from server
  - Appends `shortId` as query parameter to `confirmPageUrl`
  - Returns full URL string

- **Exports**: Types and `LocationLinkButton` component

**Usage**: Used for order location confirmation flows (e.g., delivery address confirmation).

---

##### `location-widget/LocationLinkButton.tsx`

**Purpose**: Button component for location confirmation.

**Contents**:

- **Props**:

  - `orderId`: Order identifier (required)
  - `confirmPageUrl`: Confirmation page URL (required)
  - `callbackUrl`, `redirectUrl`: Optional URLs
  - `extraParams`: Optional parameters
  - `label`: Button text (default: "Confirm exact location")
  - `className`, `style`: Styling props
  - `asLink`: Render as `<a>` tag instead of button
  - `target`, `rel`: Link attributes

- **Functionality**:
  - Uses `useEffect` to generate confirmation URL on mount
  - Calls `buildConfirmUrl()` to get URL with short ID
  - Updates `href` state when URL is ready
  - Renders as link or button based on `asLink` prop
  - Opens in new tab when clicked

**Usage**: Used in order management interfaces to provide location confirmation links.

---

##### `server/get-subdomain.ts`

**Purpose**: Server-side subdomain extraction from JWT token.

**Contents**:

- **`getSubDomain()`**: Async server function
  - Reads `authToken` cookie using Next.js `cookies()`
  - Decodes JWT token using `decodeJWT()` utility
  - Checks token expiration
  - Extracts `sub_domain` from token payload
  - Returns subdomain string or `null`
  - Handles errors gracefully

**Key Features**:

- Server-side only (uses "use server" directive)
- Cookie-based authentication
- Token validation

**Usage**: Used in server components and API routes to determine tenant subdomain.

---

### schemas/

Zod validation schemas for form validation and type inference. Schemas define the structure and validation rules for data.

##### `product.form.ts`

**Purpose**: Product-related validation schemas and types.

**Contents**:

- **File Upload Schema**:

  - `ACCEPTED_IMAGE_TYPES`: Array of MIME types (jpeg, jpg, png, webp)
  - `MAX_FILE_SIZE`: 5MB limit
  - `imageSchema`: Zod schema for image validation
    - Validates file size
    - Validates file type
    - Allows strings (existing URLs) or Files

- **Variant Schemas**:

  - `ProductOptionValueSchema`: Option value structure (id, value, option)
  - `ProductOptionSchema`: Product option structure (id, name, product, values)
  - `ProductVariantSchema`: Variant structure (id, price, stock, image, option_values, product, timestamps)
  - `ProductVariantReadSchema`: Read-only variant with option_values as object
  - `CreateVariantSchema`: Schema for creating variants (price, stock, image, options)

- **Category Schemas**:

  - `CategoryReferenceSchema`: Category reference in products (id, name, slug, description, image)
  - `SubCategoryReferenceSchema`: Subcategory reference

- **Product Image Schema**:

  - `ProductImageSchema`: Image structure (id, image URL)

- **Status Choices**:

  - `STATUS_CHOICES`: Array of statuses ("active", "draft", "archived")

- **Product Schemas**:

  - `ProductSchema`: Full product validation schema
    - Required: id, name, price, stock
    - Optional: slug, description, market_price, weight, images, category, sub_category
    - Flags: track_stock, is_popular, is_featured, is_wishlist, fast_shipping
    - Metadata: meta_title, meta_description
    - Variants: options, variants, variants_read
    - Timestamps: created_at, updated_at
  - `CreateProductSchema`: Schema for product creation
    - Similar to ProductSchema but for form input
    - Image fields accept File or string
    - Variants and options are optional
  - `UpdateProductSchema`: Partial of CreateProductSchema

- **Category Schemas**:

  - `CategorySchema`: Full category schema
  - `CreateCategorySchema`: Category creation schema
  - `UpdateCategorySchema`: Partial category update

- **Subcategory Schemas**:
  - `SubCategorySchema`: Full subcategory schema
  - `CreateSubCategorySchema`: Subcategory creation (includes category reference)
  - `UpdateSubCategorySchema`: Partial update

**Key Features**:

- Comprehensive validation rules
- File upload validation
- Price format validation (regex: `^\d+(\.\d{1,2})?$`)
- Stock validation (non-negative)
- Image type and size validation

**Usage**: Used with React Hook Form via `@hookform/resolvers/zod` for form validation. Types are inferred from schemas.

---

##### `category.form.ts`

**Purpose**: Category validation schemas.

**Contents**:

- `categorySchema`: Full category schema (id, name, slug, description, image, timestamps)
- `createCategorySchema`: Category creation schema
  - Name: 1-100 characters
  - Description: 1-500 characters
  - Image: Optional File
- `updateCategorySchema`: Extends create schema with id
- Type exports: `CategoryFormData`, `UpdateCategoryFormData`

**Pattern**: Similar structure to product schemas but simpler.

---

##### `blog.form.ts`

**Purpose**: Blog post validation schemas.

**Contents**: Schemas for blog posts including title, content, author, categories, tags, publish date, featured image, etc.

---

##### `portfolio.form.ts`

**Purpose**: Portfolio item validation schemas.

**Contents**: Schemas for portfolio items including title, description, images, project URL, technologies, etc.

---

##### `services.form.ts`

**Purpose**: Service validation schemas.

**Contents**: Schemas for services including name, description, price, duration, category, images, etc.

---

##### `login.form.ts`

**Purpose**: Admin login form validation schema.

**Contents**:

- `loginSchema`: Zod schema
  - `email`: Valid email address (required)
  - `password`: Non-empty string (required)
- `LoginFormValues`: Type inferred from schema

**Usage**: Used in admin login forms.

---

##### `signup.form.ts`

**Purpose**: Admin signup form validation schema.

**Contents**: Schema for admin registration including email, password, confirm password, name, etc.

---

##### `template-account.form.ts`

**Purpose**: Template account form validation schema.

**Contents**: Schema for template account creation/update.

---

##### `chekout.form.ts`

**Purpose**: Checkout form validation schema.

**Contents**: Schema for checkout including shipping address, billing address, payment method, etc.

---

##### `promocode.form.ts`

**Purpose**: Promo code form validation schema.

**Contents**: Schema for promo codes including code, discount type, value, expiry date, usage limits, etc.

---

##### `issues.form.ts`

**Purpose**: Issue reporting form validation schema.

**Contents**: Schema for reporting issues including title, description, category, priority, etc.

---

##### `customer/login.form.ts`

**Purpose**: Customer login form validation schema.

**Contents**: Same as `login.form.ts` but for customer authentication.

---

##### `customer/signup.form.ts`

**Purpose**: Customer signup form validation schema.

**Contents**: Schema for customer registration including email, password, first name, last name, phone, address, website type, etc.

---

### services/

API service layer - all external API calls are made through services. Services handle HTTP requests, headers, error handling, and response transformation.

#### `api/`

API service functions for each entity. Each service file exports an object with CRUD methods.

##### `product.ts`

**Purpose**: Product API operations.

**Contents**:

- **`ProductFilterParams` Interface**: Extended pagination params

  - Pagination: page, page_size
  - Search: search, sortBy, sortOrder
  - Filters: category, sub_category, category_id, sub_category_id
  - Boolean filters: is_featured, is_popular, in_stock
  - Price range: min_price, max_price

- **`buildProductFormData(data)`**: Helper function

  - Converts product data to FormData for multipart upload
  - Handles image_files array (appends each File)
  - Handles thumbnail_image (appends File)
  - Handles variants (stringifies JSON, handles variant images)
  - Converts booleans/numbers to strings
  - Logs FormData contents for debugging

- **`validateFiles(data)`**: File validation helper

  - Checks file sizes (max 5MB)
  - Returns array of error messages
  - Validates thumbnail and image_files

- **`productApi` Object**:

  - **`getProducts(params)`**: GET request

    - Builds query string from params
    - Fetches from `/api/product/`
    - Transforms response to include pagination info
    - Returns `GetProductsResponse`

  - **`getProduct(slug)`**: GET single product

    - Fetches from `/api/product/{slug}/`
    - Returns `Product`

  - **`createProduct(data)`**: POST request

    - Validates files before upload
    - Converts data to FormData
    - POSTs to `/api/product/`
    - Returns `CreateProductResponse`

  - **`updateProduct(slug, data)`**: PATCH request

    - Validates files
    - Converts to FormData
    - PATCHes to `/api/product/{slug}/`
    - Sets Authorization header manually (for FormData)
    - Returns `UpdateProductResponse`

  - **`deleteProduct(slug)`**: DELETE request
    - DELETEs to `/api/product/{slug}/`
    - Returns `DeleteProductResponse`

**Key Features**:

- FormData handling for file uploads
- File validation before upload
- Query parameter building
- Response transformation
- Error handling via `handleApiError()`

**Flow**: Hook calls service → Service builds request → Fetches from API → Handles errors → Returns typed response

---

##### `category.ts`

**Purpose**: Category API operations.

**Contents**:

- **`useCategoryApi` Object**:
  - `getCategories(params)`: Fetches paginated categories
    - Handles array or object responses
    - Builds pagination info
  - `getCategory(slug)`: Fetches single category
  - `createCategory(data)`: Creates category
    - Accepts FormData or object
    - Handles image upload
  - `updateCategory(slug, data)`: Updates category
    - Handles FormData or JSON
  - `deleteCategory(slug)`: Deletes category

**Pattern**: Similar to product API but simpler (no variants).

---

##### `sub-category.ts`

**Purpose**: Subcategory API operations.

**Contents**: Similar to category API but includes category relationship.

---

##### `collection.ts`

**Purpose**: Collection API operations.

**Contents**: CRUD operations for product collections.

---

##### `blog.ts`

**Purpose**: Blog API operations.

**Contents**: CRUD operations for blog posts.

---

##### `portfolio.ts`

**Purpose**: Portfolio API operations.

**Contents**: CRUD operations for portfolio items.

---

##### `services.ts`

**Purpose**: Service API operations.

**Contents**: CRUD operations for business services.

---

##### `orders.ts`

**Purpose**: Order API operations.

**Contents**:

- Fetch orders with filtering
- Create orders
- Update order status
- Order details

---

##### `booking.ts`

**Purpose**: Booking API operations.

**Contents**: CRUD operations for bookings/appointments.

---

##### `appointment.ts`

**Purpose**: Appointment API operations.

**Contents**: CRUD operations for appointments.

---

##### `banner.ts`

**Purpose**: Banner API operations.

**Contents**: CRUD operations for promotional banners.

---

##### `faq.ts`

**Purpose**: FAQ API operations.

**Contents**: CRUD operations for frequently asked questions.

---

##### `testimonials.ts`

**Purpose**: Testimonial API operations.

**Contents**: CRUD operations for testimonials.

---

##### `team-member.ts`

**Purpose**: Team member API operations.

**Contents**: CRUD operations for team member profiles.

---

##### `our-client.ts`

**Purpose**: Client API operations.

**Contents**: CRUD operations for client logos/testimonials.

---

##### `videos.ts`

**Purpose**: Video API operations.

**Contents**: CRUD operations for video content.

---

##### `popup.ts`

**Purpose**: Popup API operations.

**Contents**: CRUD operations for popup modals.

---

##### `newsletter.ts`

**Purpose**: Newsletter API operations.

**Contents**:

- Subscribe to newsletter
- Unsubscribe
- Newsletter management

---

##### `contact.ts`

**Purpose**: Contact API operations.

**Contents**:

- Submit contact form
- Fetch contact submissions

---

##### `pricing.ts`

**Purpose**: Pricing API operations.

**Contents**: CRUD operations for pricing plans.

---

##### `promo-code.ts`

**Purpose**: Promo code API operations.

**Contents**: CRUD operations for discount codes.

---

##### `promo-code-validate.ts`

**Purpose**: Promo code validation API operations.

**Contents**:

- Validate promo code
- Get discount amount

---

##### `payment-gateway.ts`

**Purpose**: Payment gateway API operations.

**Contents**:

- Process payments
- Payment status
- Refunds

---

##### `delivery-charges.ts`

**Purpose**: Delivery charge API operations.

**Contents**: CRUD operations for delivery charge rules.

---

##### `site-config.ts`

**Purpose**: Site configuration API operations.

**Contents**:

- Fetch site config
- Update site settings

---

##### `template.ts`

**Purpose**: Template API operations.

**Contents**: CRUD operations for page templates.

---

##### `conversations.ts`

**Purpose**: Conversation API operations.

**Contents**: CRUD operations for messaging conversations.

---

##### `facebook.ts`

**Purpose**: Facebook API operations.

**Contents**: Facebook Messenger API integration endpoints.

---

##### `google-analytics.ts`

**Purpose**: Google Analytics API operations.

**Contents**: GA tracking and analytics endpoints.

---

##### `whatsapp.ts`

**Purpose**: WhatsApp API operations.

**Contents**: WhatsApp Business API integration endpoints.

---

##### `issues.ts`

**Purpose**: Issue API operations.

**Contents**: CRUD operations for issue reporting.

---

#### `auth/`

Authentication service functions.

##### `customer/api.ts`

**Purpose**: Customer authentication API calls.

**Contents**:

- **`signupUser(data)`**: Customer registration

  - POSTs to `/api/customer/register/`
  - Sends: email, password, first_name, last_name, phone, address, website_type
  - Returns `SignupResponse` (user data without tokens)
  - Throws error with message on failure

- **`loginUser(data)`**: Customer login
  - POSTs to `/api/customer/login/`
  - Sends: email, password
  - Returns `LoginResponse` (message and tokens)
  - Throws error on failure

**Key Features**:

- No authentication headers (public endpoints)
- JSON request/response
- Error handling with user-friendly messages

**Flow**: Used by `AuthContext` for customer authentication.

---

#### Other Services

##### `image-service.ts`

**Purpose**: Image management service operations.

**Contents**:

- **`ImageMap` Interface**: Object mapping image keys to paths

  ```typescript
  { [key: string]: string }
  ```

- **`fetchImages()`**: Fetches image map from API

  - GETs from `siteConfig.endpoints.listImages()`
  - Returns `ImageMap` object
  - Throws error on failure

- **`uploadImage(file)`**: Uploads new image

  - Creates FormData with file
  - POSTs to `siteConfig.endpoints.uploadImage()`
  - Returns updated `ImageMap`
  - Throws error on failure

- **`updateImageMap(key, imagePath)`**: Updates image mapping
  - POSTs to `siteConfig.endpoints.updateImageMap()`
  - Sends JSON: `{ key, image: imagePath }`
  - Returns updated map
  - Throws error on failure

**Usage**: Used by `use-images.ts` hook and image manager components.

---

### types/

TypeScript type definitions and interfaces. Types provide type safety and IntelliSense support.

##### `product.ts`

**Purpose**: Product-related TypeScript types.

**Contents**:

- **Type Exports** (inferred from schemas):

  - `Product`: Full product type
  - `CreateProductRequest`: Product creation request type
  - `UpdateProductRequest`: Product update request type (partial)
  - `Category`, `SubCategory`: Category types
  - `CreateCategoryRequest`, `UpdateCategoryRequest`: Category request types
  - `CreateSubCategoryRequest`, `UpdateSubCategoryRequest`: Subcategory request types
  - `ProductOption`, `ProductVariant`, `ProductVariantRead`: Variant types
  - `CreateVariant`, `CreateProductOption`: Variant creation types

- **Extended Types**:

  - `ExtendedProduct`: Product with additional properties
  - `ProductLike`: Generic product-like object for normalization

- **Pagination Types**:

  - `PaginationParams`: Request parameters (page, page_size, search, sortBy, sortOrder, category)
  - `PaginationInfo`: Response pagination info (page, page_size, total, totalPages, hasNext, hasPrevious)

- **Response Types**:

  - `GetProductsResponse`: Products list response (results, count, next, previous, pagination)
  - `GetCategoriesResponse`: Categories list response
  - `GetSubCategoriesResponse`: Subcategories list response
  - `CreateProductResponse`: Product creation response (data, message)
  - `UpdateProductResponse`: Product update response
  - `DeleteProductResponse`: Product deletion response (message)
  - Similar response types for categories and subcategories

- **Utility Function**:
  - `normalizeProductForCart(product)`: Normalizes product-like objects to `Product` type
    - Handles products with `name` or `title`
    - Converts price to string
    - Sets defaults for optional fields
    - Ensures consistent product structure for cart

**Key Features**:

- Types inferred from Zod schemas (single source of truth)
- Comprehensive request/response types
- Utility types for flexibility
- Normalization function for cart compatibility

**Usage**: Imported by services, hooks, and components for type safety.

---

##### `cart.ts`

**Purpose**: Shopping cart TypeScript types.

**Contents**:

- **`CartItem` Interface**: Structure for cart items

  - `product`: Product object
  - `quantity`: Number of items
  - `selectedVariant`: Optional variant object
    - `id`: Variant ID
    - `price`: Variant price (string)
    - `option_values`: Record of option values

- **`OrderItem` Interface**: Structure for order items

  - `product_id`: Product ID
  - `quantity`: Quantity
  - `price`: Price (string)

- **`CreateOrderRequest` Interface**: Order creation request

  - `customer_name`, `customer_email`: Customer info
  - `shipping_address`, `customer_address`: Addresses
  - `total_amount`: Total price (string)
  - `items`: Array of OrderItem

- **`Order` Interface**: Full order structure
  - Extends `CreateOrderRequest`
  - `id`: Order ID
  - `status`: Order status enum ("pending", "confirmed", "processing", "shipped", "delivered", "cancelled")
  - `created_at`, `updated_at`: Timestamps

**Usage**: Used by `CartContext` and order management components.

---

##### `auth/customer/auth.ts`

**Purpose**: Customer authentication TypeScript types.

**Contents**:

- **`User` Interface**: User profile structure

  - `id`: User ID (number)
  - `first_name`, `last_name`: Name fields
  - `email`: Email address
  - `phone`: Optional phone number
  - `address`: Optional address
  - `username`: Optional username

- **`AuthTokens` Interface**: Token structure

  - `access`: Access token (JWT)
  - `refresh`: Refresh token (JWT)

- **`DecodedAccessToken` Interface**: Decoded JWT payload structure

  - `token_type`: Token type
  - `exp`, `iat`: Expiration and issued-at timestamps
  - `jti`: JWT ID
  - `user_id`: User ID
  - `first_name`, `last_name`: Name fields
  - `email`: Email
  - `phone`, `address`: Optional fields

- **`SignupResponse` Interface**: Signup API response

  - User data (id, name, email, phone, address)
  - No tokens (user must login separately)

- **`LoginResponse` Interface**: Login API response
  - `message`: Success message
  - `tokens`: AuthTokens object

**Usage**: Used by `AuthContext` and authentication services.

---

##### Other Type Files

All other type files follow similar patterns:

- Base entity types (e.g., `Banner`, `Blog`, `Order`)
- Create/Update request types
- API response types
- Pagination types
- Related entity types

**Files**:

- `banner.ts`: Banner types
- `blog.ts`: Blog types
- `booking.ts`: Booking types
- `collection.ts`: Collection types
- `contact.ts`: Contact types
- `conversations.ts`: Conversation types
- `dashboard.ts`: Dashboard types
- `delivery-charges.ts`: Delivery charge types
- `facebook.ts`: Facebook API types
- `faq.ts`: FAQ types
- `google-analytics.ts`: Google Analytics types
- `issues.ts`: Issue types
- `logistics.ts`: Logistics types
- `newsletter.ts`: Newsletter types
- `orders.ts`: Order types
- `our-client.ts`: Client types
- `payment-gateway.ts`: Payment gateway types
- `popup.ts`: Popup types
- `portfolio.ts`: Portfolio types
- `pricing.ts`: Pricing types
- `promo-code.ts`: Promo code types
- `promo-code-validate.ts`: Promo code validation types
- `services.ts`: Service types
- `site-config.ts`: Site configuration types
- `team-member.ts`: Team member types
- `template.ts`: Template types
- `testimonial.ts`: Testimonial types
- `videos.ts`: Video types
- `whatsapp.ts`: WhatsApp types
- `appointment.ts`: Appointment types

---

### utils/

Utility functions for common operations used across the application.

##### `auth.ts`

**Purpose**: Authentication token retrieval utilities.

**Contents**:

- **`getAuthToken()`**: Gets admin authentication token

  - Reads from localStorage ("authTokens" key)
  - Parses JSON
  - Returns `access_token` field
  - Returns `null` if not found or on error
  - SSR-safe (checks `typeof window`)

- **`getAuthTokenCustomer()`**: Gets customer authentication token
  - Reads from localStorage ("customer-authTokens" key)
  - Parses JSON
  - Returns `access_token` or `access` field (handles both formats)
  - Returns `null` if not found or on error
  - SSR-safe

**Usage**: Used by `headers.ts` to create authenticated request headers.

---

##### `headers.ts`

**Purpose**: HTTP header creation utilities.

**Contents**:

- **`createHeaders(includeAuth?, isFormData?)`**: Creates headers for admin API requests

  - Parameters:
    - `includeAuth`: Whether to include auth token (default: true)
    - `isFormData`: Whether request body is FormData (default: false)
  - Sets `Content-Type: application/json` unless FormData
  - Adds `Authorization: Bearer {token}` if `includeAuth` is true
  - Uses `getAuthToken()` for admin token
  - Returns `HeadersInit` object

- **`createHeadersCustomer(includeAuth?)`**: Creates headers for customer API requests
  - Similar to `createHeaders` but:
    - Always sets `Content-Type: application/json`
    - Uses `getAuthTokenCustomer()` for customer token
    - Used for customer-facing API endpoints

**Usage**: Used by all API services to create request headers.

---

##### `api-error.ts`

**Purpose**: Centralized API error handling and validation utilities.

**Contents**:

- **`FieldErrors` Interface**: Structure for field-level errors

  ```typescript
  { [fieldName: string]: string[] }
  ```

- **`ApiErrorData` Interface**: API error response structure

  - `message`: Error message
  - `error`: Error object with code, message, params
  - Additional fields

- **`ApiError` Interface**: Extended Error with API-specific fields

  - Extends `Error`
  - `status`: HTTP status code
  - `data`: ApiErrorData
  - `fieldErrors`: FieldErrors object

- **`handleApiError(response)`**: Main error handling function

  - Checks if response is OK
  - Parses error JSON
  - Handles different error formats:
    - **400 (Validation Errors)**: Extracts field errors from nested structure
      - Flattens nested error objects
      - Creates `fieldErrors` object
      - Formats error message with field names
    - **409 (Conflict/Unique Constraint)**: Handles duplicate entry errors
      - Extracts field-level error messages
      - Provides user-friendly messages
    - **413 (Payload Too Large)**: File size error
    - **415 (Unsupported Media Type)**: Invalid file type error
  - Throws `ApiError` with status, data, and fieldErrors
  - Returns response if OK

- **`validateFile(file)`**: File validation utility

  - Checks file size (max 5MB)
  - Checks file type (JPEG, PNG, WebP)
  - Returns `{ valid: boolean, error?: string }`

- **`validateUrl(url)`**: URL validation utility

  - Checks if URL is valid HTTP/HTTPS URL
  - Returns `true` if valid or empty, `false` otherwise

- **`validateSocialUrls(data)`**: Social media URL validation
  - Validates Facebook, Instagram, LinkedIn, Twitter URLs
  - Returns `{ valid: boolean, errors: FieldErrors }`
  - Collects errors for each invalid URL

**Usage**: Used by all API services via `handleApiError()` for consistent error handling. Validation utilities used in forms.

---

## Architecture Flow

### Data Flow Pattern

```
Component → Hook → Service → API → Backend
                ↓
         React Query Cache
                ↓
         Component Updates
```

1. **Component** calls a custom hook (e.g., `useProducts()`)
2. **Hook** uses React Query to call a service function (e.g., `productApi.getProducts()`)
3. **Service** makes HTTP request using `fetch()` with proper headers
4. **API** returns data
5. **Service** handles errors via `handleApiError()`
6. **Hook** caches response in React Query
7. **Component** receives data, loading, and error states

### Authentication Flow

```
User Action → AuthContext → Auth Service → API
                    ↓
            Store Tokens (localStorage)
                    ↓
            Decode JWT → Extract User Info
                    ↓
            Update Context State
```

1. User submits login/signup form
2. `AuthContext` calls `loginUser()` or `signupUser()`
3. Service makes API request
4. On success, tokens stored in localStorage
5. JWT decoded to extract user info
6. Context state updated
7. User redirected appropriately

### Cart Flow

```
Add to Cart → CartContext → Update State → localStorage
                                    ↓
                            Component Re-renders
```

1. User adds product to cart
2. `CartContext.addToCart()` called
3. State updated (supports variants)
4. Cart persisted to localStorage
5. Components using cart context re-render

### Form Validation Flow

```
Form Input → React Hook Form → Zod Schema → Validation
                                    ↓
                            Error Display
```

1. User fills form
2. React Hook Form manages form state
3. Zod schema validates on submit/blur
4. Errors displayed via form components
5. On valid submit, mutation hook called

---

## Key Patterns

### 1. **Multi-Tenant Architecture**

- Each tenant has a subdomain
- `siteConfig` reads tenant from `tenant.json`
- API URLs are tenant-specific
- Subdomain extracted from JWT or URL
- Server-side subdomain extraction via `getSubDomain()`

### 2. **Separation of Concerns**

- **Types**: Type definitions (`types/`)
- **Schemas**: Validation rules (`schemas/`)
- **Services**: API calls (`services/`)
- **Hooks**: Data fetching logic (`hooks/`)
- **Components**: UI rendering (`components/`)

### 3. **React Query Pattern**

- All data fetching goes through React Query
- Hooks provide loading/error states
- Cache invalidation on mutations
- Optimistic updates where appropriate
- Background refetching
- Stale-while-revalidate strategy

### 4. **Error Handling**

- Centralized via `handleApiError()`
- Field-level error extraction
- User-friendly error messages
- Toast notifications for errors
- Type-safe error handling

### 5. **Type Safety**

- Types inferred from Zod schemas
- Full TypeScript coverage
- Request/Response types for all APIs
- No `any` types (except where necessary)
- IntelliSense support throughout

### 6. **State Management**

- **Global State**: React Context (Auth, Cart)
- **Server State**: React Query
- **Form State**: React Hook Form
- **Local State**: useState/useReducer
- **Persistence**: localStorage for auth and cart

### 7. **File Upload Pattern**

- FormData for multipart uploads
- File validation before upload
- Progress tracking (where implemented)
- Image service for media management
- File size limits (5MB)
- Type validation (images only)

### 8. **Component Patterns**

- shadcn/ui component structure
- Variant-based styling (CVA)
- Composition over configuration
- Accessible by default (Radix UI)
- Tailwind CSS for styling
- `cn()` utility for class merging

---

## File Count Summary

- **Components**: ~50+ UI components + custom components
- **Hooks**: 32 custom hooks
- **Services**: 31 API service files + auth services + image service
- **Types**: 30+ type definition files
- **Schemas**: 10+ validation schema files
- **Utils**: 3 utility modules
- **Lib**: 8+ utility libraries
- **Contexts**: 2 context providers

---

-=\## Getting Started

1. **Install Dependencies**: `npm install` or `pnpm install`
2. **Configure Tenant**: Update `tenant.json` with your tenant name
3. **Set Environment Variables**: Configure `NEXT_PUBLIC_API_URL` if needed
4. **Run Development Server**: `npm run dev`
5. **Build**: `npm run build`

---

## Notes

- This is a template/boilerplate for multi-tenant Next.js applications
- Supports both e-commerce and service-based websites
- Uses JWT for authentication with separate admin and customer flows
- All API calls are tenant-aware
- Image management is handled through a dedicated service
- The application follows Next.js 14 App Router conventions
- All components are built with accessibility in mind
- Type safety is enforced throughout the codebase

---

_Last Updated: Generated automatically from codebase analysis_
