# 🛍️ Mini E-Commerce Backend (NestJS)

A lightweight, robust, and clean RESTful API for an E-Commerce store built with **NestJS**, **TypeScript**, **JWT Authentication**, and **Role-Based Access Control (RBAC)**.

---

## 🌟 Key Features

- **🔐 Authentication & Authorization**:
  - Secure User Registration & Login with `bcryptjs` password hashing.
  - Stateless JWT authentication via `Passport` strategy.
  - Role-Based Access Control (**ADMIN** vs **USER**).
- **📂 Categories Management**:
  - Full CRUD operations for product categories.
  - Public browsing & Admin-protected creation/modification.
- **📦 Products Catalog**:
  - Categorized products with price, description, and stock tracking.
  - Search and filter products by category.
  - Admin-only management routes.
- **🛒 Shopping Cart**:
  - User-bound shopping cart.
  - Add items, update quantities, delete items, and clear cart.
  - Real-time automatic recalculation of item totals and grand total.
- **📲 Orders & WhatsApp Checkout**:
  - One-click checkout converting the active cart into a confirmed order.
  - Automatic URL-encoded WhatsApp message link (`wa.me`) with full order details for instant customer confirmation.
  - User order history & Admin order overview.

---

## 👥 Default Test Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@ecommerce.com` | `admin123` | Full access (Manage categories, products, view all orders & users) |
| **Customer** | `user@ecommerce.com` | `user123` | Browse catalog, manage cart, checkout, view own orders |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Application
```bash
# Development mode
pnpm run start:dev

# Production build
pnpm run build
pnpm run start:prod
```
The server will start at `http://localhost:3000`.

---

## 📡 API Endpoints Overview

### 🔑 Authentication (`/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register a new customer account |
| `POST` | `/auth/login` | Public | Login and receive Bearer JWT token |
| `GET` | `/auth/profile` | Authenticated | View authenticated user profile |

### 📂 Categories (`/categories`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | Public | List all categories |
| `GET` | `/categories/:id` | Public | Get category by ID |
| `POST` | `/categories` | **Admin** | Create a new category |
| `PUT` | `/categories/:id` | **Admin** | Update an existing category |
| `DELETE` | `/categories/:id` | **Admin** | Remove a category |

### 📦 Products (`/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | Public | List products (Supports `?categoryId=1` & `?search=phone`) |
| `GET` | `/products/:id` | Public | Get single product details |
| `POST` | `/products` | **Admin** | Add a new product |
| `PUT` | `/products/:id` | **Admin** | Update product details |
| `DELETE` | `/products/:id` | **Admin** | Delete product |

### 🛒 Shopping Cart (`/cart`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/cart` | Authenticated | Get current user's cart summary and totals |
| `POST` | `/cart/items` | Authenticated | Add product to cart `{ "productId": 1, "quantity": 2 }` |
| `PATCH` | `/cart/items/:productId` | Authenticated | Update item quantity `{ "quantity": 3 }` |
| `DELETE` | `/cart/items/:productId` | Authenticated | Remove an item from cart |
| `DELETE` | `/cart` | Authenticated | Empty the entire cart |

### 📲 Orders & Checkout (`/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders/checkout` | Authenticated | Place order & receive direct WhatsApp confirmation link |
| `GET` | `/orders/my-orders` | Authenticated | View user's order history |
| `GET` | `/orders` | **Admin** | View all customer orders |
| `GET` | `/orders/:id` | Authenticated | View specific order details |

---

## 🧪 Step-by-Step Testing Flow

1. **Login as Admin**:
   Send `POST /auth/login` with `admin@ecommerce.com` and `admin123`. Copy the returned `accessToken`.
2. **Create a Category & Product**:
   Send `POST /categories` and `POST /products` with `Authorization: Bearer <ADMIN_TOKEN>`.
3. **Login as Customer**:
   Send `POST /auth/login` with `user@ecommerce.com` and `user123`.
4. **Add Items to Cart**:
   Send `POST /cart/items` with `{ "productId": 1, "quantity": 1 }`.
5. **Checkout with WhatsApp**:
   Send `POST /orders/checkout` with:
   ```json
   {
     "customerPhone": "01012345678",
     "deliveryAddress": "123 Nile Street, Cairo, Egypt",
     "notes": "Please call before arrival"
   }
   ```
   The response returns your created order and a ready-to-click **`whatsAppLink`**!

---

## 🛠️ Tech Stack
- **Framework**: NestJS (v11)
- **Language**: TypeScript
- **Auth**: Passport-JWT, BcryptJS
- **Validation**: Class-Validator & Class-Transformer
