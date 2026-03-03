

# Shadow Arts — Full-Stack Cultural Arts Platform

## Phase 1: Foundation & Design System
- Set up the color theme (navy #011b3a, cream #F5F5F0, gold #D4A574) in CSS variables
- Add Google Fonts (Playfair Display + Crimson Text)
- Create reusable animation utilities (fade-in on scroll, hover lifts)
- Build shared layout component with responsive navbar and footer

## Phase 2: Landing Page
- Hero section with animated headline, subtitle, and CTA buttons ("Explore Workshops" / "Shop Art")
- Stats counter section (students trained, cities, workshops conducted)
- Programs overview — cards for each art form (Warli, Madhubani, Kalamkari, etc.) with hover effects
- Gallery section with image grid and overlay effects
- Testimonials carousel
- Footer with contact info, social links, and quick navigation

## Phase 3: Backend Setup (Lovable Cloud)
- Enable Lovable Cloud with Supabase
- Create database tables: profiles, workshops, products, bookings, orders, order_items, contact_messages, user_roles
- Set up Row-Level Security policies on all tables
- Create admin role helper function (security definer)
- Seed initial workshop and product data

## Phase 4: Authentication
- Sign up and login pages with email/password
- Auto-create user profile on signup via database trigger
- Protected routes for authenticated users
- User profile page showing booking history and order history
- Password reset flow with dedicated reset page

## Phase 5: Workshop Booking System
- Workshops listing page with filters (city, art type, date)
- Workshop detail cards showing venue, schedule, seats available, price
- Booking flow — select workshop, confirm details, save booking to database
- Real-time seat count updates
- Booking confirmation with toast notification
- "My Bookings" section in user profile

## Phase 6: Shop & Cart
- Product listing page with art cards (image, title, price, description)
- Add to cart with cart drawer/sidebar
- Cart management (update quantity, remove items)
- Cart state persisted in localStorage

## Phase 7: Razorpay Payment Integration
- Edge function: razorpay-create-order (creates Razorpay order server-side)
- Edge function: razorpay-verify-payment (verifies payment signature)
- Checkout flow — cart summary → Razorpay payment modal → order saved to database
- Order confirmation page
- "My Orders" section in user profile

## Phase 8: Contact Page
- Contact form with name, email, phone, message fields
- Form validation with Zod
- Save submissions to contact_messages table
- Success toast on submission
- Display contact info (email, phone, address, social links)

## Phase 9: Admin Dashboard
- Protected admin route (role-based access)
- Manage Workshops — create, edit, delete workshops
- Manage Products — add, edit, remove shop items
- View Bookings — table of all bookings with status
- View Orders — table of all orders with payment status
- View Contact Messages — inbox of contact form submissions

