# Projekt na zaliczenie przedmiotu Inżynieria Oprogramowania

## Prerequisites
- Install dependencies:
  ```bash
  pip install -r requirements.txt for Python
  ```


## Tests

To test the endpoints and generate report use the following command 

pytest Authorizationtest.py --junitxml=C:\test\out_report.xml

the report will be generated in test folder on C: drive, if you want the report to generate to different location, edit the junitxml path

you also need to include new files and existing objects in order to create the new person, parenthoods, relationships for the purpose of testing

# API Documentation

## Overview
This API allows users to manage various aspects of a tree-based data system, including users, persons, parenthoods, relationships, and trees.

### Base URL
`127.0.0.1:8000`

---

## Endpoints

### Admin Access
**URL:** `/admin`
- Provides access to the admin account for managing the database, users, and more.

---

### Persons
**URL:** `/persons/`
- **Description:** Manage the person database. Users can create, edit, and delete person records.
- **Headers:** Requires an access token.
- **Methods:**
  - **POST:** Create a new person object.

**URL:** `/persons/<int:pk>/`
- **Description:** Access, update, or delete a specific person by ID (`pk`).
- **Headers:** Requires an access token.

---

### Parenthoods
**URL:** `/parenthoods/`
- **Description:** Manage parenthood relationships.
- **Headers:** Requires an access token.
- **Methods:**
  - **POST:** Create a new parenthood object.

**URL:** `/parenthoods/<int:pk>/`
- **Description:** Access, update, or delete a specific parenthood object by ID (`pk`).
- **Headers:** Requires an access token.

---

### Relationships
**URL:** `/relationships/`
- **Description:** Manage relationships between entities.
- **Headers:** Requires an access token.
- **Methods:**
  - **POST:** Create a new relationship object.

**URL:** `/relationships/<int:pk>/`
- **Description:** Access, update, or delete a specific relationship object by ID (`pk`).
- **Headers:** Requires an access token.

---

### Trees
**URL:** `/trees/`
- **Description:** Manage tree structures.
- **Headers:** Requires an access token.
- **Methods:**
  - **GET:** Retrieve a list of trees.
  - **POST:** Create a new tree object.

**URL:** `/trees/<int:pk>/`
- **Description:** Access, update, or delete a specific tree object by ID (`pk`).
- **Headers:** Requires an access token.

**URL:** `/trees/export/<int:pk>/`
- **Description:** Export a tree structure by ID (`pk`).
- **Headers:** Requires an access token.

**URL:** `/trees/import/`
- **Description:** Import a tree structure from a file.
- **Headers:** Requires an access token.
- **Methods:**
  - **POST:** Upload a file containing tree data.

---

### Users
**URL:** `/users/`
- **Description:** Manage user accounts.
- **Methods:**
  - **POST:** Register a new user account. Requires `username`, `email`, and `password`.

**URL:** `/users/<int:pk>/`
- **Description:** Access a specific user by ID (`pk`).
- **Headers:** Requires an access token.

**URL:** `/users/token/`
- **Description:** Generate access and refresh tokens using valid login credentials.
- **Methods:**
  - **POST:** Requires `username` and `password`.

**URL:** `/users/token/refresh/`
- **Description:** Refresh an expired access token using a valid refresh token.
- **Methods:**
  - **POST:** Requires `"refresh": "refresh_key"` in the request body.

**URL:** `/users/logout/`
- **Description:** Invalidate the current access token.
- **Methods:**
  - **POST:** Requires `refresh` token in the request body.

---

### Authorization
- Endpoints marked as requiring authorization use Bearer tokens.
- Obtain tokens via `/users/token/` and `/users/token/refresh/` endpoints.
- Include the token in the `Authorization` header for authorized requests:
  ```
  Authorization: Bearer <access_token>
  ```

## Notes
- All token-related operations (`/users/token/`, `/users/token/refresh/`, `/users/logout/`) do not require authorization.

