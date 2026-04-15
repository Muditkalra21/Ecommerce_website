# Flipkart Clone

A full-stack e-commerce web application inspired by Flipkart, built with **FastAPI**, **Next.js**, and **PostgreSQL**.

---

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | Next.js 14 (Pages Router) + JavaScript      |
| Backend    | FastAPI (Python)                            |
| Database   | PostgreSQL + SQLAlchemy ORM                 |
| Email      | fastapi-mail (SMTP / Gmail)                 |
| PDF        | ReportLab (invoice generation)              |
| Styling    | Vanilla CSS (globals + CSS modules)         |

---

## Features

- 🛍️ **Product Listing** — Browse products by category with search and filters
- 📄 **Product Detail Page** — Full product info, ratings, add to cart / wishlist
- 🛒 **Shopping Cart** — Add, remove, update quantities, see live total
- ❤️ **Wishlist** — Save products for later
- 📦 **Order Placement** — Place orders with a shipping address and payment method
- 📧 **Email Confirmation** — Automated order confirmation email on every purchase
- 🧾 **PDF Invoice** — Professional Flipkart-branded invoice attached to confirmation email
- 🗂️ **Order History** — View all past orders with full item breakdown

> **No login required** — the app runs with a pre-seeded default user out of the box.

---

## Project Structure

```
flipkart_clone/
├── backend/                        # FastAPI backend
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py           # App settings (loaded from .env)
│   │   │   ├── database.py         # SQLAlchemy engine + session
│   │   │   └── deps.py             # DB dependency injection
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── category.py
│   │   │   ├── product.py
│   │   │   ├── cart.py
│   │   │   ├── order.py
│   │   │   └── wishlist.py
│   │   ├── schemas/
│   │   │   ├── product.py
│   │   │   ├── category.py
│   │   │   ├── cart.py
│   │   │   ├── order.py
│   │   │   ├── wishlist.py
│   │   │   └── common.py
│   │   ├── routers/
│   │   │   ├── products.py
│   │   │   ├── cart.py
│   │   │   ├── orders.py
│   │   │   └── wishlist.py
│   │   ├── services/
│   │   │   ├── email.py            # Order confirmation email
│   │   │   └── invoice.py          # PDF invoice generator (ReportLab)
│   │   └── main.py                 # FastAPI app entry point
│   ├── seed.py                     # Database seeding script
│   ├── requirements.txt
│   ├── .env                        # ← not committed (see .env.example)
│   └── .env.example
│
└── flipkart-js/                    # Next.js frontend
    ├── components/
    │   ├── Navbar.js
    │   ├── Footer.js
    │   └── ProductCard.js
    ├── pages/
    │   ├── _app.js
    │   ├── _document.js
    │   ├── index.js                # Home / product listing
    │   ├── cart.js
    │   ├── wishlist.js
    │   ├── orders.js
    │   └── product/
    │       └── [id].js             # Product detail page
    ├── styles/
    │   ├── globals.css
    │   └── Home.module.css
    ├── public/
    ├── next.config.mjs
    └── package.json
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL (running locally)

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/flipkart-clone.git
cd flipkart-clone
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and Gmail SMTP settings
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

> **Gmail setup:** Enable 2FA on your Google account and generate an [App Password](https://myaccount.google.com/apppasswords) to use as `MAIL_PASSWORD`.

Create the PostgreSQL database:

```sql
CREATE DATABASE flipkart_db;
```

Start the backend:

```bash
python -m uvicorn app.main:app --reload
```

Seed the database with sample products:

```bash
python seed.py
```

The API will be live at `http://localhost:8000`
Interactive docs at `http://localhost:8000/api/docs`

---

### 3. Frontend Setup

```bash
cd flipkart-js

npm install
npm run dev
```

The frontend will be live at `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | `/api/products`                 | List products (paginated)|
| GET    | `/api/products/{id}`            | Get product by ID        |
| GET    | `/api/products/categories`      | List all categories      |
| GET    | `/api/cart`                     | Get cart items           |
| POST   | `/api/cart`                     | Add item to cart         |
| PUT    | `/api/cart/{id}`                | Update cart item qty     |
| DELETE | `/api/cart/{id}`                | Remove cart item         |
| GET    | `/api/orders`                   | Get order history        |
| POST   | `/api/orders`                   | Place a new order        |
| GET    | `/api/wishlist`                 | Get wishlist             |
| POST   | `/api/wishlist`                 | Add to wishlist          |
| DELETE | `/api/wishlist/{product_id}`    | Remove from wishlist     |

---

## Email & Invoice

On every successful order:
1. A confirmation email is sent to the user's email address
2. A **PDF invoice** (Flipkart-branded) is automatically generated and attached

The invoice includes:
- Order ID, date, and payment method
- Customer name, email, and shipping address
- Itemized product table with unit prices and subtotals
- Grand total

---

## License

MIT
