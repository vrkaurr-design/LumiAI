# Payment Flow

## User Checkout:
1. User creates order (POST /orders) -> Returns Order ID and PENDING status.
2. Frontend calls create-intent (POST /payment/create-intent) with Order ID and Amount.
3. Backend creates mock Payment Intent and returns `clientSecret` and `paymentIntentId`.
4. Frontend shows payment form (in real stripe) or mock button.
5. User submits payment.
6. Frontend calls confirm (POST /payment/confirm) with `paymentIntentId` and `orderId`.
7. Backend verifies and updates Order status to `CONFIRMED`.
    - 10% chance of failure in mock mode to test error handling.

## Mock vs Production:
- **Mock**: Simulates Stripe responses and random success/failure.
- **Production**: Replace `PaymentService` methods with actual `stripe` npm package calls.
- Interface remains the same, ensuring frontend doesn't need to change logic when switching to real payments.

## Webhooks:
- `POST /payment/webhook` is ready to receive Stripe events (e.g., `payment_intent.succeeded`) to update order status asynchronously if frontend fails to confirm.
