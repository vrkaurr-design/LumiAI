 # Perfect Corp App
 
 A professional Next.js frontend showcasing virtual try‑on, AI skin analysis, a curated shop, and a lightweight cart experience.
 
 ## Overview
 
 - Modern UI with professional live background animations
 - Virtual try‑on and AI skin analysis flows
 - Shop catalog with filters and polished product cards
 - Cart with persisted items, quantity control, and order summary
 - Clean authentication pages (Sign‑in and Sign‑up)
 
 ## Tech Stack
 
 - Framework: Next.js (App Router)
 - UI: Tailwind CSS
 - State: Zustand (with local persistence for cart)
 - Animations: Canvas/GSAP‑style custom effects
 - Language: TypeScript
 
 ## Project Structure
 
 - Frontend app: `frontend/`
   - App pages: `frontend/src/app/*`
   - Components: `frontend/src/components/*`
   - Store: `frontend/src/store/index.ts`
   - Context: `frontend/src/context/*`
 
 Key files to explore:
 - Background engine: [ProBackground.tsx](file:///c:/Users/HP/techlore/perfect-corp-app/frontend/src/components/common/ProBackground.tsx)
 - Layout wrapper: [ClientLayout.tsx](file:///c:/Users/HP/techlore/perfect-corp-app/frontend/src/app/ClientLayout.tsx)
 - Shop page: [shop/page.tsx](file:///c:/Users/HP/techlore/perfect-corp-app/frontend/src/app/shop/page.tsx)
 - Product card: [ProductCard.tsx](file:///c:/Users/HP/techlore/perfect-corp-app/frontend/src/components/common/ProductCard.tsx)
 - Cart store: [store/index.ts](file:///c:/Users/HP/techlore/perfect-corp-app/frontend/src/store/index.ts)
 - Cart page: [cart/page.tsx](file:///c:/Users/HP/techlore/perfect-corp-app/frontend/src/app/cart/page.tsx)
 - Header (navbar): [Header.tsx](file:///c:/Users/HP/techlore/perfect-corp-app/frontend/src/components/common/Header.tsx)
 - Home page: [page.tsx](file:///c:/Users/HP/techlore/perfect-corp-app/frontend/src/app/page.tsx)
 - Auth pages: [login/page.tsx](file:///c:/Users/HP/techlore/perfect-corp-app/frontend/src/app/login/page.tsx), [signup/page.tsx](file:///c:/Users/HP/techlore/perfect-corp-app/frontend/src/app/signup/page.tsx)
 
 ## Getting Started
 
 1) Install dependencies
 
 ```powershell
 cd C:\Users\HP\techlore\perfect-corp-app\frontend
 npm.cmd install --no-fund --no-audit
 ```
 
 2) Run the dev server
 
 ```powershell
 npm.cmd run dev          # default port 3000
 # if 3000 is busy:
 npm.cmd run dev -- -p 3001
 ```
 
 3) Open the app
 
 - http://localhost:3000/ (or the port you selected)
 
 ## Scripts
 
 - `npm run dev` – start Next.js dev server
 - `npm run build` – build production bundle
 - `npm run start` – start the production server
 - `npm run lint` – run ESLint (Next.js config)
 
 ## Features In Detail
 
 - Shop cards: display product name, type, shade/skin, price, stock, rating
 - Filters: category, type, undertone, skin type, price range, search
 - Buy Now: adds product to cart and navigates to the cart page
 - Cart:
   - Persisted via Zustand storage
   - Quantity control, remove item, clear cart
   - Subtotal, estimated tax (5%), total
   - Order Now button (mock action)
 - Authentication:
   - Dedicated Sign‑in and Sign‑up pages
   - Navbar includes both actions for easy access
 - Background:
   - Unified professional live background via layout
   - Clean, light scheme with subtle accents and motion
 
 ## Notes
 
 - Image elements: ESLint recommends using `next/image` for optimization; current implementation uses `<img>` in some places.
 - Local storage: Cart persistence uses a `perfect-corp-cart` key; clearing browser storage resets the cart.
 
 ## Troubleshooting
 
 - If PowerShell blocks `npm`, use `npm.cmd` commands as shown above
 - If port 3000 is in use, start on 3001 using `npm run dev -- -p 3001`
 
 ## License
 
 Proprietary – for internal/demo use.
