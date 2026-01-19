# Zynora Platform - Navigation Guide

## Main Routes

### 🏠 Landing Page (`/`)
**Main entry point** with:
- Hero section with Smart Request form
- **Get Started** section with 4 role cards:
  - **Buyer** → `/buyer/offers` (Browse offers)
  - **Seller** → `/seller` (Seller dashboard)
  - **Driver** → `/driver` (Driver dashboard)
  - **My Account** → `/dashboard` (User dashboard)
- Features showcase
- Roles explanation
- Platform statistics

### 🛒 Buyer Flow
- **`/buyer/offers`** - View competing offers with filtering and sorting
- **`/buyer/tracking`** - Track active deliveries with live map
- Quick navigation in header: Dashboard, Seller, Driver pages

### 🏪 Seller Flow
- **`/seller`** - Seller dashboard with 3 tabs:
  - Incoming Requests
  - Accepted Offers
  - Escrow Payments
- **Quick Actions** (from seller dashboard):
  - **`/seller/products`** - Manage Products (add/edit product listings with pictures, prices, details)
  - **`/seller/business-hours`** - Business Hours (set opening/closing times for each day)
  - **`/seller/delivery-areas`** - Delivery Areas (define zones and delivery fees)
  - **`/seller/settings`** - Settings (store info, notifications, security, password change)

### 🚚 Driver Flow
- **`/driver`** - Driver dashboard with:
  - Live map with delivery requests
  - Availability toggle
  - Night mode bonuses (8PM-6AM)
  - Trust score breakdown

### 👤 User Account
- **`/dashboard`** - Unified dashboard with:
  - Quick stats (Active orders, Completed, Wallet, Rating)
  - Recent activity feed
  - Quick actions (New request, Track order, Wallet, Settings)
  - Trust score display
  - Profile summary

### 🔐 Authentication
- **`/login`** - Login page
  - Link to signup
  - Back to home link
- **`/signup`** - Registration page with role selection:
  - Buyer, Seller, or Driver
  - Link to login
  - Back to home link

## Header Navigation (All Pages)

The header provides global navigation:
- **Accueil** (`/`) - Landing page
- **Parcourir** (`/browse`) - Browse marketplace
- **Acheter** (`/buyer/offers`) - Buyer section
- **Vendre** (`/seller`) - Seller section
- **Livrer** (`/driver`) - Driver section
- **Dashboard** (`/dashboard`) - When logged in
- **Language toggle** (French/Arabic with RTL support)
- **Theme toggle** (Light/Dark mode)
- **Login/Signup** buttons

## Quick Access Patterns

### From Landing Page:
1. Click any of the 4 role cards in "Get Started" section
2. Use header navigation for direct access
3. Smart Request form stays visible throughout

### From Any Dashboard:
- Header always provides access to other roles
- Quick action cards link to relevant pages
- Activity feed shows recent items with links

### Between Pages:
- All dashboards accessible from header
- Login/Signup pages have "Back to Home" links
- Buyer tracking accessible from offers page
- Cross-role navigation encouraged (e.g., Buyer can see Seller dashboard)

## Mobile Navigation
- Hamburger menu on mobile devices
- Side drawer with all navigation items
- Same structure as desktop header
- Touch-friendly buttons and cards

## Special Features

### Night Mode (Auto-detected)
- Activates 8PM-6AM
- Shows special bonuses for drivers
- Visual indicators on relevant pages

### RTL Support
- Full Arabic language support
- Right-to-left layout when Arabic is selected
- All navigation works seamlessly in RTL

### Smart Navigation
- Current page highlighted in header
- Breadcrumbs where appropriate
- Back buttons on sub-pages
- Deep linking supported for all routes

## Development Routes

Additional routes for testing:
- `/browse` - Marketplace browsing (redirects to home currently)
- `/requests` - User requests (when logged in)
- `/wallet` - User wallet (when logged in)
- `*` - Fallback to landing page (404 handled)

---

**All pages are interconnected** - users can easily navigate between roles and features without getting lost. The "Get Started" section on the landing page provides the main entry points, and the header navigation allows switching between any section at any time.
