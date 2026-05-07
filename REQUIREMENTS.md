# API Requirements

The company stakeholders want to create an online storefront to showcase their products. As a developer, you have been tasked with building the API that will support this application, and your architect has outlined the following design based on the goals of the business.

## API Endpoints

### Users

| Method | Endpoint              | Description                            | Auth Required |
|--------|-----------------------|----------------------------------------|---------------|
| GET    | `/users`              | Index – returns all users              | ✅ JWT        |
| GET    | `/users/:id`          | Show – returns a single user           | ✅ JWT        |
| POST   | `/users`              | Create – creates a new user + JWT      | ❌            |
| POST   | `/users/authenticate` | Authenticate – validates login + JWT   | ❌            |

### Products

| Method | Endpoint                         | Description                          | Auth Required |
|--------|----------------------------------|--------------------------------------|---------------|
| GET    | `/products`                      | Index – returns all products         | ❌            |
| GET    | `/products/:id`                  | Show – returns a single product      | ❌            |
| POST   | `/products`                      | Create – creates a new product       | ✅ JWT        |
| PUT    | `/products/:id`                  | Update – updates a product           | ✅ JWT        |
| DELETE | `/products/:id`                  | Delete – removes a product           | ✅ JWT        |
| GET    | `/products/category/:category`   | Filter products by category          | ❌            |
| GET    | `/products/top`                  | Returns top 5 most ordered products  | ❌            |

### Orders

| Method | Endpoint                         | Description                                  | Auth Required |
|--------|----------------------------------|----------------------------------------------|---------------|
| GET    | `/orders`                        | Index – returns all orders                   | ✅ JWT        |
| GET    | `/orders/:id`                    | Show – returns a single order with products  | ✅ JWT        |
| POST   | `/orders`                        | Create – creates a new order                 | ✅ JWT        |
| POST   | `/orders/:id/products`           | Add product to an order                      | ✅ JWT        |
| GET    | `/orders/user/:id/current`       | Current active order for a user              | ✅ JWT        |
| GET    | `/orders/user/:id/completed`     | All completed orders for a user              | ✅ JWT        |
| DELETE | `/orders/:id`                    | Delete an order                              | ✅ JWT        |

---

## Database Schema

### Table: `users`

| Column           | Type          | Constraints              |
|------------------|---------------|--------------------------|
| id               | SERIAL        | PRIMARY KEY              |
| username         | VARCHAR(100)  | UNIQUE, NOT NULL         |
| firstname        | VARCHAR(100)  | NOT NULL                 |
| lastname         | VARCHAR(100)  | NOT NULL                 |
| password_digest  | VARCHAR(255)  | NOT NULL                 |

---

### Table: `products`

| Column    | Type           | Constraints  |
|-----------|----------------|--------------|
| id        | SERIAL         | PRIMARY KEY  |
| name      | VARCHAR(150)   | NOT NULL     |
| price     | NUMERIC(10,2)  | NOT NULL     |
| category  | VARCHAR(100)   | NULLABLE     |

---

### Table: `orders`

| Column   | Type                         | Constraints                            |
|----------|------------------------------|----------------------------------------|
| id       | SERIAL                       | PRIMARY KEY                            |
| user_id  | INTEGER                      | NOT NULL, FK → users(id) CASCADE       |
| status   | VARCHAR(10)                  | NOT NULL, CHECK ('active','complete')  |

---

### Table: `order_products`

| Column     | Type     | Constraints                            |
|------------|----------|----------------------------------------|
| id         | SERIAL   | PRIMARY KEY                            |
| order_id   | INTEGER  | NOT NULL, FK → orders(id) CASCADE      |
| product_id | INTEGER  | NOT NULL, FK → products(id) CASCADE    |
| quantity   | INTEGER  | NOT NULL, CHECK (quantity > 0)         |

---

## Data Shapes

### User
```
{
  id?: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
}
```

### Product
```
{
  id?: number;
  name: string;
  price: number;
  category?: string;
}
```

### Order
```
{
  id?: number;
  user_id: number;
  status: 'active' | 'complete';
}
```

### OrderProduct
```
{
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
}
```
