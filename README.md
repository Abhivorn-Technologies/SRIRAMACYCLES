# Sri Rama Cycles (శ్రీ రామ సైకిల్స్)

> Modern E-Commerce Platform & Management System for Bicycles, Gear, and Accessories. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB with Mongoose**.

---

## 🌟 Features

### 🛒 Storefront (Customer Experience)
- **Interactive Bicycle Catalog**: Search, filter by category (MTB, Road, Hybrid, Kids, Electric), brand, price range, gear speeds, and sort options.
- **Product Details & Gallery**: High-resolution image zoom, specification tables, live stock indicators, and customer reviews.
- **Shopping Cart**: Real-time persistent cart with quantity updates and free shipping threshold meter.
- **Meesho-Style Checkout**:
  - Saved delivery address cards with 1-click address selection.
  - "+ Add New Address" drawer with auto city/state lookup by Indian PIN code.
  - Cash on Delivery (COD) & Online Payment methods.
- **Customer Account Portal**:
  - Mobile/email login with auto-linking of past orders.
  - Live order tracking with visual progress timeline (Pending &rarr; Confirmed &rarr; Processing &rarr; Shipped &rarr; Delivered).
  - Saved addresses manager.
- **Contact & Test Ride Inquiries**: Customer inquiry forms submitted directly to store management.

### 🛡️ Admin Management Console (`/admin`)
- **Strict Role & Session Isolation**: Admin tokens (`admin_token`) and customer tokens (`customer_token`) are strictly separated with an auto-logout watchdog for security.
- **Real-Time Analytics Dashboard**: Total revenue, order volume, catalog count, customer metrics, and low-stock alerts.
- **Order Management**: Filter orders by status, inspect item breakdowns and shipping details, update statuses, add tracking numbers and courier partner info.
- **Catalog Management**: Add, update, and toggle bicycles and gear with multi-image support, stock counts, and discount pricing.
- **Category & Inventory Control**: Manage store categories and track low-stock inventory in real time.
- **Customer Inquiries**: View, manage, and respond to incoming customer messages.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, API Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose 8](https://mongoosejs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS design system
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: JWT (`jsonwebtoken`) with `httpOnly` secure cookies & `bcryptjs` password hashing

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** 18.17 or higher
- **npm** or **yarn** / **pnpm**
- **MongoDB** instance (Local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/srirama-cycles.git
cd srirama-cycles
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory by copying `.env.example`:
```bash
cp .env.example .env
```
Update `.env` with your credentials:
```env
# MongoDB Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sriramacycles?retryWrites=true&w=majority
MONGODB_DB_NAME=sriramacycles

# Admin Seed Credentials
ADMIN_EMAIL=admin@sriramacycles.com
ADMIN_PASSWORD=Admin@123456

# JWT Secret for Sessions
JWT_SECRET=your_super_secret_jwt_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Seed the Database
Populate initial categories, bicycles, gear items, and the administrator account:
```bash
npm run seed
```

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Storefront**: `http://localhost:3000`
- **Admin Console**: `http://localhost:3000/admin`
  - *Default Login*: `admin@sriramacycles.com` / `Admin@123456`

---

## 📁 Project Structure

```
srirama-cycles/
├── public/                 # Static assets and uploads
├── scripts/
│   └── seed.js             # Initial database seeder
├── src/
│   ├── app/                # Next.js App Router (Pages & API routes)
│   │   ├── (store)/        # Customer storefront routes
│   │   ├── admin/          # Admin console views & sub-pages
│   │   └── api/            # REST API endpoints (auth, orders, products, etc.)
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Buttons, Modals, Spinners, Badges
│   │   ├── layout/         # Header, Footer, AdminSidebar, AdminHeader
│   │   └── store/          # ProductCard, CartDrawer, RatingStars
│   ├── context/            # React Contexts (AuthContext, AdminAuthContext, CartContext)
│   ├── lib/                # MongoDB client, JWT auth helpers, validations, utils
│   ├── models/             # Mongoose Schemas (User, Product, Order, Category, Enquiry)
│   └── types/              # TypeScript interface definitions
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json
└── tsconfig.json
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server on port 3000 |
| `npm run build` | Compiles optimized production bundle |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs Next.js ESLint checker |
| `npm run seed` | Seeds database with initial categories, cycles, and admin user |

---

## 🔒 Security Best Practices
- `.env` containing database credentials and secret keys is ignored from Git tracking by default.
- Passwords are encrypted using salted `bcrypt` hashes before database persistence.
- Admin sessions use dedicated `admin_token` cookies with strict 1-hour watchdog verification.
- Sensitive customer data is scoped strictly to authenticated users.

---

## 📄 License
This project is licensed under the MIT License.
