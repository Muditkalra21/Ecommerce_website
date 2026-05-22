# Flipkart Clone

A full-stack e-commerce web application inspired by Flipkart, built with **FastAPI**, **Next.js**, and **PostgreSQL**. Features full **JWT-based email + password authentication**.

🌐 **Live Demo:** [Click here to view](https://ecomwebsite-two.vercel.app/)

## Results 

[View Results](results/)

---

## Tech Stack

| Layer       | Technology                                          |
|-------------|-----------------------------------------------------|
| Frontend    | Next.js 16 (Pages Router) + JavaScript              |
| Backend     | FastAPI (Python 3.11)                               |
| Database    | PostgreSQL + SQLAlchemy ORM                         |
| Auth        | JWT (python-jose) + bcrypt password hashing         |
| HTTP Client | Axios (frontend → backend, with auth interceptors)  |
| Email       | fastapi-mail (Gmail SMTP)                           |
| PDF         | ReportLab (invoice generation)                      |
| Styling     | Vanilla CSS (globals + CSS modules)                 |

---

## Features

- 🔐 **Authentication** — Email + password registration & login with JWT tokens (24h expiry)
- 🛍️ **Product Listing** — Browse 48 products across 8 categories with search and filters
- 📄 **Product Detail Page** — Full info, ratings, images, add to cart / wishlist
- 🛒 **Shopping Cart** — Add, remove, update quantities, real-time total calculation
- ❤️ **Wishlist** — Save products for later, move to cart
- 📦 **Order Placement** — Place orders with shipping address and payment method
- 📧 **Email Confirmation** — Automatic order confirmation email sent to the logged-in user's email
- 🧾 **PDF Invoice** — Flipkart-branded invoice auto-attached to confirmation email
- 🗂️ **Order History** — View all past orders with full item breakdown and delivery progress
- 🔒 **Protected Routes** — Cart, Wishlist, Orders require login; redirects to `/login` if unauthenticated

---

## Architectural Flow

```mermaid
flowchart LR
    User(["👤 User / Browser"])

    subgraph Frontend["Frontend (localhost:3000)"]
        Pages["Next.js Pages\nindex · login · cart · wishlist\norders · product/id"]
        Auth["Auth Context\nJWT · localStorage"]
        ApiLib["lib/api.js\nAxios + Bearer Token"]
        Pages --> Auth
        Pages --> ApiLib
    end

    subgraph Backend["Backend (localhost:8000)"]
        FastAPI["FastAPI\nmain.py + Routers"]
        AuthRouter["auth.py\n/register · /login · /me"]
        JWT["JWT Middleware\nget_current_user()"]
        ORM["SQLAlchemy ORM"]
        FastAPI --> AuthRouter
        FastAPI --> JWT
        FastAPI --> ORM
    end

    subgraph Database["Database"]
        PG[("PostgreSQL\nflipkart_db")]
    end

    subgraph EmailService["Email Service"]
        Invoice["invoice.py\nReportLab PDF"]
        Mail["email.py\nGmail SMTP"]
        Invoice --> Mail
    end

    User -->|"HTTPS"| Pages
    ApiLib -->|"REST + Bearer JWT"| FastAPI
    ORM -->|"SQL queries"| PG
    FastAPI -->|"Background Task"| Invoice
    Mail -->|"Confirmation + PDF"| User
```

### Auth Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js (login.js)
    participant API as FastAPI (auth.py)
    participant DB as PostgreSQL

    User->>Frontend: Enter email + password → Register/Login
    Frontend->>API: POST /api/auth/register OR /api/auth/login
    API->>DB: Check/create user, verify bcrypt hash
    DB-->>API: User record
    API-->>Frontend: { access_token, user: { name, email } }
    Frontend->>Frontend: Store JWT in localStorage
    Note over Frontend: All subsequent requests include\nAuthorization: Bearer <token>
    Frontend->>API: GET /api/cart (with Bearer token)
    API->>API: Decode JWT → get user_id
    API->>DB: Query WHERE user_id = <from token>
    DB-->>API: User's cart items
    API-->>Frontend: Cart data
```

### Request Lifecycle (Example: Place Order)

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js (cart.js)
    participant API as FastAPI (orders.py)
    participant DB as PostgreSQL
    participant BG as Background Task
    participant Mail as Gmail SMTP

    User->>Frontend: Clicks "Confirm Order"
    Frontend->>API: POST /api/orders { shipping_address, payment_method }\n+ Authorization: Bearer <JWT>
    API->>API: Decode JWT → current_user
    API->>DB: Validate cart items + check stock
    DB-->>API: Cart items returned
    API->>DB: INSERT orders + order_items
    API->>DB: UPDATE product stock
    API->>DB: DELETE cart_items
    API-->>Frontend: ✅ Order confirmed (instant response)
    Frontend-->>User: Redirect to /orders page
    API--)BG: Trigger background task (non-blocking)
    BG->>BG: Generate PDF invoice (ReportLab)
    BG->>Mail: Send HTML email + PDF to current_user.email
    Mail-->>User: 📧 Order confirmation + invoice
```

---

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    users {
        int id PK
        varchar name
        varchar email
        varchar hashed_password
        varchar phone
        text address
        timestamptz created_at
    }

    categories {
        int id PK
        varchar name
        varchar slug
        varchar icon
        text description
    }

    products {
        int id PK
        varchar name
        text description
        numeric price
        numeric original_price
        int discount_percent
        int stock
        varchar brand
        float rating
        int rating_count
        text image_url
        boolean is_active
        int category_id FK
        timestamptz created_at
    }

    cart_items {
        int id PK
        int user_id FK
        int product_id FK
        int quantity
        timestamptz created_at
    }

    orders {
        int id PK
        int user_id FK
        numeric total_amount
        enum status
        text shipping_address
        varchar payment_method
        timestamptz created_at
        timestamptz updated_at
    }

    order_items {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        numeric price
    }

    wishlist_items {
        int id PK
        int user_id FK
        int product_id FK
        timestamptz created_at
    }

    users ||--o{ cart_items : "has"
    users ||--o{ orders : "places"
    users ||--o{ wishlist_items : "saves"
    categories ||--o{ products : "contains"
    products ||--o{ cart_items : "added to"
    products ||--o{ order_items : "ordered in"
    products ||--o{ wishlist_items : "saved in"
    orders ||--|{ order_items : "contains"
```

### Table Definitions

#### `users`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK, auto-increment |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(200) | UNIQUE, NOT NULL |
| hashed_password | VARCHAR(200) | nullable |
| phone | VARCHAR(20) | nullable |
| address | TEXT | nullable |
| created_at | TIMESTAMPTZ | server default now() |

#### `categories`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| slug | VARCHAR(100) | UNIQUE, NOT NULL |
| icon | VARCHAR(10) | nullable (emoji) |
| description | TEXT | nullable |

#### `products`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK |
| name | VARCHAR(300) | NOT NULL |
| description | TEXT | nullable |
| price | NUMERIC(10,2) | NOT NULL |
| original_price | NUMERIC(10,2) | nullable |
| discount_percent | INTEGER | default 0 |
| stock | INTEGER | default 0 |
| brand | VARCHAR(100) | nullable |
| rating | FLOAT | default 0.0 |
| rating_count | INTEGER | default 0 |
| image_url | TEXT | nullable |
| is_active | BOOLEAN | default TRUE |
| category_id | INTEGER | FK → categories.id |
| created_at | TIMESTAMPTZ | server default now() |

#### `cart_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK |
| user_id | INTEGER | FK → users.id |
| product_id | INTEGER | FK → products.id |
| quantity | INTEGER | default 1 |
| created_at | TIMESTAMPTZ | server default now() |

#### `orders`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK |
| user_id | INTEGER | FK → users.id |
| total_amount | NUMERIC(10,2) | NOT NULL |
| status | ENUM | pending/confirmed/shipped/delivered/cancelled |
| shipping_address | TEXT | NOT NULL |
| payment_method | VARCHAR(50) | default "Cash on Delivery" |
| created_at | TIMESTAMPTZ | server default now() |
| updated_at | TIMESTAMPTZ | auto-update on change |

#### `order_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK |
| order_id | INTEGER | FK → orders.id, cascade delete |
| product_id | INTEGER | FK → products.id |
| quantity | INTEGER | NOT NULL |
| price | NUMERIC(10,2) | NOT NULL (snapshot at order time) |

#### `wishlist_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK |
| user_id | INTEGER | FK → users.id |
| product_id | INTEGER | FK → products.id |
| created_at | TIMESTAMPTZ | server default now() |

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ Public | Register `{ name, email, password }` → returns JWT |
| POST | `/api/auth/login` | ❌ Public | Login `{ email, password }` → returns JWT |
| GET | `/api/auth/me` | ✅ Required | Returns current user profile |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ Public | List products (`?category`, `?search`, `?page`, `?per_page`) |
| GET | `/api/products/{id}` | ❌ Public | Get single product by ID |
| GET | `/api/products/categories` | ❌ Public | List all categories |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | ✅ Required | Get current user's cart |
| POST | `/api/cart` | ✅ Required | Add item `{ product_id, quantity }` |
| PUT | `/api/cart/{item_id}` | ✅ Required | Update quantity |
| DELETE | `/api/cart/{item_id}` | ✅ Required | Remove single item |
| DELETE | `/api/cart` | ✅ Required | Clear entire cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/orders` | ✅ Required | Get current user's orders (newest first) |
| POST | `/api/orders` | ✅ Required | Place order `{ shipping_address, payment_method }` |
| GET | `/api/orders/{id}` | ✅ Required | Get single order with all items |

### Wishlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wishlist` | ✅ Required | Get wishlist items |
| POST | `/api/wishlist` | ✅ Required | Add product `{ product_id }` |
| DELETE | `/api/wishlist/product/{product_id}` | ✅ Required | Remove by product ID |

### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ Public | API info |
| GET | `/api/health` | ❌ Public | Health check |
| GET | `/api/docs` | ❌ Public | Swagger UI (interactive docs) |

---

## Project Structure

```
flipkart_clone/
├── .gitignore
├── README.md
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py          # Settings loaded from .env (JWT, mail, DB)
│   │   │   ├── database.py        # SQLAlchemy engine + SessionLocal
│   │   │   ├── deps.py            # get_db() + get_current_user() dependencies
│   │   │   └── security.py        # bcrypt hashing + JWT encode/decode
│   │   ├── models/
│   │   │   ├── __init__.py        # Exports all models
│   │   │   ├── user.py            # User (id, name, email, hashed_password, ...)
│   │   │   ├── category.py
│   │   │   ├── product.py
│   │   │   ├── cart.py
│   │   │   ├── order.py           # Order + OrderItem + OrderStatus enum
│   │   │   └── wishlist.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py            # RegisterRequest, LoginRequest, TokenResponse
│   │   │   ├── product.py
│   │   │   ├── category.py
│   │   │   ├── cart.py
│   │   │   ├── order.py
│   │   │   ├── wishlist.py
│   │   │   └── common.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py            # /register, /login, /me
│   │   │   ├── products.py        # Public endpoints
│   │   │   ├── cart.py            # Protected – uses current_user
│   │   │   ├── orders.py          # Protected – triggers email as BackgroundTask
│   │   │   └── wishlist.py        # Protected – uses current_user
│   │   ├── services/
│   │   │   ├── email.py           # HTML email + PDF attachment via SMTP
│   │   │   └── invoice.py         # ReportLab PDF invoice generator
│   │   └── main.py                # FastAPI app, CORS, router registration
│   ├── seed.py                    # Populates DB with 8 categories, 48 products
│   ├── requirements.txt
│   ├── .env                       # ← NOT committed
│   └── .env.example
│
└── flipkart-js/
    ├── contexts/
    │   └── AuthContext.js         # React context: user state, login(), logout()
    ├── components/
    │   ├── Navbar.js              # Shows username + dropdown when logged in
    │   ├── Footer.js
    │   ├── ProductCard.js
    │   └── ProtectedRoute.js      # withAuth() HOC – redirects to /login if unauthed
    ├── pages/
    │   ├── _app.js                # Wrapped with <AuthProvider>
    │   ├── _document.js           # HTML head, favicon, meta tags
    │   ├── index.js               # Home: hero banner + category filter + product grid
    │   ├── login.js               # Two-panel login + register page
    │   ├── cart.js                # Protected: cart, checkout, order placement
    │   ├── wishlist.js            # Protected: saved products, move to cart
    │   ├── orders.js              # Protected: order history with status tracker
    │   └── product/[id].js        # Product detail page
    ├── lib/
    │   ├── api.js                 # Axios + Bearer token interceptor + all API calls
    │   └── auth.js                # localStorage token helpers, isLoggedIn()
    ├── styles/
    │   └── globals.css
    ├── next.config.mjs
    └── package.json
```

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL running locally

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/flipkart-clone.git
cd flipkart-clone
```

### 2. Backend Setup

```bash

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env        # Windows
# cp .env.example .env        # macOS/Linux
# → Edit .env with your values
```

**`.env` variables:**
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/flipkart_db

MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password
MAIL_FROM=your_email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_STARTTLS=True
MAIL_SSL_TLS=False

FRONTEND_URL=http://localhost:3000

JWT_SECRET_KEY=your-long-random-secret-key-here
```

> **Gmail App Password:** Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), enable 2FA, create an App Password and use it as `MAIL_PASSWORD`.

> **JWT Secret:** Generate a strong random key, e.g. `openssl rand -hex 32` or any long random string.

**Create PostgreSQL database:**
```sql
CREATE DATABASE flipkart_db;
```

**Start the backend:**
```bash
python -m uvicorn app.main:app --reload
```

**Seed sample data (categories + products only — no default user):**
```bash
python seed.py
```

Backend live at `http://localhost:8000` · Docs at `http://localhost:8000/api/docs`

### 3. Frontend Setup

```bash
cd flipkart-js
npm install
npm run dev
```

Frontend live at `http://localhost:3000`

### 4. Register Your Account

Visit `http://localhost:3000/login` and create an account. All cart, wishlist, and order data is tied to your authenticated user account.

---

## Authentication

The app uses **stateless JWT authentication**:

1. **Register** at `/login` with name, email, and password
2. Backend hashes the password with **bcrypt** and stores it
3. On login, JWT token is returned (valid for **24 hours**)
4. Token is stored in **localStorage** and attached to every API request as `Authorization: Bearer <token>`
5. On **401 response**, the token is cleared and user is redirected to `/login`
6. **Protected pages** (Cart, Wishlist, Orders) redirect to `/login` if no valid token is found

---

## Email & Invoice

On every successful order, the system automatically:

1. **Generates a PDF invoice** using ReportLab (in memory, no temp files)
2. **Sends an HTML confirmation email** with the PDF attached via Gmail SMTP to the **logged-in user's email address**
3. This runs as a **background task** — the order response is returned instantly without waiting for the email

**Invoice contains:**
- Flipkart-branded header (blue banner)
- Order ID, date, payment method
- Customer name, email, shipping address
- Itemized table: product name, unit price, quantity, subtotal
- Grand total + free shipping row
- Footer with support info

---

## Seeded Data

The `seed.py` script populates:
- **8** categories: Electronics, Fashion, Home & Kitchen, Books, Sports & Fitness, Beauty & Health, Toys & Games, Grocery
- **48** products across all categories with real Unsplash images, ratings, prices and stock levels
- Users are **not seeded** — register via the login page

---

## Deployment

| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend (Next.js) |
| **Render** | Backend (FastAPI via uvicorn) |
| **Supabase** | PostgreSQL database |

### Production Environment Variables

**Render (Backend):**
```
DATABASE_URL=<supabase-connection-string>
JWT_SECRET_KEY=<long-random-secret>
FRONTEND_URL=https://your-vercel-app.vercel.app
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password
MAIL_FROM=your_email@gmail.com
```

**Vercel (Frontend):**
```
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
```

---

