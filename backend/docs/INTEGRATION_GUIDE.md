# Frontend Integration Guide

## Authentication Flow

### 1. Sign Up
- **Endpoint**: `POST /api/v1/auth/signup`
- **Body**: `{ "email": "user@example.com", "password": "securePass123", "name": "John Doe" }`
- **Response**: `{ "access_token": "eyJhbG...", "user": { ... } }`
- **Action**: Store `access_token` in `localStorage` or `cookie`.

### 2. Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Body**: `{ "email": "user@example.com", "password": "securePass123" }`
- **Action**: Store `access_token`.

### 3. Authenticated Requests
Include the token in the `Authorization` header for all protected endpoints.

```javascript
const response = await fetch('http://localhost:3000/api/v1/products', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});
```

## Error Handling

Handle standard HTTP status codes:

- **400 Bad Request**: Validation failed. Check `message` property for details.
- **401 Unauthorized**: Token missing, invalid, or expired. Redirect user to Login.
- **403 Forbidden**: User lacks permission (e.g. trying to access Admin area).
- **404 Not Found**: Resource doesn't exist.
- **500 Internal Server Error**: Backend issue. Retry or contact support.

## Key Workflows

### Browsing Products
- `GET /api/v1/products`: List all.
  - Filters: `?category=SKINCARE&minPrice=10&maxPrice=50`
- `GET /api/v1/products/:id`: Get details.

### Skin Analysis
1. User uploads selfie: `POST /api/v1/analysis/scan` (Form Data: `image` file).
2. Backend returns analysis (Tone, Type) AND product recommendations.
3. Frontend displays results and suggested products.

### Checkout
1. `POST /api/v1/orders`
   - Body: `{ "items": [{ "productId": "...", "quantity": 1 }], "paymentToken": "tok_visa" }`
2. Backend validates stock, processes payment, creates order.
3. Returns Order object.
