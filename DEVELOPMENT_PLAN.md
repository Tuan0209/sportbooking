# Football Field Booking System - Development Plan

## 1. Entities from Database

### Core Entities
| Entity | Description | Key Fields |
|--------|-------------|------------|
| **users** | User accounts (roles: USER, ADMIN) | id, name, email, password, phone, role, status, coin_balance, avatar_url |
| **areas** | Geographic locations/cities | id, name, city |
| **field_types** | Sport types (football, basketball, etc.) | id, name |
| **fields** | Sports fields | id, name, field_type_id, area_id, address, price_per_hour, open_time, close_time, latitude, longitude, status |
| **field_images** | Field photos | id, field_id, image_url |
| **field_options** | Optional extras for fields | id, field_id, name, price_per_hour, status |
| **field_time_blocks** | Blocked/unavailable time slots | id, field_id, start_time, end_time, reason, created_by |
| **services** | Additional services (ball rental, coaching, etc.) | id, name, price, unit, status |

### Booking Entities
| Entity | Description | Key Fields |
|--------|-------------|------------|
| **bookings** | Main booking records | id, user_id, field_id, start_time, end_time, total_price, status, canceled_at, canceled_by, cancel_reason |
| **booking_options** | Options selected per booking | booking_id, option_id, price_per_hour |
| **booking_services** | Additional services per booking | booking_id, service_id, quantity, price |
| **payments** | Payment transactions | id, booking_id, amount, method, status, transaction_code, expired_at, paid_at |
| **refund_requests** | Refund requests | id, booking_id, payment_id, refund_amount, refund_method, bank details, status, proof_image |

### User Activity Entities
| Entity | Description | Key Fields |
|--------|-------------|------------|
| **reviews** | Field ratings/reviews | id, user_id, field_id, booking_id, rating (1-5), comment |
| **favorites** | User's favorite fields | user_id, field_id |
| **wallet_transactions** | Coin balance changes | id, user_id, amount, type (ADD/SUBTRACT), reason, related_booking_id |
| **admin_logs** | Admin action audit trail | id, admin_id, action, target_table, target_id |

### Table Relationships
```
users (1) ───< bookings
users (1) ───< favorites
users (1) ───< reviews
users (1) ───< wallet_transactions
users (1) ───< admin_logs

areas (1) ───< fields (many)

field_types (1) ───< fields (many)

fields (1) ───< field_images
fields (1) ───< field_options
fields (1) ───< field_time_blocks
fields (1) ───< favorites
fields (1) ───< reviews
fields (1) ───< bookings

services (1) ───< booking_services

bookings (1) ───< booking_options
bookings (1) ───< booking_services
bookings (1) ───< payments
bookings (1) ───< refund_requests
bookings (1) ───< reviews

payments (1) ───< refund_requests

field_options (1) ───< booking_options
```

---

## 2. API Endpoints for Each Entity

### 2.1 Authentication & Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | User login | Public |
| POST | /api/auth/logout | User logout | Auth |
| GET | /api/auth/me | Get current user | Auth |
| PUT | /api/auth/profile | Update profile | Auth |
| PUT | /api/auth/password | Change password | Auth |
| POST | /api/auth/refresh | Refresh token | Auth |

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/users | List all users | Admin |
| GET | /api/users/:id | Get user by ID | Admin |
| PUT | /api/users/:id | Update user | Admin |
| PUT | /api/users/:id/status | Toggle user status | Admin |
| DELETE | /api/users/:id | Delete user | Admin |
| GET | /api/users/:id/bookings | Get user's bookings | Auth (own) / Admin |
| GET | /api/users/:id/wallet | Get wallet balance | Auth (own) |
| POST | /api/users/:id/wallet/add | Add coins to wallet | Auth (own) |

### 2.2 Areas
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/areas | List all areas | Public |
| GET | /api/areas/:id | Get area by ID | Public |
| GET | /api/areas/:id/fields | Get fields in area | Public |
| POST | /api/areas | Create area | Admin |
| PUT | /api/areas/:id | Update area | Admin |
| DELETE | /api/areas/:id | Delete area | Admin |

**Request/Response:**
```json
// POST /api/areas
Request: { "name": "Sân Bóng Quận 1", "city": "Ho Chi Minh" }
Response: { "id": "uuid", "name": "...", "city": "...", "created_at": "..." }
```

### 2.3 Field Types
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/field-types | List all field types | Public |
| GET | /api/field-types/:id | Get field type with fields | Public |
| POST | /api/field-types | Create field type | Admin |
| PUT | /api/field-types/:id | Update field type | Admin |
| DELETE | /api/field-types/:id | Delete field type | Admin |

### 2.4 Fields
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/fields | List fields (with filters) | Public |
| GET | /api/fields/:id | Get field details | Public |
| GET | /api/fields/:id/availability | Check availability | Public |
| GET | /api/fields/:id/reviews | Get field reviews | Public |
| POST | /api/fields | Create field | Admin |
| PUT | /api/fields/:id | Update field | Admin |
| PUT | /api/fields/:id/status | Toggle field status | Admin |
| DELETE | /api/fields/:id | Delete field | Admin |

**Query Parameters for GET /api/fields:**
- `area_id`, `field_type_id`, `city`, `min_price`, `max_price`, `status`, `lat`, `lng`, `radius`, `page`, `limit`

**Response:**
```json
{
  "id": "uuid",
  "name": "Sân Bóng 5",
  "field_type": { "id": "...", "name": "Football" },
  "area": { "id": "...", "name": "...", "city": "..." },
  "address": "123 Main St",
  "price_per_hour": 150000,
  "open_time": "06:00",
  "close_time": "22:00",
  "images": [{ "id": "...", "image_url": "..." }],
  "rating": 4.5,
  "review_count": 20
}
```

### 2.5 Field Images
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/fields/:id/images | List field images | Public |
| POST | /api/fields/:id/images | Add image to field | Admin |
| DELETE | /api/fields/:fieldId/images/:imageId | Delete image | Admin |

### 2.6 Field Options
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/fields/:id/options | List field options | Public |
| POST | /api/fields/:id/options | Create field option | Admin |
| PUT | /api/options/:id | Update option | Admin |
| DELETE | /api/options/:id | Delete option | Admin |

### 2.7 Field Time Blocks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/fields/:id/blocks | List blocked times | Public |
| POST | /api/fields/:id/blocks | Block time slot | Admin |
| PUT | /api/blocks/:id | Update block | Admin |
| DELETE | /api/blocks/:id | Remove block | Admin |

### 2.8 Services
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/services | List all services | Public |
| GET | /api/services/:id | Get service details | Public |
| POST | /api/services | Create service | Admin |
| PUT | /api/services/:id | Update service | Admin |
| DELETE | /api/services/:id | Delete service | Admin |

### 2.9 Bookings
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/bookings | List bookings (filtered) | Auth |
| GET | /api/bookings/:id | Get booking details | Auth |
| POST | /api/bookings | Create booking | Auth |
| PUT | /api/bookings/:id | Update booking | Auth/Admin |
| PUT | /api/bookings/:id/confirm | Confirm booking | Admin |
| PUT | /api/bookings/:id/cancel | Cancel booking | Auth/Admin |
| DELETE | /api/bookings/:id | Delete booking | Admin |

**Request Body for POST /api/bookings:**
```json
{
  "field_id": "uuid",
  "start_time": "2026-03-15 14:00:00",
  "end_time": "2026-03-15 16:00:00",
  "options": [
    { "option_id": "uuid", "price_per_hour": 20000 }
  ],
  "services": [
    { "service_id": "uuid", "quantity": 2 }
  ]
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "...",
  "field": { "id": "...", "name": "..." },
  "start_time": "2026-03-15T14:00:00Z",
  "end_time": "2026-03-15T16:00:00Z",
  "total_price": 380000,
  "status": "PENDING",
  "options": [...],
  "services": [...],
  "created_at": "..."
}
```

### 2.10 Payments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/payments | List payments | Auth |
| GET | /api/payments/:id | Get payment details | Auth |
| POST | /api/payments | Create payment | Auth |
| PUT | /api/payments/:id/webhook | Payment webhook | Public |
| POST | /api/payments/:id/expire | Expire pending payment | System |

### 2.11 Refund Requests
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/refunds | List refund requests | Admin |
| GET | /api/refunds/:id | Get refund details | Auth/Admin |
| POST | /api/bookings/:id/refund | Request refund | Auth |
| PUT | /api/refunds/:id/approve | Approve refund | Admin |
| PUT | /api/refunds/:id/reject | Reject refund | Admin |

### 2.12 Reviews
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/fields/:id/reviews | Get field reviews | Public |
| GET | /api/reviews/:id | Get review details | Public |
| POST | /api/bookings/:id/review | Create review | Auth |
| PUT | /api/reviews/:id | Update review | Auth |
| DELETE | /api/reviews/:id | Delete review | Auth/Admin |

### 2.13 Favorites
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/favorites | Get user's favorites | Auth |
| POST | /api/favorites | Add to favorites | Auth |
| DELETE | /api/favorites/:fieldId | Remove from favorites | Auth |

### 2.14 Wallet Transactions
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/wallet/transactions | Get transaction history | Auth |
| POST | /api/wallet/add | Add coins | Auth |

### 2.15 Admin Logs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/admin/logs | List admin logs | Admin |
| GET | /api/admin/logs/:id | Get log details | Admin |

---

## 3. Data Flow for Booking a Field

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BOOKING FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────┘

1. USER SEARCHES FIELDS
   GET /api/fields?area_id=xxx&field_type_id=yyy
   → Returns list of available fields with filters

2. USER CHECKS FIELD AVAILABILITY
   GET /api/fields/{field_id}/availability?date=2026-03-15
   → Returns available time slots for the date

3. USER CREATES BOOKING
   POST /api/bookings
   {
     "field_id": "...",
     "start_time": "2026-03-15 14:00:00",
     "end_time": "2026-03-15 16:00:00",
     "options": [...],
     "services": [...]
   }

4. SYSTEM VALIDATES
   ├─ Check field exists and is ACTIVE
   ├─ Check time slot not blocked
   ├─ Check no overlapping bookings
   ├─ Calculate total price
   └─ Check user wallet balance (if using coins)

5. SYSTEM CREATES BOOKING
   → Booking status: PENDING
   → Save options and services

6. USER MAKES PAYMENT
   POST /api/payments
   {
     "booking_id": "...",
     "method": "VNPAY" | "MOMO" | "BANK_TRANSFER" | "COIN"
   }

7. PAYMENT PROCESSING
   ├─ Create payment record (PENDING)
   ├─ Redirect to payment gateway (VNPAY/MOMO)
   ├─ User completes payment
   └─ Payment webhook updates status

8. PAYMENT SUCCESS
   PUT /api/payments/{id}/webhook
   → Update payment status: PAID
   → Update booking status: CONFIRMED
   → Deduct from wallet (if COIN)

9. USER PLAYS AT FIELD
   → At start_time, field is ready

10. BOOKING COMPLETED
    System job checks: if end_time passed → status: COMPLETED

11. USER CAN REVIEW
    POST /api/bookings/{id}/review
    { "rating": 5, "comment": "Great field!" }

──────────────────────────────────────────────────────────────────────────────

CANCELATION FLOW:
PUT /api/bookings/{id}/cancel
{
  "cancel_reason": "Changed plans"
}
→ Update booking status: CANCELED
→ Create refund request if paid
→ Admin approves refund → Payment status: REFUNDED
```

---

## 4. Suggested Backend Structure

```
sportbooking-backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database connection
│   │   ├── cors.ts              # CORS config
│   │   └── env.ts               # Environment variables
│   │
│   ├── controllers/             # Route handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── areaController.ts
│   │   ├── fieldTypeController.ts
│   │   ├── fieldController.ts
│   │   ├── fieldImageController.ts
│   │   ├── fieldOptionController.ts
│   │   ├── fieldBlockController.ts
│   │   ├── serviceController.ts
│   │   ├── bookingController.ts
│   │   ├── paymentController.ts
│   │   ├── refundController.ts
│   │   ├── reviewController.ts
│   │   ├── favoriteController.ts
│   │   ├── walletController.ts
│   │   └── adminLogController.ts
│   │
│   ├── services/                # Business logic
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── fieldService.ts
│   │   ├── bookingService.ts
│   │   ├── paymentService.ts
│   │   ├── refundService.ts
│   │   ├── reviewService.ts
│   │   └── ...
│   │
│   ├── routes/                  # API routes
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── fieldRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   └── ...
│   │
│   ├── middlewares/             # Express middleware
│   │   ├── authMiddleware.ts    # JWT verification
│   │   ├── adminMiddleware.ts   # Admin role check
│   │   ├── validateMiddleware.ts # Request validation
│   │   ├── errorMiddleware.ts   # Error handling
│   │   └── loggerMiddleware.ts  # Request logging
│   │
│   ├── models/                  # Database models
│   │   ├── User.ts
│   │   ├── Area.ts
│   │   ├── Field.ts
│   │   ├── Booking.ts
│   │   ├── Payment.ts
│   │   └── ...
│   │
│   ├── validators/              # Request validation schemas
│   │   ├── authValidator.ts
│   │   ├── bookingValidator.ts
│   │   └── ...
│   │
│   ├── utils/                    # Utility functions
│   │   ├── generateUUID.ts
│   │   ├── hashPassword.ts
│   │   ├── sendEmail.ts
│   │   └── dateUtils.ts
│   │
│   ├── constants/               # App constants
│   │   ├── status.ts
│   │   ├── roles.ts
│   │   └── messages.ts
│   │
│   ├── jobs/                     # Background jobs
│   │   ├── bookingExpiryJob.ts   # Auto-expire pending bookings
│   │   ├── paymentExpiryJob.ts   # Auto-expire pending payments
│   │   └── bookingCompletionJob.ts
│   │
│   └── app.ts                    # Express app setup
│
├── tests/                        # Unit & integration tests
│   ├── controllers/
│   ├── services/
│   └── utils/
│
├── database/
│   ├── migrations/               # DB migrations
│   └── seeders/                  # Seed data
│
├── .env                          # Environment config
├── package.json
└── tsconfig.json
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| **Controller** | Receive request, validate input, call service, return response |
| **Service** | Business logic, data manipulation, orchestrate operations |
| **Model** | Database queries, ORM definitions |
| **Middleware** | Authentication, authorization, validation |
| **Validator** | Request schema validation (Joi/Zod) |

---

## 5. Validation & Security Considerations

### 5.1 Input Validation
- Use **Joi** or **Zod** for request body validation
- Validate all user inputs on both client and server
- Sanitize strings to prevent SQL injection (use parameterized queries)
- Validate date ranges for bookings (start < end, not in past)
- Validate enum values match allowed values

### 5.2 Authentication & Authorization
- Use **JWT** for stateless authentication
- Store tokens in httpOnly cookies (not localStorage for security)
- Implement token refresh mechanism
- Use short-lived access tokens (15-30 min), longer refresh tokens
- Verify user owns resource before allowing operations

### 5.3 Role-Based Access Control (RBAC)
| Role | Permissions |
|------|-------------|
| **USER** | Create bookings, manage own data, view public fields |
| **ADMIN** | Full CRUD on all entities, manage users, view logs |

### 5.4 API Security
- Use **HTTPS** in production
- Implement rate limiting (e.g., 100 req/min per IP)
- Add **CSRF** protection for state-changing operations
- Validate content-type headers (application/json)
- Implement request size limits
- Use **Helmet**.js for security headers
- Sanitize file uploads (validate mime types, file sizes)

### 5.5 Business Logic Security
- Double-check booking availability before payment
- Verify payment amount matches booking total
- Prevent booking own field (if admin owns fields)
- Validate cancellation time (e.g., can only cancel 2 hours before)
- Check refund eligibility (e.g., only if paid and within 24 hours)
- Verify user owns the booking before cancel/update

### 5.6 Database Security
- Use parameterized queries (prevent SQL injection)
- Implement row-level security where applicable
- Regular database backups
- Use least-privilege database users
- Encrypt sensitive data (passwords already hashed with bcrypt)

### 5.7 Payment Security
- Never log transaction codes or sensitive payment data
- Verify payment webhooks signature
- Implement idempotency for payment creation
- Use payment gateway's test mode in development

---

## 6. Future Improvements

### Phase 2 - Enhanced Features
1. **Real-time Availability** - WebSocket for live slot updates
2. **Recurring Bookings** - Weekly/monthly booking patterns
3. **Multi-language Support** - i18n for API messages
4. **Push Notifications** - FCM for booking reminders
5. **Field Owner Portal** - Separate portal for field owners
6. **Dynamic Pricing** - Price varies by time/day

### Phase 3 - Advanced Features
1. **Wallet System** - Full digital wallet with transactions
2. **Loyalty Points** - Points earned per booking
3. **Coupons/Discounts** - Promo code system
4. **Match Making** - Find teammates/opponents
5. **Equipment Rental** - Full equipment management
6. **Live Chat** - Between users and field owners

### Performance Optimizations
1. **Caching** - Redis for frequently accessed data (fields, areas)
2. **Pagination** - Cursor-based for large datasets
3. **Indexing** - Add indexes on frequently queried columns
4. **Database Connection Pooling** - Efficient resource usage
5. **CDN** - Serve images from CDN (already using Cloudinary)

### Monitoring & Analytics
1. **Logging** - Structured logging (Winston/Pino)
2. **Metrics** - Track API response times, error rates
3. **Health Checks** - /health endpoint
4. **Audit Logs** - Comprehensive admin action tracking

### DevOps
1. **CI/CD Pipeline** - Automated testing and deployment
2. **Containerization** - Docker for consistent environments
3. **Environment Management** - Separate dev/staging/prod configs
