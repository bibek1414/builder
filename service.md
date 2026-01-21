# Source Directory Documentation

This document provides a comprehensive overview of the `src` directory structure, explaining the purpose, functionality, data structures, and implementation details of each folder and file in this Next.js service template application.

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
- [Data Flow](#data-flow)
- [Integration Patterns](#integration-patterns)

---

## Overview

This is a Next.js 14+ application built with TypeScript, React Query, and Tailwind CSS. The application follows a multi-tenant architecture pattern and provides a comprehensive service management system with features for blogs, services, portfolios, bookings, testimonials, and more.

**Key Technologies:**
- Next.js 14+ with App Router
- React Query (TanStack Query) for data fetching
- TypeScript for type safety
- Zod for schema validation
- Tailwind CSS for styling
- shadcn/ui component library

---

## Directory Structure

### app/

The `app` directory contains Next.js App Router files that define routes and layouts. This follows Next.js 13+ App Router conventions.

#### `layout.tsx`

**Purpose**: Root layout component that wraps the entire application

**Exports**:
- `metadata`: SEO metadata object with title and description
- Default export: RootLayout component

**Implementation Details**:
- Uses `Inter` font from Google Fonts with Latin subset
- Imports and applies `globals.css` for global styles
- Wraps children with `QueryProvider` to enable React Query throughout the app
- Includes `Toaster` from Sonner for toast notifications
- Applies Tailwind utility classes: `min-h-screen`, `bg-background`, `antialiased`
- Uses `cn()` utility for conditional className merging

**Component Structure**:
```tsx
<html lang="en">
  <body className={cn("min-h-screen bg-background antialiased", inter.className)}>
    <QueryProvider>
      <main className="flex-grow">{children}</main>
      <Toaster />
    </QueryProvider>
  </body>
</html>
```

**Dependencies**:
- `@/lib/utils` - for `cn()` function
- `@/components/providers/query-provider` - React Query setup
- `@/components/ui/sonner` - Toast notifications

---

#### `page.tsx`

**Purpose**: Home page component (landing page)

**Exports**: Default export - HomePage component

**Implementation Details**:
- Simple functional component using React.FC type
- Renders a centered welcome section with:
  - Large heading: "Welcome to Our Website"
  - Descriptive paragraph text
  - Call-to-action button linking to "#get-started"
- Uses Tailwind classes for styling and responsive design
- Button has hover effects and transitions

**Component Structure**:
```tsx
<section className="min-h-screen bg-white">
  <div className="container mx-auto px-4 py-20 text-center">
    <h1>Welcome to Our Website</h1>
    <p>Discover amazing content...</p>
    <a href="#get-started">Get Started</a>
  </div>
</section>
```

---

#### `globals.css`

**Purpose**: Global CSS styles, Tailwind directives, and CSS custom properties for theming

**Structure**:

1. **Tailwind Directives**:
   - `@tailwind base` - Tailwind's base styles
   - `@tailwind components` - Component classes
   - `@tailwind utilities` - Utility classes

2. **Custom Utilities**:
   - `.text-balance` - Text wrapping utility using CSS `text-wrap: balance`

3. **CSS Custom Properties (Light Mode)**:
   - Color variables for theming (HSL format):
     - `--background`: 0 0% 100% (white)
     - `--foreground`: 0 0% 3.9% (near black)
     - `--primary`, `--secondary`, `--muted`, `--accent` colors
     - `--destructive`: 0 84.2% 60.2% (red)
     - `--border`, `--input`, `--ring` colors
     - Chart colors (1-5) for data visualization
     - Sidebar-specific colors
     - `--radius`: 0.5rem (border radius)

4. **CSS Custom Properties (Dark Mode)**:
   - Same structure but with dark theme values
   - Background: 0 0% 3.9% (very dark)
   - Foreground: 0 0% 98% (near white)
   - Adjusted color values for dark mode contrast

5. **Base Styles**:
   - `* { border-border }` - Applies border color to all elements
   - `body { bg-background text-foreground }` - Sets body background and text colors

**Usage**: These CSS variables are used throughout the application via Tailwind's theme system, enabling easy theme switching and consistent styling.

---

### components/

Contains reusable React components organized by category. Components follow React best practices and use TypeScript for type safety.

#### `providers/query-provider.tsx`

**Purpose**: React Query provider wrapper that initializes and provides QueryClient to the entire application

**Exports**: `QueryProvider` component

**Implementation Details**:
- Uses `useState` with lazy initialization to create QueryClient only once
- Configures default query options:
  - `staleTime`: 5 minutes (300,000ms) - data considered fresh for 5 minutes
  - `retry`: 3 attempts on failure
  - `refetchOnWindowFocus`: false - prevents automatic refetching when window regains focus
- Wraps children with `QueryClientProvider`
- Includes `ReactQueryDevtools` for development (hidden by default)

**QueryClient Configuration**:
```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})
```

**Usage**: Wraps the entire app in `layout.tsx` to enable React Query hooks throughout the application.

---

#### `common/ImageWithFallback.tsx`

**Purpose**: Enhanced Next.js Image component with fallback handling and inline editing capabilities

**Props Interface**:
```typescript
interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc: string;  // Required fallback image URL
  id?: string;          // Optional: enables editing mode
}
```

**Implementation Details**:

1. **State Management**:
   - `imgSrc`: Current image source (updates when prop changes)
   - `showManager`: Controls ImageManagerModal visibility
   - `managerTab`: Determines which tab to show ("library" | "upload")

2. **Image URL Processing**:
   - Uses `getImageUrl()` from config to construct full image URLs
   - Handles both string paths and object sources
   - Automatically updates when `src` prop changes

3. **Error Handling**:
   - `onError` handler switches to `fallbackSrc` if image fails to load
   - Prevents infinite loops by checking current src before switching

4. **Editing Mode** (when `id` prop provided):
   - Shows hover overlay with "Change Image" button
   - Opens ImageManagerModal on click
   - Updates image map via `updateImageMap()` API call
   - Shows success/error toasts

5. **Image Selection Flow**:
   ```typescript
   handleImageSelect(newPath: string) {
     updateImageMap(id, newPath)  // API call
     setImgSrc(getImageUrl(newPath))  // Update display
     toast.success("Image updated successfully")
   }
   ```

**Dependencies**:
- `next/image` - Next.js optimized Image component
- `@/config/site` - for `getImageUrl()`
- `@/components/builder/ImageManagerModal` - for image selection
- `@/services/image-service` - for `updateImageMap()`
- `sonner` - for toast notifications

---

#### `builder/ImageManagerModal.tsx`

**Purpose**: Modal dialog component for managing images (selecting from library or uploading new)

**Props Interface**:
```typescript
interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imagePath: string) => void;
  initialTab?: "library" | "upload";
}
```

**Implementation Details**:

1. **State Management**:
   - `activeTab`: Current active tab ("library" | "upload")
   - `selectedImage`: Currently selected image path (for library tab)

2. **Tab System**:
   - Uses shadcn/ui `Tabs` component
   - Two tabs: "Media Library" and "Upload New"
   - Tab state syncs with `initialTab` prop when modal opens

3. **Media Library Tab**:
   - Renders `MediaLibrary` component
   - Allows image selection
   - Shows "Select Image" button (disabled when no image selected)

4. **Upload Tab**:
   - Renders `UploadPane` component
   - Automatically calls `onSelect` with uploaded file name on success
   - Closes modal after successful upload

5. **Selection Flow**:
   ```typescript
   handleSelect() {
     if (selectedImage) {
       onSelect(selectedImage);  // Pass to parent
       onClose();                // Close modal
     }
   }
   ```

**Layout**:
- Full-screen modal on mobile (95vw, 90vh)
- Large modal on desktop (max-w-4xl, 85vh)
- Header with title
- Tab navigation
- Scrollable content area
- Footer with Cancel and Select buttons

**Dependencies**:
- `@/components/ui/dialog` - Modal container
- `@/components/ui/tabs` - Tab interface
- `@/components/ui/button` - Action buttons
- `@/components/builder/image-manager/MediaLibrary` - Library view
- `@/components/builder/image-manager/UploadPane` - Upload view

---

#### `builder/image-manager/MediaLibrary.tsx`

**Purpose**: Displays a grid of available images from the media library for selection

**Props Interface**:
```typescript
interface MediaLibraryProps {
  selectedImage: string | null;
  onSelect: (image: string) => void;
}
```

**Implementation Details**:

1. **Data Fetching**:
   - Uses `useImages()` hook to fetch image map
   - Returns `ImageMap` type: `{ [key: string]: string }`
   - Handles loading and error states

2. **Image Grid**:
   - Responsive grid layout:
     - 2 columns on mobile
     - 3 columns on small screens (480px+)
     - 4 columns on medium screens (768px+)
     - 5 columns on large screens (1024px+)
   - Each image in aspect-square container

3. **Image Display**:
   - Uses Next.js `Image` component with `fill` prop
   - `object-contain` to preserve aspect ratio
   - Images loaded from `getImageUrl(key)`

4. **Selection UI**:
   - Selected image shows:
     - Primary border and ring
     - Checkmark overlay
     - Primary background tint
   - Hover shows image filename at bottom
   - Click handler calls `onSelect(key)`

5. **States**:
   - Loading: Spinner icon
   - Error: Error message
   - Empty: No images message
   - Success: Grid of images

**Dependencies**:
- `@/hooks/use-images` - Data fetching
- `@/config/site` - Image URL construction
- `@/components/ui/scroll-area` - Scrollable container
- `next/image` - Image component
- `lucide-react` - Icons (Loader2, Check)

---

#### `builder/image-manager/UploadPane.tsx`

**Purpose**: File upload interface for uploading new images to the media library

**Props Interface**:
```typescript
interface UploadPaneProps {
  onUploadSuccess: (data: any, file: File) => void;
}
```

**Implementation Details**:

1. **Upload Mutation**:
   - Uses `useUploadImage()` hook with success callback
   - Automatically invalidates image cache on success
   - Shows toast notifications

2. **File Input**:
   - Hidden file input with `accept="image/*"`
   - Overlay covers entire drop zone
   - Triggers upload on file selection

3. **UI Elements**:
   - Drag-and-drop zone with dashed border
   - Upload icon in circular background
   - Instructions text
   - Loading spinner during upload

4. **Upload Flow**:
   ```typescript
   handleFileUpload(e) {
     const file = e.target.files?.[0];
     if (file) {
       uploadMutation.mutate(file);  // Triggers upload
     }
   }
   ```

5. **Success Handling**:
   - `onUploadSuccess` callback receives upload data and file
   - Typically used to auto-select uploaded image
   - Closes modal in parent component

**Dependencies**:
- `@/hooks/use-images` - Upload mutation
- `lucide-react` - Icons (Loader2, Upload)

---

#### `ui/`

**Purpose**: Collection of reusable UI components based on shadcn/ui

**Components Available** (50+ components):
- Form components: `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`
- Layout: `card`, `separator`, `container`, `resizable`
- Overlays: `dialog`, `sheet`, `drawer`, `popover`, `tooltip`, `hover-card`
- Navigation: `tabs`, `breadcrumb`, `pagination`, `navigation-menu`, `menubar`, `sidebar`
- Data display: `table`, `chart`, `badge`, `avatar`, `skeleton`, `empty`
- Feedback: `alert`, `alert-dialog`, `sonner` (toasts), `progress`, `spinner`
- Interactive: `accordion`, `collapsible`, `carousel`, `command`, `context-menu`, `dropdown-menu`
- Specialized: `calendar`, `input-otp`, `slider`, `toggle`, `toggle-group`, `aspect-ratio`, `scroll-area`

**Note**: These are standard shadcn/ui components following Radix UI patterns with Tailwind styling. They provide accessible, customizable UI primitives.

---

### config/

Application configuration files that centralize environment-specific settings and API endpoints.

#### `site.ts`

**Purpose**: Central configuration for API endpoints, media URLs, and tenant-specific settings

**Exports**:
- `siteConfig`: Configuration object with computed properties
- `getApiBaseUrl()`: Helper function to get API base URL
- `getImageUrl(path)`: Helper function to construct image URLs

**Configuration Object Structure**:
```typescript
export const siteConfig = {
  name: "Nepdora",
  description: "Nepdora Preview System",
  
  // Computed getters that read from environment or tenant config
  get apiBaseUrl() { ... },
  get mediaBaseUrl() { ... },
  get builderBaseUrl() { ... },
  
  // Endpoint builders
  get endpoints() {
    return {
      fetchImage: (path: string) => string,
      listImages: () => string,
      updateImageMap: () => string,
      uploadImage: () => string,
    };
  },
}
```

**Implementation Details**:

1. **Tenant Configuration**:
   - Reads `tenantName` from `../../tenant.json`
   - Used to construct tenant-specific URLs

2. **API Base URL**:
   - Priority: `NEXT_PUBLIC_API_URL` env var → tenant-based URL
   - Format: `https://{tenantName}.nepdora.baliyoventures.com`

3. **Media Base URL**:
   - Priority: `NEXT_PUBLIC_MEDIA_URL` env var → tenant-based URL
   - Format: `https://nepdora.baliyoventures.com/media/workspaces/{tenantName}/public`

4. **Builder Base URL**:
   - Priority: `NEXT_PUBLIC_BUILDER_URL` env var → default
   - Default: `https://builder-api.nepdora.com`

5. **Image URL Helper**:
   ```typescript
   getImageUrl(path: string): string {
     if (!path) return "";
     if (path.startsWith("http")) return path;  // Already full URL
     return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
   }
   ```

**Usage**: Imported throughout the application to construct API endpoints and media URLs consistently.

---

### contexts/

React Context providers for global application state management. These contexts provide state and functions to components throughout the component tree.

#### `AuthContext.tsx`

**Purpose**: Authentication context for customer users, managing login, signup, logout, and user state

**Context Interface**:
```typescript
interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}
```

**Provider Component**: `CustomerPublishAuthProvider`

**Implementation Details**:

1. **State Management**:
   - `user`: Current user object (null if not logged in)
   - `tokens`: Access and refresh tokens
   - `isLoading`: Loading state during auth operations

2. **Token Storage**:
   - Stores tokens in `localStorage` with key `"customer-authTokens"`
   - Format: `{ access: string, refresh: string, access_token: string }`
   - `access_token` included for backward compatibility

3. **Initialization** (useEffect):
   - Checks localStorage for stored tokens on mount
   - Decodes JWT to extract user information
   - Validates token expiration
   - Clears invalid/expired tokens
   - Sets user state if valid token found

4. **Login Function**:
   ```typescript
   async login(data: { email: string, password: string }) {
     // 1. Call loginUser API
     // 2. Decode JWT to get user info
     // 3. Store tokens in localStorage
     // 4. Update state
     // 5. Handle redirect logic:
     //    - Check sessionStorage for redirectAfterLogin
     //    - Check URL params for redirect
     //    - Extract subdomain from URL or hostname
     //    - Navigate to appropriate page
   }
   ```

5. **Signup Function**:
   - Creates new customer account
   - Does NOT auto-login (redirects to login page)
   - Extracts subdomain from URL for redirect

6. **Logout Function**:
   - Clears user state and tokens
   - Removes from localStorage
   - Clears sessionStorage redirect
   - Navigates to login page
   - Shows success toast

7. **Error Handling**:
   - Comprehensive error message extraction
   - Handles various error formats:
     - `{ errors: [{ code, message }] }` format
     - Status code-based messages
     - Network errors
   - User-friendly error messages for:
     - Too many login attempts
     - Invalid credentials
     - Account disabled
     - User not found

8. **Redirect Logic**:
   - Priority order:
     1. `sessionStorage.getItem("redirectAfterLogin")`
     2. URL parameter `?redirect=...`
     3. Extract subdomain from URL path (`/publish/{subdomain}/...`)
     4. Extract subdomain from hostname (`{subdomain}.localhost` or `{subdomain}.nepdora.com`)
     5. Fallback to user ID or email

**Dependencies**:
- `next/navigation` - for `useRouter`
- `jwt-decode` - for decoding JWT tokens
- `@/types/auth/customer/auth` - Type definitions
- `@/services/auth/customer/api` - API functions
- `sonner` - Toast notifications

**Usage**:
```tsx
const { user, login, logout, isAuthenticated } = useContext(AuthContext);
```

---

#### `CartContext.tsx`

**Purpose**: Shopping cart state management with product and variant support

**Context Interface**:
```typescript
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product, quantity, variant?) => void;
  removeFromCart: (productId, variantId?) => void;
  updateQuantity: (productId, quantity, variantId?) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}
```

**CartItem Structure**:
```typescript
interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: {
    id: number;
    price: string;
    option_values: Record<string, string>;
  } | null;
}
```

**Implementation Details**:

1. **State Management**:
   - `cartItems`: Array of cart items
   - Persisted to localStorage with key `"nepdora_cart"`

2. **Persistence**:
   - Loads from localStorage on mount
   - Saves to localStorage whenever cart changes
   - Error handling for localStorage failures

3. **Add to Cart**:
   ```typescript
   addToCart(product, quantity, variant?) {
     // 1. Normalize product to Product type
     // 2. Check if item with same product + variant exists
     // 3. If exists: increment quantity
     // 4. If not: add new item
   }
   ```
   - Handles product normalization for different product structures
   - Matches items by product ID AND variant ID (or both null)
   - Increments quantity for existing items

4. **Remove from Cart**:
   - Filters out item matching productId AND variantId
   - Uses exact match (both product and variant must match)

5. **Update Quantity**:
   - Updates quantity for matching item
   - Removes item if quantity <= 0

6. **Calculations**:
   - `itemCount`: Sum of all item quantities
   - `totalPrice`: Sum of (price × quantity) for all items
   - Uses variant price if available, otherwise product price

7. **Product Normalization**:
   - Handles different product type structures:
     - `Product` type
     - `ExtendedProduct` type
     - Generic product-like objects
   - Uses `normalizeProductForCart()` utility

**Dependencies**:
- `@/types/cart` - CartItem type
- `@/types/product` - Product types and normalization

**Usage**:
```tsx
const { cartItems, addToCart, totalPrice } = useContext(CartContext);
```

---

### hooks/

Custom React hooks that wrap React Query for data fetching and mutations. Each hook follows a consistent pattern and provides type-safe access to API data.

#### `use-mobile.tsx`

**Purpose**: Detects if the current viewport is mobile-sized

**Implementation**:
```typescript
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  
  return !!isMobile;
}
```

**Details**:
- Breakpoint: 768px (MOBILE_BREAKPOINT)
- Uses `window.matchMedia` for responsive detection
- Listens to resize events
- Returns boolean (true if mobile, false otherwise)

---

#### `use-images.ts`

**Purpose**: Image management hooks for fetching and uploading images

**Hooks**:

1. **`useImages()`**:
   ```typescript
   useQuery({
     queryKey: ["images"],
     queryFn: fetchImages,
   })
   ```
   - Returns: `{ data: ImageMap, isLoading, isError }`
   - `ImageMap` type: `{ [key: string]: string }` (key = filename, value = path)

2. **`useUploadImage(onSuccess?)`**:
   ```typescript
   useMutation({
     mutationFn: uploadImage,
     onSuccess: (data, variables) => {
       queryClient.invalidateQueries({ queryKey: ["images"] });
       toast.success("Image uploaded successfully");
       onSuccess?.(data, variables);
     },
   })
   ```
   - Takes File object
   - Invalidates images cache on success
   - Shows toast notification
   - Calls optional success callback

**Dependencies**:
- `@tanstack/react-query` - Query and mutation hooks
- `@/services/image-service` - API functions
- `sonner` - Toast notifications

---

#### `use-services.ts`

**Purpose**: Service management hooks with full CRUD operations

**Query Keys Factory**:
```typescript
export const servicesKeys = {
  all: ["services"] as const,
  lists: () => [...servicesKeys.all, "list"] as const,
  list: (filters: ServicesFilters) => [...servicesKeys.lists(), filters] as const,
  details: () => [...servicesKeys.all, "detail"] as const,
  detail: (slug: string) => [...servicesKeys.details(), slug] as const,
};
```

**Hooks**:

1. **`useServices(filters?, options?)`**:
   - Fetches paginated list of services
   - Supports filters: `search`, `page`, `page_size`, `ordering`
   - Returns: `PaginatedServicesResponse`

2. **`useService(slug, options?)`**:
   - Fetches single service by slug
   - Enabled only when slug is provided
   - Cache time: 6 hours

3. **`useCreateService()`**:
   - Mutation for creating services
   - Invalidates list cache on success
   - Takes `CreateServicesPost` data (includes File for thumbnail)

4. **`useUpdateService()`**:
   - Mutation for updating services
   - Updates cache optimistically
   - Invalidates list cache

5. **`useDeleteService()`**:
   - Mutation for deleting services
   - Invalidates all service queries

**Type Definitions** (from `@/types/services`):
```typescript
interface ServicesPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateServicesPost {
  title: string;
  description: string;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  meta_title?: string;
  meta_description?: string;
}
```

**Dependencies**:
- `@/services/api/services` - API functions
- `@/types/services` - Type definitions

---

#### `use-blogs.ts`

**Purpose**: Blog post management hooks with tags support

**Query Keys Factory**:
```typescript
export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (filters: BlogFilters) => [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (slug: string) => [...blogKeys.details(), slug] as const,
  similars: () => [...blogKeys.all, "similar"] as const,
  similar: (slug: string) => [...blogKeys.similars(), slug] as const,
  tags: () => [...blogKeys.all, "tags"] as const,
};
```

**Hooks**:

1. **`useBlogs(filters?, options?)`**:
   - Fetches paginated blog posts
   - Filters: `tags[]`, `author`, `search`, `page`, `page_size`, `ordering`, `is_published`
   - Returns: `PaginatedBlogResponse`

2. **`useBlog(slug, options?)`**:
   - Fetches single blog post
   - Cache time: 6 hours

3. **`useBlogTags()`**:
   - Fetches all blog tags
   - Cache time: 5 minutes

4. **`useCreateBlogTag()`**:
   - Creates new tag
   - Optimistically updates tags cache

5. **`useCreateBlog()`**:
   - Creates blog post with tags
   - Invalidates list cache

6. **`useUpdateBlog()`**:
   - Updates blog post
   - Updates cache optimistically

7. **`useDeleteBlog()`**:
   - Deletes blog post
   - Invalidates all blog queries

8. **`useRecentBlogs()`**:
   - Fetches recent blog posts
   - Cache time: 5 minutes

**Type Definitions** (from `@/types/blog`):
```typescript
interface BlogPost {
  id: number;
  author: BlogAuthor | null;
  title: string;
  slug: string;
  content: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: BlogTag[];
  created_at: string;
  updated_at: string;
  is_published?: boolean;
  time_to_read?: string;
}

interface BlogTag {
  id: number;
  name: string;
  slug: string;
}
```

---

#### `use-booking.ts`

**Purpose**: Booking/appointment management hooks

**Hooks**:

1. **`useGetBookings(filters)`**:
   - Fetches paginated bookings
   - Filters: `page`, `page_size`, `search`
   - Returns: `PaginatedBookings`

2. **`useGetBooking(id)`**:
   - Fetches single booking by ID
   - Enabled only when ID provided

3. **`useUpdateBooking()`**:
   - Updates booking data
   - Invalidates both list and detail caches

**Type Definitions** (from `@/types/booking`):
```typescript
interface Booking {
  id: number;
  // ... booking fields
}

interface BookingFilters {
  page?: number;
  page_size?: number;
  search?: string;
}
```

---

#### `use-contact.ts`

**Purpose**: Contact form management hooks

**Hooks**:

1. **`useGetContacts(filters)`**:
   - Fetches paginated contact submissions
   - Filters: `page`, `page_size`, `search`

2. **`useSubmitContactForm(siteUser)`**:
   - Submits contact form
   - Transforms `ContactFormSubmission` to `ContactFormData`
   - Shows success/error toasts

**Type Definitions** (from `@/types/contact`):
```typescript
interface Contact {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  message: string;
  created_at: string;
  updated_at: string;
}

interface ContactFormSubmission {
  name: string;
  email?: string;
  phone_number?: string;
  message: string;
}
```

---

#### `use-faq.ts`

**Purpose**: FAQ management hooks

**Query Keys Factory**:
```typescript
export const faqKeys = {
  all: ["faqs"] as const,
  lists: () => [...faqKeys.all, "list"] as const,
  details: () => [...faqKeys.all, "detail"] as const,
  detail: (id: number) => [...faqKeys.details(), id] as const,
};
```

**Hooks**:

1. **`useFAQs()`**:
   - Fetches all FAQs
   - Cache time: 5 minutes

2. **`useFAQ(id)`**:
   - Fetches single FAQ

3. **`useCreateFAQ()`**:
   - Creates FAQ
   - Shows success toast

4. **`useUpdateFAQ()`**:
   - Updates FAQ
   - Updates cache optimistically

5. **`useDeleteFAQ()`**:
   - Deletes FAQ
   - Removes from cache

**Type Definitions** (from `@/types/faq`):
```typescript
interface FAQ {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}
```

---

#### `use-portfolio.ts`

**Purpose**: Portfolio item management hooks with tags and categories

**Query Keys Factory**:
```typescript
export const portfolioKeys = {
  all: ["portfolios"] as const,
  lists: () => [...portfolioKeys.all, "list"] as const,
  list: (filters: PortfolioFilters) => [...portfolioKeys.lists(), filters] as const,
  details: () => [...portfolioKeys.all, "detail"] as const,
  detail: (slug: string) => [...portfolioKeys.details(), slug] as const,
  tags: () => [...portfolioKeys.all, "tags"] as const,
  categories: () => [...portfolioKeys.all, "categories"] as const,
};
```

**Hooks**:

1. **`usePortfolios(filters?, options?)`**:
   - Fetches paginated portfolios
   - Filters: `tags[]`, `category`, `search`, `page`, `page_size`, `ordering`

2. **`usePortfolio(slug, options?)`**:
   - Fetches single portfolio
   - Cache time: 6 hours

3. **`usePortfolioTags()`**:
   - Fetches all portfolio tags

4. **`usePortfolioCategories()`**:
   - Fetches all portfolio categories

5. **`useCreatePortfolioTag()`**:
   - Creates tag
   - Updates cache optimistically

6. **`useCreatePortfolioCategory()`**:
   - Creates category
   - Updates cache optimistically

7. **`useCreatePortfolio()`**:
   - Creates portfolio item

8. **`useUpdatePortfolio()`**:
   - Updates portfolio

9. **`useDeletePortfolio()`**:
   - Deletes portfolio

**Type Definitions** (from `@/types/portfolio`):
```typescript
interface Portfolio {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  category: PortfolioCategory;
  tags: PortfolioTag[];
  project_url: string | null;
  github_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}
```

---

#### `use-pricing.ts`

**Purpose**: Pricing plan management hooks

**Hooks**:

1. **`usePricings(params?)`**:
   - Fetches pricing plans
   - Params: `search`, `sortBy`, `sortOrder`
   - Cache time: 5 minutes

2. **`usePricing(id)`**:
   - Fetches single pricing plan
   - Enabled only when ID provided

3. **`useCreatePricing()`**:
   - Creates pricing plan
   - Shows success toast

4. **`useUpdatePricing()`**:
   - Updates pricing plan
   - Invalidates caches

5. **`useDeletePricing()`**:
   - Deletes pricing plan
   - Shows success toast

**Type Definitions** (from `@/types/pricing`):
```typescript
interface Pricing {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  description: string;
  is_popular: boolean;
  features: PricingFeature[];
  created_at: string;
  updated_at: string;
}

interface PricingFeature {
  id?: number;
  feature: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}
```

---

#### `use-testimonials.ts`

**Purpose**: Testimonial management hooks

**Query Keys Factory**:
```typescript
export const testimonialKeys = {
  all: ["testimonials"] as const,
  lists: () => [...testimonialKeys.all, "list"] as const,
  list: (filters: string) => [...testimonialKeys.lists(), { filters }] as const,
  details: () => [...testimonialKeys.all, "detail"] as const,
  detail: (id: number) => [...testimonialKeys.details(), id] as const,
};
```

**Hooks**:

1. **`useTestimonials()`**:
   - Fetches all testimonials
   - Cache time: 5 minutes
   - Retry: 3 times with exponential backoff

2. **`useTestimonial(id)`**:
   - Fetches single testimonial

3. **`useCreateTestimonial()`**:
   - Creates testimonial (with image upload)
   - Invalidates list cache

4. **`useUpdateTestimonial()`**:
   - Updates testimonial
   - Updates cache optimistically

5. **`useDeleteTestimonial()`**:
   - Deletes testimonial
   - Removes from cache

**Type Definitions** (from `@/types/testimonial`):
```typescript
interface Testimonial {
  id: number;
  name: string;
  designation: string;
  image: string | null;
  comment: string;
  created_at: string;
  updated_at: string;
}
```

---

#### `use-videos.ts`

**Purpose**: Video management hooks

**Hooks**:

1. **`useVideos()`**:
   - Fetches all videos
   - Cache time: 5 minutes

2. **`useCreateVideo()`**:
   - Creates video entry
   - Shows success toast

3. **`useUpdateVideo()`**:
   - Updates video
   - Shows success toast

4. **`useDeleteVideo()`**:
   - Deletes video
   - Shows success toast

**Type Definitions** (from `@/types/videos`):
```typescript
interface Video {
  id: number;
  url: string;
  title?: string;
  description?: string;
  platform?: VideoPlatform;
  created_at: string;
  updated_at: string;
}

type Videos = Video[];
```

---

#### `use-whatsapp.ts`

**Purpose**: WhatsApp configuration management hooks

**Query Keys Factory**:
```typescript
export const whatsappKeys = {
  all: ["whatsapp"] as const,
  lists: () => [...whatsappKeys.all, "list"] as const,
  list: (filters: string) => [...whatsappKeys.lists(), { filters }] as const,
  details: () => [...whatsappKeys.all, "detail"] as const,
  detail: (id: string) => [...whatsappKeys.details(), id] as const,
};
```

**Hooks**:

1. **`useWhatsApps()`**:
   - Fetches all WhatsApp configurations

2. **`useWhatsApp(id)`**:
   - Fetches single config
   - Enabled only when ID provided

3. **`useCreateWhatsApp()`**:
   - Creates WhatsApp config

4. **`useUpdateWhatsApp()`**:
   - Updates WhatsApp config

5. **`useDeleteWhatsApp()`**:
   - Deletes WhatsApp config

**Type Definitions** (from `@/types/whatsapp`):
```typescript
interface WhatsApp {
  id: string;
  message: string;
  phone_number: string;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}
```

---

#### `use-newsletter.ts`

**Purpose**: Newsletter subscription management hooks

**Query Keys Factory**:
```typescript
export const newsletterKeys = {
  all: ["newsletter"] as const,
  lists: () => [...newsletterKeys.all, "list"] as const,
  list: (page: number, pageSize: number, search: string) =>
    [...newsletterKeys.lists(), { page, pageSize, search }] as const,
};
```

**Hooks**:

1. **`useNewsletters(page, pageSize, search)`**:
   - Fetches paginated newsletter subscriptions
   - Defaults: page=1, pageSize=10, search=""

2. **`useCreateNewsletter()`**:
   - Creates newsletter subscription
   - Invalidates list cache

**Type Definitions** (from `@/types/newsletter`):
```typescript
interface Newsletter {
  id: number;
  email: string;
  is_subscribed: boolean;
  created_at: string;
  updated_at: string;
}
```

---

#### `use-site-config.ts`

**Purpose**: Site configuration management hooks

**Hooks**:

1. **`useSiteConfig()`**:
   - Fetches site configuration
   - **Infinite cache** (never stale, never removed)
   - No refetch on window focus, mount, or reconnect
   - Retry: 3 times
   - Uses placeholder data to prevent loading flicker

2. **`useCreateSiteConfig()`**:
   - Creates site configuration
   - Updates cache optimistically

3. **`usePatchSiteConfig()`**:
   - Updates site configuration
   - Updates cache optimistically

4. **`useDeleteSiteConfig()`**:
   - Deletes site configuration
   - Sets cache to null

**Type Definitions** (from `@/types/site-config`):
```typescript
interface SiteConfig {
  id: number;
  favicon: string | null;
  logo: string | null;
  business_name: string;
  business_description?: string | null;
  address?: string | null;
  phone?: string | null;
  email: string;
  working_hours?: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
}
```

---

#### Additional Hooks

**`use-appointment.ts`**:
- `useGetAppointments(filters)`: Fetches appointments with filters (status, date_from, date_to, time)
- `useGetAppointmentReasons()`: Fetches appointment reason options
- `useSubmitAppointmentForm()`: Creates appointment (public form)
- `useUpdateAppointment()`: Updates appointment (admin)
- `useDeleteAppointment()`: Deletes appointment (admin)

**`use-banner.ts`**:
- `useBanners()`: Fetches all banners
- `useBanner(id)`: Fetches single banner
- `useCreateBannerWithImages()`: Creates banner with image array
- `useUpdateBannerWithImages()`: Updates banner with images
- `useDeleteBanner()`: Deletes banner

**`use-team-member.ts`**:
- `useTeamMembers()`: Fetches all team members
- `useCreateTeamMember()`: Creates team member (FormData)
- `useUpdateTeamMember()`: Updates team member (FormData)
- `useDeleteTeamMember()`: Deletes team member

**`use-collections.ts`**: Collection management
**`use-google-analytics.ts`**: Google Analytics integration
**`use-our-client.ts`**: Client management
**`use-popup.ts`**: Popup management
**`use-template.ts`**: Template management

---

### lib/

Utility libraries and helper functions used throughout the application.

#### `utils.ts`

**Purpose**: General utility functions for common operations

**Exports**:
- `cn(...inputs: ClassValue[]): string`

**Implementation**:
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Details**:
- Combines `clsx` (conditional class names) with `tailwind-merge`
- `tailwind-merge` resolves Tailwind class conflicts (e.g., `p-2 p-4` → `p-4`)
- Used throughout the app for conditional className merging

**Usage**:
```typescript
cn("base-class", condition && "conditional-class", "another-class");
```

**Dependencies**:
- `clsx` - Conditional class name utility
- `tailwind-merge` - Tailwind class conflict resolution

---

#### `jwt-utils.ts`

**Purpose**: JWT token decoding and validation utilities

**Exports**:
- `base64UrlDecode(str: string): string`
- `decodeJWT(token: string): JWTPayload | null`
- `isTokenExpired(exp: number): boolean`
- `JWTPayload` interface

**Implementation Details**:

1. **`base64UrlDecode()`**:
   ```typescript
   function base64UrlDecode(str: string): string {
     // Replace URL-safe characters
     str = str.replace(/-/g, "+").replace(/_/g, "/");
     // Add padding if needed
     while (str.length % 4) str += "=";
     // Decode base64
     const decoded = atob(str);
     // Decode URI component
     return decodeURIComponent(escape(decoded));
   }
   ```
   - Converts base64url to standard base64
   - Adds padding if needed
   - Decodes and handles URI encoding

2. **`decodeJWT()`**:
   ```typescript
   function decodeJWT(token: string): JWTPayload | null {
     const parts = token.split(".");
     if (parts.length !== 3) return null;  // Invalid format
     const payload = base64UrlDecode(parts[1]);  // Decode payload (middle part)
     return JSON.parse(payload) as JWTPayload;
   }
   ```
   - Validates JWT format (3 parts separated by dots)
   - Decodes payload (middle part)
   - Returns parsed payload or null on error

3. **`isTokenExpired()`**:
   ```typescript
   function isTokenExpired(exp: number): boolean {
     const currentTime = Math.floor(Date.now() / 1000);
     return currentTime >= exp;
   }
   ```
   - Compares expiration timestamp with current time
   - `exp` is Unix timestamp in seconds

4. **`JWTPayload` Interface**:
   ```typescript
   interface JWTPayload {
     token_type: string;
     exp: number;  // Expiration timestamp
     iat: number;  // Issued at timestamp
     jti: string;   // JWT ID
     user_id: number;
     email: string;
     store_name: string;
     has_profile: boolean;
     role: string;
     phone_number: string;
     domain: string;
     sub_domain: string;
     has_profile_completed: boolean;
     is_template_account: boolean;
     first_login?: boolean;
     is_onboarding_complete?: boolean;
     website_type?: string;
   }
   ```

**Usage**: Used in AuthContext and server-side utilities to decode and validate JWT tokens.

---

#### `string-utils.ts`

**Purpose**: String manipulation utilities

**Exports**:
- `capitalizeWords(str: string): string`

**Implementation**:
```typescript
export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
```

**Details**:
- Splits string by spaces
- Capitalizes first letter of each word
- Lowercases rest of each word
- Joins with spaces

**Example**:
```typescript
capitalizeWords("hello world") // "Hello World"
capitalizeWords("HELLO WORLD") // "Hello World"
```

---

#### `video-utils.ts`

**Purpose**: Video URL parsing, embedding, and thumbnail generation for multiple platforms

**Exports**:
- `VideoPlatform` type
- `VideoInfo` interface
- `extractVideoInfo(url: string): VideoInfo`
- `getVideoEmbedUrl(platform, id, originalUrl): string | null`
- `getVideoThumbnail(platform, id): string | null`

**Type Definitions**:
```typescript
type VideoPlatform = "youtube" | "facebook" | "instagram" | "tiktok" | "other";

interface VideoInfo {
  platform: VideoPlatform;
  id: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
}
```

**Implementation Details**:

1. **`extractVideoInfo()`**:
   - Tests URL against regex patterns for each platform
   - Extracts video ID from URL
   - Returns platform, ID, embed URL, and thumbnail URL
   - Patterns supported:
     - **YouTube**: `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/embed/`, `youtube.com/shorts/`
     - **TikTok**: `tiktok.com/@user/video/`, `vm.tiktok.com/`
     - **Instagram**: `instagram.com/p/`, `instagram.com/reel/`
     - **Facebook**: `facebook.com/reel/`, `facebook.com/watch/`, `fb.watch/`

2. **`getVideoEmbedUrl()`**:
   - Generates embed URLs for each platform:
     - YouTube: `https://www.youtube.com/embed/{id}?rel=0`
     - Facebook: Uses Facebook embed plugin URL
     - Instagram: `https://www.instagram.com/p/{id}/embed`
     - TikTok: `https://www.tiktok.com/video/{id}`

3. **`getVideoThumbnail()`**:
   - Only YouTube supports thumbnail URLs
   - Format: `https://img.youtube.com/vi/{id}/hqdefault.jpg`
   - Other platforms return null (UI should show placeholder)

**Usage**: Used when processing video URLs to extract information and generate embed codes.

---

#### `server/get-subdomain.ts`

**Purpose**: Server-side utility to extract subdomain from JWT token stored in cookies

**Exports**:
- `getSubDomain(): Promise<string | null>`

**Implementation**:
```typescript
export async function getSubDomain(): Promise<string | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;
  
  if (!authToken) return null;
  
  const payload = decodeJWT(authToken) as JWTPayload;
  if (!payload || isTokenExpired(payload.exp)) return null;
  
  return payload.sub_domain || null;
}
```

**Details**:
- Uses Next.js `cookies()` function (server-side only)
- Reads `authToken` cookie
- Decodes JWT to extract `sub_domain` field
- Validates token expiration
- Returns subdomain string or null

**Usage**: Used in server components and API routes to determine tenant subdomain.

**Note**: Marked with `"use server"` directive for Next.js server actions.

---

### schemas/

Zod validation schemas for form validation. These schemas provide runtime type checking and validation for form inputs.

#### `customer/login.form.ts`

**Purpose**: Login form validation schema

**Schema**:
```typescript
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

**Validation Rules**:
- `email`: Must be valid email format
- `password`: Required (minimum 1 character)

**Usage**: Used in login forms with react-hook-form or similar form libraries.

---

#### `customer/signup.form.ts`

**Purpose**: Signup form validation schema

**Schema**:
```typescript
export const signupSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    first_name: z.string().min(1, { message: "First name is required." }).optional(),
    last_name: z.string().min(1, { message: "Last name is required." }).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

**Validation Rules**:
- `email`: Valid email format
- `password`: Minimum 8 characters
- `confirmPassword`: Must match password (custom refinement)
- `first_name`, `last_name`: Optional but if provided, must be at least 1 character
- `phone`, `address`: Optional strings

**Usage**: Used in signup forms with password confirmation validation.

---

#### `services.form.ts`

**Purpose**: Service form validation schema

**Schema**:
```typescript
export const servicesFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description is required."),
  meta_title: z.string().max(60, "Meta title should be under 60 characters.").optional(),
  meta_description: z.string().max(160, "Meta description should be under 160 characters.").optional(),
  thumbnail_image: z.any().optional(),
  thumbnail_image_alt_description: z.string().optional(),
});
```

**Validation Rules**:
- `title`: Minimum 3 characters
- `description`: Minimum 10 characters
- `meta_title`: Maximum 60 characters (SEO best practice)
- `meta_description`: Maximum 160 characters (SEO best practice)
- `thumbnail_image`: Any type (File object in practice)
- `thumbnail_image_alt_description`: Optional string

---

#### `blog.form.ts`

**Purpose**: Blog post form validation schema

**Schema**:
```typescript
export const blogFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  content: z.string().min(10, "Content is required."),
  meta_title: z.string().max(60, "Meta title should be under 60 characters.").optional(),
  meta_description: z.string().max(160, "Meta description should be under 160 characters.").optional(),
  thumbnail_image: z.any().optional(),
  thumbnail_image_alt_description: z.string().optional(),
  tag_ids: z.array(z.number()).optional(),
});
```

**Validation Rules**:
- Similar to services schema
- `content`: Minimum 10 characters (blog content)
- `tag_ids`: Optional array of numbers (tag IDs)

---

#### `portfolio.form.ts`

**Purpose**: Portfolio form validation schema

**Schema**:
```typescript
export const portfolioFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  content: z.string().min(10, "Content is required."),
  category: z.number().refine(val => val !== null && val !== undefined, {
    message: "Please select a category.",
  }),
  meta_title: z.string().max(60, "Meta title should be under 60 characters.").optional(),
  meta_description: z.string().max(160, "Meta description should be under 160 characters.").optional(),
  thumbnail_image: z.any().optional(),
  thumbnail_image_alt_description: z.string().optional(),
  tags: z.array(z.number()).optional(),
  project_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});
```

**Validation Rules**:
- `category`: Required number (category ID)
- `tags`: Optional array of numbers (tag IDs)
- `project_url`, `github_url`: Optional URLs or empty strings

---

#### Additional Schemas

- `category.form.ts`: Category form validation
- `chekout.form.ts`: Checkout form validation
- `issues.form.ts`: Issues form validation
- `login.form.ts`: General login form (non-customer)
- `product.form.ts`: Product form validation
- `promocode.form.ts`: Promo code form validation
- `signup.form.ts`: General signup form (non-customer)
- `template-account.form.ts`: Template account form validation

---

### services/

API service layer that handles all HTTP requests to the backend. Services are organized by feature and provide type-safe API functions.

#### `image-service.ts`

**Purpose**: Image management API service for builder system

**Exports**:
- `ImageMap` interface
- `fetchImages(): Promise<ImageMap>`
- `uploadImage(file: File): Promise<ImageMap>`
- `updateImageMap(key: string, imagePath: string): Promise<ImageMap>`

**Type Definition**:
```typescript
interface ImageMap {
  [key: string]: string;  // key = filename, value = file path
}
```

**Implementation Details**:

1. **`fetchImages()`**:
   - GET request to `siteConfig.endpoints.listImages()`
   - Returns image map object

2. **`uploadImage()`**:
   - POST request with FormData containing file
   - Endpoint: `siteConfig.endpoints.uploadImage()`
   - Returns updated image map

3. **`updateImageMap()`**:
   - POST request to update image mapping
   - Body: `{ key: string, image: string }`
   - Used to associate image keys with file paths

**Dependencies**:
- `@/config/site` - for endpoint URLs

---

#### `auth/customer/api.ts`

**Purpose**: Customer authentication API functions

**Exports**:
- `signupUser(data: SignupData): Promise<SignupResponse>`
- `loginUser(data: LoginData): Promise<LoginResponse>`

**Type Definitions**:
```typescript
interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  website_type: "ecommerce" | "service";
}

interface LoginData {
  email: string;
  password: string;
}
```

**Implementation**:

1. **`signupUser()`**:
   - POST to `/api/customer/register/`
   - Returns user data (no tokens - user must login)

2. **`loginUser()`**:
   - POST to `/api/customer/login/`
   - Returns `{ message: string, tokens: { access, refresh } }`
   - Throws error with message on failure

**Error Handling**: Parses error response and throws Error with message.

---

#### `api/services.ts`

**Purpose**: Service management API with full CRUD operations

**Exports**: `servicesApi` object with methods

**Methods**:

1. **`getServices(filters?)`**:
   - GET `/api/service/` with query params
   - Filters: `page`, `page_size`, `search`, `ordering`
   - Returns: `PaginatedServicesResponse`

2. **`getServiceBySlug(slug)`**:
   - GET `/api/service/{slug}/`
   - Returns: `ServicesPost`

3. **`create(serviceData)`**:
   - POST `/api/service/` with FormData
   - Converts data to FormData (handles File objects)
   - Includes Authorization header
   - Returns: `ServicesPost`

4. **`update(slug, serviceData)`**:
   - PATCH `/api/service/{slug}/` with FormData
   - Returns: `ServicesPost`

5. **`delete(slug)`**:
   - DELETE `/api/service/{slug}/`
   - No return value

**FormData Building**:
```typescript
function buildServicesFormData(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (value instanceof File) formData.append(key, value);
    else if (typeof value === "boolean") formData.append(key, value.toString());
    else if (typeof value === "number") formData.append(key, value.toString());
    else if (typeof value === "string") formData.append(key, value);
  });
  return formData;
}
```

**Dependencies**:
- `@/config/site` - API base URL
- `@/utils/headers` - Header creation
- `@/utils/auth` - Token retrieval
- `@/utils/api-error` - Error handling
- `@/types/services` - Type definitions

---

#### `api/blog.ts`

**Purpose**: Blog management API with tags support

**Methods**:

1. **`getBlogs(filters?)`**:
   - GET `/api/blogs/` with query params
   - Filters: `page`, `page_size`, `search`, `is_published`, `ordering`, `author`, `tags[]`
   - Returns: `PaginatedBlogResponse`

2. **`getBlogBySlug(slug)`**:
   - GET `/api/blogs/{slug}/`
   - Returns: `BlogPost`

3. **`getTags()`**:
   - GET `/api/tags/`
   - Returns: `BlogTag[]`

4. **`createTag(tagData)`**:
   - POST `/api/tags/` with JSON
   - Body: `{ name: string }`
   - Returns: `BlogTag`

5. **`create(blogData)`**:
   - POST `/api/blogs/` with FormData
   - Handles `tag_ids` array (appends multiple times)
   - Returns: `BlogPost`

6. **`update(slug, blogData)`**:
   - PATCH `/api/blogs/{slug}/` with FormData
   - Returns: `BlogPost`

7. **`delete(slug)`**:
   - DELETE `/api/blogs/{slug}/`

8. **`getRecentBlogs()`**:
   - GET `/api/recent-blogs/`
   - Returns: `BlogPost[]`

**Special Handling**: `tag_ids` array is appended multiple times to FormData for Django backend.

---

#### `api/booking.ts`

**Purpose**: Booking management API

**Methods**:

1. **`getBookings(filters)`**:
   - GET `/api/collections/booking/data/` with pagination
   - Filters: `page`, `page_size`, `search`
   - Returns: `PaginatedBookings`

2. **`getBookingById(id)`**:
   - GET `/api/collections/booking/data/{id}/`
   - Returns: `Booking`

3. **`updateBooking(id, data)`**:
   - PATCH `/api/collections/booking/data/{id}/`
   - Body: `{ data: Partial<BookingData> }`
   - Returns: `Booking`

**Note**: Uses collection-based API structure (`/api/collections/booking/data/`).

---

#### `api/contact.ts`

**Purpose**: Contact form API

**Methods**:

1. **`getContacts(filters)`**:
   - GET `/api/contact/` with pagination
   - Filters: `page`, `page_size`, `search`
   - Returns: `PaginatedContacts`

2. **`createContact(contactData)`**:
   - POST `/api/contact/` with JSON
   - Body: `ContactFormData`
   - Returns: `Contact`

---

#### `api/faq.ts`

**Purpose**: FAQ management API

**Methods**:

1. **`getFAQs()`**:
   - GET `/api/faq/`
   - Returns: `FAQ[]`

2. **`getFAQ(id)`**:
   - GET `/api/faq/{id}/`
   - Returns: `GetFAQResponse`

3. **`createFAQ(data)`**:
   - POST `/api/faq/` with JSON
   - Body: `CreateFAQRequest`
   - Returns: `CreateFAQResponse`

4. **`updateFAQ(id, data)`**:
   - PATCH `/api/faq/{id}/` with JSON
   - Returns: `UpdateFAQResponse`

5. **`deleteFAQ(id)`**:
   - DELETE `/api/faq/{id}/`
   - Returns: `DeleteFAQResponse` or empty response

**Error Handling**: Uses `handleApiError()` for consistent error handling.

---

#### `api/portfolio.ts`

**Purpose**: Portfolio management API with tags and categories

**Methods**:

1. **`getPortfolios(filters?)`**:
   - GET `/api/portfolio/` with query params
   - Filters: `page`, `page_size`, `search`, `ordering`, `category`, `tags[]`
   - Returns: `PaginatedPortfolioResponse`

2. **`getPortfolioBySlug(slug)`**:
   - GET `/api/portfolio/{slug}/`
   - Returns: `Portfolio`

3. **`getTags()`**:
   - GET `/api/portfolio-tags/`
   - Returns: `PortfolioTag[]`

4. **`getCategories()`**:
   - GET `/api/portfolio/category/`
   - Returns: `PortfolioCategory[]`

5. **`createTag(tagData)`**:
   - POST `/api/portfolio-tags/` with JSON
   - Returns: `PortfolioTag`

6. **`createCategory(categoryData)`**:
   - POST `/api/portfolio/category/` with JSON
   - Returns: `PortfolioCategory`

7. **`create(portfolioData)`**:
   - POST `/api/portfolio/` with FormData
   - Handles `tags` array (appends multiple times)
   - Returns: `Portfolio`

8. **`update(slug, portfolioData)`**:
   - PATCH `/api/portfolio/{slug}/` with FormData
   - Returns: `Portfolio`

9. **`delete(slug)`**:
   - DELETE `/api/portfolio/{slug}/`

---

#### `api/pricing.ts`

**Purpose**: Pricing plan API

**Methods**:

1. **`getPricings(params?)`**:
   - GET `/api/our-pricing/` with query params
   - Params: `search`, `ordering` (sortBy with sortOrder)
   - Returns: `GetPricingsResponse` with `results` and `count`
   - Handles both array and paginated response formats

2. **`getPricing(id)`**:
   - GET `/api/our-pricing/{id}/`
   - Returns: `Pricing`

3. **`createPricing(data)`**:
   - POST `/api/our-pricing/` with JSON
   - Body: `CreatePricingRequest`
   - Returns: `CreatePricingResponse` with message

4. **`updatePricing(id, data)`**:
   - PATCH `/api/our-pricing/{id}/` with JSON
   - Returns: `UpdatePricingResponse`

5. **`deletePricing(id)`**:
   - DELETE `/api/our-pricing/{id}/`
   - Returns: `DeletePricingResponse` with message

**Sorting**: Converts `sortBy` and `sortOrder` to Django ordering format (`-field` for desc).

---

#### `api/testimonials.ts`

**Purpose**: Testimonial management API with image upload

**Methods**:

1. **`getAll()`**:
   - GET `/api/testimonial/`
   - Returns: `TestimonialResponse` (array)

2. **`getById(id)`**:
   - GET `/api/testimonial/{id}/`
   - Returns: `Testimonial`

3. **`create(data)`**:
   - POST `/api/testimonial/` with FormData
   - Handles File object for image
   - Returns: `Testimonial`

4. **`update(id, data)`**:
   - PATCH `/api/testimonial/{id}/` with FormData
   - Returns: `Testimonial`

5. **`delete(id)`**:
   - DELETE `/api/testimonial/{id}/`
   - Returns success message or JSON response

**FormData Creation**: Converts data to FormData, handling File objects specially.

---

#### `api/videos.ts`

**Purpose**: Video management API

**Methods**:

1. **`getVideos()`**:
   - GET `/api/videos/`
   - Returns: `Videos` (array)

2. **`createVideo(data)`**:
   - POST `/api/videos/` with JSON
   - Body: `CreateVideoData`
   - Returns: `Video`

3. **`updateVideo(id, data)`**:
   - PUT `/api/videos/{id}/` with JSON
   - Body: `UpdateVideoData`
   - Returns: `Video`

4. **`deleteVideo(id)`**:
   - DELETE `/api/videos/{id}/`
   - No return value

**Note**: Uses PUT for updates (not PATCH).

---

#### `api/whatsapp.ts`

**Purpose**: WhatsApp configuration API

**Methods**:

1. **`getWhatsApps()`**:
   - GET `/api/whatsapp/`
   - Returns: `WhatsApp[]`

2. **`getWhatsApp(id)`**:
   - GET `/api/whatsapp/{id}/`
   - Returns: `GetWhatsAppResponse`

3. **`createWhatsApp(data)`**:
   - POST `/api/whatsapp/` with JSON
   - Returns: `CreateWhatsAppResponse`

4. **`updateWhatsApp(id, data)`**:
   - PATCH `/api/whatsapp/{id}/` with JSON
   - Returns: `UpdateWhatsAppResponse`

5. **`deleteWhatsApp(id)`**:
   - DELETE `/api/whatsapp/{id}/`
   - Returns: `DeleteWhatsAppResponse`

**Note**: ID is string type (not number).

---

#### `api/newsletter.ts`

**Purpose**: Newsletter subscription API

**Methods**:

1. **`getNewsletters(page, pageSize, search)`**:
   - GET `/api/newsletter/` with pagination
   - Query params: `page`, `page_size`, `search`
   - Returns: `GetNewslettersResponse`

2. **`createNewsletter(data)`**:
   - POST `/api/newsletter/` with JSON
   - Body: `CreateNewsletterRequest`
   - Returns: `CreateNewsletterResponse`

---

#### `api/site-config.ts`

**Purpose**: Site configuration API with file uploads

**Methods**:

1. **`getSiteConfig()`**:
   - GET `/api/site-config/` with `cache: "no-store"`
   - Handles both array and object responses
   - Returns first item if array, or object, or null
   - Returns: `SiteConfig | null`

2. **`createSiteConfig(configData, accessToken?)`**:
   - POST `/api/site-config/` with FormData
   - Optional access token for authorization
   - Returns: `SiteConfig`

3. **`patchSiteConfig(configId, configData, accessToken?)`**:
   - PATCH `/api/site-config/{id}/` with FormData
   - Returns: `SiteConfig`

4. **`deleteSiteConfig(configId, accessToken?)`**:
   - DELETE `/api/site-config/{id}/`
   - No return value

**Error Handling**: Comprehensive network error handling with user-friendly messages.

---

#### Additional API Services

**`api/appointment.ts`**:
- `getAppointments(filters)`: GET with filters (status, date_from, date_to, time)
- `createAppointment(data)`: POST
- `updateAppointment(id, data)`: PATCH
- `deleteAppointment(id)`: DELETE
- `getAppointmentReasons()`: GET appointment reason options

**`api/banner.ts`**:
- `getBanners()`: GET all banners
- `getBanner(id)`: GET single banner
- `createBannerWithImages(data)`: POST with nested images array in FormData
- `updateBannerWithImages(id, data)`: PATCH with images
- `deleteBanner(id)`: DELETE
- Special FormData preparation for nested image arrays

**`api/team-member.ts`**:
- `getTeamMembers()`: GET all team members
- `createTeamMember(data)`: POST with FormData
- `updateTeamMember(id, data)`: PUT with FormData
- `deleteTeamMember(id)`: DELETE

**`api/category.ts`**: Category management
**`api/collection.ts`**: Collection management
**`api/google-analytics.ts`**: Google Analytics integration
**`api/issues.ts`**: Issues management
**`api/our-client.ts`**: Client management
**`api/popup.ts`**: Popup management
**`api/template.ts`**: Template management

---

### types/

TypeScript type definitions and interfaces. These types ensure type safety across the application and match API response structures.

#### `auth/customer/auth.ts`

**Purpose**: Customer authentication type definitions

**Type Definitions**:
```typescript
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  username?: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface DecodedAccessToken {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface SignupResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
}

interface LoginResponse {
  message: string;
  tokens: {
    refresh: string;
    access: string;
  };
}
```

**Usage**: Used in AuthContext and authentication services.

---

#### `services.ts`

**Purpose**: Service type definitions

**Type Definitions**:
```typescript
interface ServicesPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginatedServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServicesPost[];
}

interface ServicesFilters {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

interface CreateServicesPost {
  title: string;
  description: string;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  meta_title?: string;
  meta_description?: string;
}

interface UpdateServicesPost extends Partial<CreateServicesPost> {
  id: number;
}
```

**Key Points**:
- `thumbnail_image` is `string` in response, `File | null` in create/update
- Pagination follows Django REST framework format
- Filters match API query parameters

---

#### `blog.ts`

**Purpose**: Blog post type definitions

**Type Definitions**:
```typescript
interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

interface BlogAuthor {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface BlogPost {
  id: number;
  author: BlogAuthor | null;
  title: string;
  slug: string;
  content: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: BlogTag[];
  created_at: string;
  updated_at: string;
  is_published?: boolean;
  time_to_read?: string;
}

interface BlogFilters {
  tags?: string[];
  author?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
  is_published?: boolean;
}

interface CreateBlogPost {
  title: string;
  content: string;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  meta_title?: string;
  meta_description?: string;
  tag_ids?: number[];
  is_published?: boolean;
}

interface UpdateBlogPost extends Partial<CreateBlogPost> {
  id: number;
}
```

**Key Points**:
- Tags are objects in response, IDs array in create/update
- Author is nested object
- Supports publishing status and time-to-read

---

#### `portfolio.ts`

**Purpose**: Portfolio type definitions

**Type Definitions**:
```typescript
interface PortfolioTag {
  id: number;
  name: string;
  slug: string;
}

interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
}

interface Portfolio {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  category: PortfolioCategory;
  tags: PortfolioTag[];
  project_url: string | null;
  github_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

interface CreatePortfolio {
  title: string;
  content: string;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  category: number;  // Category ID
  tags?: number[];   // Tag IDs
  project_url?: string;
  github_url?: string;
  meta_title?: string;
  meta_description?: string;
}
```

**Key Points**:
- Category and tags are objects in response, IDs in create/update
- Includes project and GitHub URLs

---

#### Additional Type Files

**`contact.ts`**: Contact form types
**`faq.ts`**: FAQ types
**`pricing.ts`**: Pricing plan types with features
**`testimonial.ts`**: Testimonial types with image
**`videos.ts`**: Video types with platform
**`whatsapp.ts`**: WhatsApp configuration types
**`newsletter.ts`**: Newsletter subscription types
**`site-config.ts`**: Site configuration types with social media URLs
**`appointment.ts`**: Appointment types
**`banner.ts`**: Banner types with nested images
**`team-member.ts`**: Team member types
**`booking.ts`**: Booking types
**`collection.ts`**: Collection types
**`dashboard.ts`**: Dashboard types
**`facebook.ts`**: Facebook integration types
**`google-analytics.ts`**: Google Analytics types
**`issues.ts`**: Issues types
**`logistics.ts`**: Logistics types
**`our-client.ts`**: Client types
**`popup.ts`**: Popup types

---

### utils/

Utility functions for common operations like error handling, authentication, and HTTP headers.

#### `api-error.ts`

**Purpose**: Centralized API error handling with field-level error extraction

**Exports**:
- `ApiError` interface
- `handleApiError(response: Response): Promise<Response>`
- `validateFile(file: File): { valid: boolean; error?: string }`
- `validateUrl(url: string): boolean`
- `validateSocialUrls(data): { valid: boolean; errors: FieldErrors }`

**Type Definitions**:
```typescript
interface FieldErrors {
  [fieldName: string]: string[];
}

interface ApiErrorData {
  message?: string;
  error?: {
    code?: number;
    message?: string;
    params?: {
      constraint_type?: string;
      constraint?: string;
      field_errors?: FieldErrors;
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
}

interface ApiError extends Error {
  status: number;
  data: ApiErrorData;
  fieldErrors?: FieldErrors;
}
```

**Implementation Details**:

1. **`handleApiError()`**:
   - Checks if response is OK, throws if not
   - Parses error response JSON
   - Handles different error formats:
     - **400 (Validation)**: Extracts field-level errors from `field_errors`
     - **409 (Conflict)**: Handles unique constraint errors
     - **413 (Payload Too Large)**: File size error
     - **415 (Unsupported Media)**: File type error
   - Flattens nested error structures
   - Creates ApiError with status, data, and fieldErrors

2. **Error Flattening**:
   ```typescript
   function flattenErrors(obj, prefix = ""): FieldErrors {
     // Recursively flattens nested error objects
     // Handles strings, arrays, and objects
     // Creates dot-notation keys for nested fields
   }
   ```

3. **`validateFile()`**:
   - Max size: 5MB
   - Min size: 1MB
   - Allowed types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
   - Returns validation result with error message

4. **`validateUrl()`**:
   - Validates URL format
   - Checks for http/https protocol
   - Returns boolean

5. **`validateSocialUrls()`**:
   - Validates multiple social media URLs
   - Returns object with validation status and field-specific errors

**Usage**: Used in all API service functions to handle errors consistently.

---

#### `auth.ts`

**Purpose**: Authentication token retrieval utilities

**Exports**:
- `getAuthToken(): string | null`
- `getAuthTokenCustomer(): string | null`

**Implementation**:

1. **`getAuthToken()`**:
   ```typescript
   function getAuthToken(): string | null {
     if (typeof window === "undefined") return null;  // SSR check
     const authTokens = localStorage.getItem("authTokens");
     if (authTokens) {
       try {
         const tokens = JSON.parse(authTokens);
         return tokens.access_token;
       } catch {
         return null;
       }
     }
     return null;
   }
   ```
   - Retrieves admin/auth token from localStorage
   - Key: `"authTokens"`
   - Returns `access_token` field

2. **`getAuthTokenCustomer()`**:
   - Retrieves customer token from localStorage
   - Key: `"customer-authTokens"`
   - Returns `access_token` or `access` field (handles both formats)

**Usage**: Used in header creation utilities to include Authorization tokens.

---

#### `headers.ts`

**Purpose**: HTTP header construction utilities

**Exports**:
- `createHeaders(includeAuth?, isFormData?): HeadersInit`
- `createHeadersCustomer(includeAuth?): HeadersInit`

**Implementation**:

1. **`createHeaders()`**:
   ```typescript
   function createHeaders(includeAuth = true, isFormData = false): HeadersInit {
     const headers: HeadersInit = {};
     if (!isFormData) {
       headers["Content-Type"] = "application/json";
     }
     if (includeAuth) {
       const token = getAuthToken();
       if (token) {
         headers["Authorization"] = `Bearer ${token}`;
       }
     }
     return headers;
   }
   ```
   - Sets Content-Type to JSON (unless FormData)
   - Optionally includes Authorization header
   - Uses admin token

2. **`createHeadersCustomer()`**:
   - Similar to `createHeaders()`
   - Uses customer token instead
   - Always sets Content-Type to JSON

**Usage**: Used in all API service functions to create consistent headers.

---

## Data Flow

### Typical Data Flow Pattern

1. **Component** calls custom hook (e.g., `useServices()`)
2. **Hook** uses React Query `useQuery()` with query key and API function
3. **API Service** (e.g., `servicesApi.getServices()`) constructs request:
   - Gets base URL from `siteConfig`
   - Creates headers with `createHeaders()`
   - Makes fetch request
   - Handles errors with `handleApiError()`
   - Returns typed response
4. **React Query** caches response and manages state
5. **Component** receives `{ data, isLoading, isError }` from hook
6. **Component** renders UI based on state

### Mutation Flow

1. **Component** calls mutation hook (e.g., `useCreateService()`)
2. **Hook** uses React Query `useMutation()` with API function
3. **User** triggers mutation (e.g., form submit)
4. **API Service** makes POST/PATCH/DELETE request
5. **On Success**:
   - Invalidates related queries
   - Updates cache optimistically (if applicable)
   - Shows success toast
6. **On Error**:
   - Shows error toast
   - Error handled by `handleApiError()`

---

## Integration Patterns

### Form Validation Pattern

1. Define Zod schema in `schemas/`
2. Use schema with react-hook-form:
   ```typescript
   const form = useForm<FormValues>({
     resolver: zodResolver(schema),
   });
   ```
3. Validate on submit
4. Call mutation hook with validated data

### File Upload Pattern

1. Create FormData object
2. Append file: `formData.append("field", file)`
3. Append other fields as strings
4. Don't set Content-Type header (browser sets with boundary)
5. POST/PATCH with FormData body

### Error Handling Pattern

1. All API calls use `handleApiError()`
2. Errors are thrown as `ApiError` with:
   - `status`: HTTP status code
   - `data`: Error response data
   - `fieldErrors`: Field-level errors (if validation)
3. Hooks catch errors and show toasts
4. Components can access `fieldErrors` for form field highlighting

### Cache Management Pattern

1. Use query key factories for consistency
2. Invalidate related queries on mutations
3. Use optimistic updates when appropriate
4. Set appropriate staleTime and gcTime
5. Use placeholderData to prevent loading flicker

---

## Key Features

1. **Content Management**: Blogs, Services, Portfolios with full CRUD operations
2. **User Management**: Customer authentication with JWT tokens
3. **E-commerce**: Shopping cart with variant support
4. **Media Management**: Image upload, library, and mapping system
5. **Form Handling**: Contact forms, bookings, newsletter subscriptions
6. **Video Integration**: Support for YouTube, TikTok, Instagram, Facebook
7. **Configuration**: Site-wide configuration management
8. **Multi-tenant**: Subdomain-based tenant isolation

---

## Development Notes

- All API calls use the base URL from `siteConfig.apiBaseUrl`
- Authentication tokens are stored in localStorage
- File uploads use FormData format
- React Query cache is invalidated on mutations
- Error messages are user-friendly and context-aware
- The application supports both light and dark themes via CSS variables
- Server-side utilities use `"use server"` directive
- All hooks follow consistent patterns for easy maintenance

---

## Dependencies

- **Next.js 14+**: React framework with App Router
- **React Query (TanStack Query)**: Data fetching and caching
- **Zod**: Schema validation
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI component library
- **Sonner**: Toast notifications
- **jwt-decode**: JWT token decoding
- **clsx**: Conditional class names
- **tailwind-merge**: Tailwind class conflict resolution

---

This documentation provides a comprehensive overview of the source code structure. Each module is designed to be modular, reusable, and maintainable, following React and Next.js best practices. The codebase uses TypeScript for type safety, React Query for efficient data fetching, and follows consistent patterns throughout for easy understanding and maintenance.
