# Green Loop API Validation Test Plan

This document outlines the test cases for verifying API route validation and standardized error responses.

## Standardized Error Format
All validation failures must return a `400 Bad Request` with the following structure:
```json
{
  "status": "error",
  "message": "Invalid request",
  "errors": ["Specific issue description"]
}
```

---

## 1. User Registration (`POST /api/auth/register`)

| Test Case | Payload | Expected HTTP | Expected Errors in Response |
| :--- | :--- | :--- | :--- |
| Valid Registration | `{ "name": "John", "email": "john@example.com", "password": "Password123" }` | 200/201 | N/A |
| Invalid Email | `{ "name": "John", "email": "not-an-email", "password": "Password123" }` | 400 | `["Invalid email address"]` |
| Weak Password (Too Short) | `{ "name": "John", "email": "j@ex.com", "password": "Pass" }` | 400 | `["Password must be at least 8 characters long"]` |
| Weak Password (No Number) | `{ "name": "John", "email": "j@ex.com", "password": "Password" }` | 400 | `["Password must contain at least one number"]` |
| Weak Password (No Letter) | `{ "name": "John", "email": "j@ex.com", "password": "12345678" }` | 400 | `["Password must contain at least one letter"]` |
| Missing Name | `{ "email": "j@ex.com", "password": "Password123" }` | 400 | `["Name is required"]` |

---

## 2. Waste Creation (`POST /api/waste`)

| Test Case | Payload | Expected HTTP | Expected Errors in Response |
| :--- | :--- | :--- | :--- |
| Valid Creation | `{ "imageUrl": "https://ex.com/img.jpg", "description": "Kitchen waste" }` | 201 | N/A |
| Invalid Image URL | `{ "imageUrl": "ftp://invalid-url", "description": "test" }` | 400 | `["Invalid image URL"]` |
| Long Description | `{ "imageUrl": "...", "description": "[501 chars...]" }` | 400 | `["Description must be at most 500 characters"]` |
| Invalid Status | `{ "imageUrl": "...", "status": "RECYCLED" }` | 400 | `["Invalid enum value. Expected 'pending' | 'collected' | 'completed', received 'RECYCLED'"]` |

---

## 3. Waste Update (`PATCH /api/waste/[id]`)

| Test Case | Payload | Expected HTTP | Expected Errors in Response |
| :--- | :--- | :--- | :--- |
| Valid Status Update | `{ "status": "collected" }` | 200 | N/A |
| Invalid Status | `{ "status": "unknown" }` | 400 | `["Invalid status. Accepted values: pending, collected, completed"]` |
| Missing Status | `{}` | 400 | `["Status is required"]` |

---

## 4. Waste Assignment (`POST /api/waste/assign`)

| Test Case | Payload | Expected HTTP | Expected Errors in Response |
| :--- | :--- | :--- | :--- |
| Valid Assignment | `{ "wasteId": "cuid1", "collectorId": "cuid2" }` | 200 | N/A |
| Missing IDs | `{}` | 400 | `["wasteId is required", "collectorId is required"]` |

---

## 5. Collector Task Listing (`GET /api/collector/tasks?status=...`)

| Test Case | Query Param | Expected HTTP | Expected Errors in Response |
| :--- | :--- | :--- | :--- |
| Valid Status Filter | `?status=pending` | 200 | N/A |
| Invalid Status Filter | `?status=done` | 400 | `["Invalid status. Accepted values: pending, collected, completed"]` |

---

## 6. Notifications (`POST /api/notifications`)

| Test Case | Payload | Expected HTTP | Expected Errors in Response |
| :--- | :--- | :--- | :--- |
| Valid Notification | `{ "role": "user", "type": "info", "title": "Hi", "message": "Test" }` | 201 | N/A |
| Invalid Type | `{ ..., "type": "invalid" }` | 400 | `["Invalid enum value. Expected 'info' | 'warning' | 'alert' | 'AI-suggestion', received 'invalid'"]` |
| Invalid Role | `{ ..., "role": "superadmin" }` | 400 | `["Invalid enum value. Expected 'admin' | 'collector' | 'user', received 'superadmin'"]` |

---

## Conclusion
By integrating **Zod** schemas directly at the entry point of every API route and utilizing the `createValidationErrorResponse` helper, we ensure that:
1. No invalid data types or malformed values can bypass the validation layer.
2. The API provides consistent, structured feedback to the client for all error scenarios.
3. Total type safety is maintained from the request body down to the database layer.
