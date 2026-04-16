# Flipkart Clone

A full-stack e-commerce web application inspired by Flipkart, built with **FastAPI**, **Next.js**, and **PostgreSQL**.

---

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | Next.js 14 (Pages Router) + JavaScript      |
| Backend    | FastAPI (Python 3.11)                       |
| Database   | PostgreSQL + SQLAlchemy ORM                 |
| HTTP Client| Axios (frontend → backend)                  |
| Email      | fastapi-mail (Gmail SMTP)                   |
| PDF        | ReportLab (invoice generation)              |
| Styling    | Vanilla CSS (globals + CSS modules)         |

---

## Features

- 🛍️ **Product Listing** — Browse 48 products across 8 categories with search and filters
- 📄 **Product Detail Page** — Full info, ratings, images, add to cart / wishlist
- 🛒 **Shopping Cart** — Add, remove, update quantities, real-time total calculation
- ❤️ **Wishlist** — Save products for later, move to cart
- 📦 **Order Placement** — Place orders with shipping address and payment method
- 📧 **Email Confirmation** — Automated order confirmation email on every purchase
- 🧾 **PDF Invoice** — Flipkart-branded invoice auto-attached to confirmation email
- 🗂️ **Order History** — View all past orders with full item breakdown
- 🔄 **No Login Required** — Pre-seeded default user, works out of the box

---

## Architectural Flow

```mermaid
flowchart LR
    User(["👤 User / Browser"])

    subgraph Frontend["Frontend (localhost:3000)"]
        Pages["Next.js Pages\nindex · cart · wishlist\norders · product/id"]
        Components["Components\nNavbar · Footer · ProductCard"]
        ApiLib["lib/api.js\nAxios Client"]
        Pages --> Components
    end

    subgraph Backend["Backend (localhost:8000)"]
        FastAPI["FastAPI\nmain.py + Routers"]
        ORM["SQLAlchemy ORM"]
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
    Pages -->|"API calls"| ApiLib
    ApiLib -->|"REST"| FastAPI
    ORM -->|"SQL queries"| PG
    FastAPI -->|"Background Task"| Invoice
    Mail -->|"Confirmation + PDF"| User
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

    User->>Frontend: Clicks "Place Order"
    Frontend->>API: POST /api/orders { shipping_address, payment_method }
    API->>DB: Validate cart items + check stock
    DB-->>API: Cart items returned
    API->>DB: INSERT orders + order_items
    API->>DB: UPDATE product stock
    API->>DB: DELETE cart_items
    API-->>Frontend: ✅ Order confirmed (instant response)
    Frontend-->>User: Redirect to /orders page
    API--)BG: Trigger background task (non-blocking)
    BG->>BG: Generate PDF invoice (ReportLab)
    BG->>Mail: Send HTML email + PDF attachment
    Mail-->>User: 📧 Order confirmation + invoice in inbox
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
| images | TEXT | nullable (JSON string) |
| specifications | TEXT | nullable (JSON string) |
| is_active | BOOLEAN | default TRUE |
| category_id | INTEGER | FK → categories.id, indexed |
| created_at | TIMESTAMPTZ | server default now() |

#### `cart_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK |
| user_id | INTEGER | FK → users.id, indexed |
| product_id | INTEGER | FK → products.id, indexed |
| quantity | INTEGER | default 1 |
| created_at | TIMESTAMPTZ | server default now() |
| — | — | UNIQUE(user_id, product_id) |

#### `orders`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK |
| user_id | INTEGER | FK → users.id, indexed |
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
| order_id | INTEGER | FK → orders.id, cascade delete, indexed |
| product_id | INTEGER | FK → products.id, indexed |
| quantity | INTEGER | NOT NULL |
| price | NUMERIC(10,2) | NOT NULL (snapshot at order time) |

#### `wishlist_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PK |
| user_id | INTEGER | FK → users.id, indexed |
| product_id | INTEGER | FK → products.id, indexed |
| created_at | TIMESTAMPTZ | server default now() |
| — | — | UNIQUE(user_id, product_id) |

---

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (supports `?category`, `?search`, `?page`, `?per_page`) |
| GET | `/api/products/{id}` | Get single product by ID |
| GET | `/api/products/categories` | List all categories |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart (items + subtotal + total count) |
| POST | `/api/cart` | Add item `{ product_id, quantity }` (merges if exists) |
| PUT | `/api/cart/{item_id}` | Update quantity |
| DELETE | `/api/cart/{item_id}` | Remove single item |
| DELETE | `/api/cart` | Clear entire cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders (newest first) |
| POST | `/api/orders` | Place order from cart `{ shipping_address, payment_method }` |
| GET | `/api/orders/{id}` | Get single order with all items |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get wishlist items |
| POST | `/api/wishlist` | Add product `{ product_id }` |
| DELETE | `/api/wishlist/product/{product_id}` | Remove by product ID |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/api/health` | Health check |
| GET | `/api/docs` | Swagger UI (interactive docs) |

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
│   │   │   ├── config.py          # Settings loaded from .env
│   │   │   ├── database.py        # SQLAlchemy engine + SessionLocal
│   │   │   └── deps.py            # get_db() dependency injection
│   │   ├── models/
│   │   │   ├── __init__.py        # Exports all models
│   │   │   ├── user.py
│   │   │   ├── category.py
│   │   │   ├── product.py
│   │   │   ├── cart.py
│   │   │   ├── order.py           # Order + OrderItem + OrderStatus enum
│   │   │   └── wishlist.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── product.py
│   │   │   ├── category.py
│   │   │   ├── cart.py
│   │   │   ├── order.py
│   │   │   ├── wishlist.py
│   │   │   └── common.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── products.py
│   │   │   ├── cart.py
│   │   │   ├── orders.py          # Triggers email as BackgroundTask
│   │   │   └── wishlist.py
│   │   ├── services/
│   │   │   ├── email.py           # HTML email + PDF attachment via SMTP
│   │   │   └── invoice.py         # ReportLab PDF invoice generator
│   │   └── main.py                # FastAPI app, CORS, router registration
│   ├── seed.py                    # Populates DB with 1 user, 8 categories, 48 products
│   ├── requirements.txt
│   ├── .env                       # ← NOT committed
│   └── .env.example
│
└── flipkart-js/
    ├── components/
    │   ├── Navbar.js              # Search, cart count badge, navigation
    │   ├── Footer.js              # Category links, copyright
    │   └── ProductCard.js         # Product image, price, rating, add-to-cart
    ├── pages/
    │   ├── _app.js                # Global layout wrapper
    │   ├── _document.js           # HTML head, favicon, meta tags
    │   ├── index.js               # Home: hero banner + category filter + product grid
    │   ├── cart.js                # Cart items, quantity control, order placement
    │   ├── wishlist.js            # Saved products, move to cart
    │   ├── orders.js              # Order history with status and items
    │   └── product/[id].js        # Product detail page
    ├── lib/
    │   └── api.js                 # Axios instance + all API call functions
    ├── styles/
    │   ├── globals.css            # Design tokens, utility classes
    │   └── Home.module.css        # Home page specific styles
    ├── public/
    │   └── flipkart-logo-svgrepo-com.svg  # Browser tab favicon
    ├── next.config.mjs            # Image domains allowlist (Unsplash)
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
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

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
```

> **Gmail App Password:** Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), enable 2FA, create an App Password and use it as `MAIL_PASSWORD`.

**Create PostgreSQL database:**
```sql
CREATE DATABASE flipkart_db;
```

**Start the backend:**
```bash
python -m uvicorn app.main:app --reload
```

**Seed sample data:**
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

---

## Email & Invoice

On every successful order, the system automatically:

1. **Generates a PDF invoice** using ReportLab (in memory, no temp files)
2. **Sends an HTML confirmation email** with the PDF attached via Gmail SMTP
3. This runs as a **background task** — the order response is returned to the user instantly without waiting for the email

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
- **1** default user (no login needed)
- **8** categories: Electronics, Fashion, Home & Kitchen, Books, Sports & Fitness, Beauty & Health, Toys & Games, Grocery
- **48** products across all categories with real Unsplash images, ratings, prices and stock levels

---

## License

MIT
