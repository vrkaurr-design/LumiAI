# Data Models

## User
Represents a registered customer or admin.
- `id`: UUID
- `email`: Unique email address.
- `role`: `USER` or `ADMIN`.
- `isActive`: Boolean (Soft delete).

## Product
An item in the catalog.
- `sku`: Unique stock keeping unit.
- `category`: `MAKEUP` or `SKINCARE`.
- `tone`: `WARM`, `COOL`, `NEUTRAL` (Nullable).
- `skinType`: `DRY`, `OILY`, `COMBINATION`, `NORMAL`, `SENSITIVE` (Nullable).
- `images`: Array of URL strings.

## Order
A purchase record.
- `orderNumber`: Human-readable ID.
- `status`: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
- `total`: Decimal(10, 2).
- `items`: Relation to `OrderItem`.

## SkinAnalysis
Result of an AI scan.
- `userId`: Link to User (if authenticated).
- `tone`: Detected tone.
- `skinType`: Detected skin type.
- `confidence`: AI confidence score (0.0 - 1.0).
- `rgb`: Average RGB values extracted from image.
