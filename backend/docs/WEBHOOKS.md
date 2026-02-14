# Webhooks Documentation

LumiAI supports webhooks to notify external systems about key events.
Currently, this system describes the structure for *future* implementation (v2).

## Webhook Events

| Event Name | Description | Payload |
|:--- |:--- |:--- |
| `order.created` | Triggered when a new order is placed | Order details |
| `order.status_updated` | Triggered when order status changes (e.g. Shipped) | Order ID, Old Status, New Status |
| `product.low_stock` | Triggered when inventory dips below threshold | Product ID, SKU, Current Stock |

## Payload Structure

All webhooks follow this standard envelope:

```json
{
  "event": "order.created",
  "id": "evt_123456789",
  "created_at": "2023-10-27T10:00:00Z",
  "data": {
    "orderId": "ord_987654321",
    "total": 59.99,
    ...
  }
}
```

## Security

### Signature Verification
To verify that requests originate from LumiAI, verify the `X-LumiAI-Signature` header.
Compute the HMAC-SHA256 of the payload body using your Webhook Secret.
