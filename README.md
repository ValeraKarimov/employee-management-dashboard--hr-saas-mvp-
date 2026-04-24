# HRM SaaS MVP

Employee Management System (HRM) SaaS training project for portfolio.

## Tech Stack

### Frontend
- Nuxt 4
- Pinia
- TailwindCSS

### Backend
- Mock data currently
- Laravel API planned / optional

## Project goal

The goal of the project is to build a clear and understandable MVP of an HRM system for learning purposes:
- role-based UI
- authentication flow
- users management
- leave requests
- planning / shifts
- gradual transition from mock data to API

This is an **MVP**, not a production solution.

---

## Getting started

```bash
npm install
npm run dev
```

App will be available at:
http://localhost:3000

---

## Current features

### Auth
- fake login as admin or employee
- auth state in Pinia
- route protection via middleware

### Employee
- dashboard
- view leave requests
- create leave request

### Admin
- users list
- create user
- edit user
- delete user
- view all leave requests
- approve / reject leave requests
- user details page
- view related user data:
  - profile
  - documents
  - leave requests
  - shifts

### UI
- role-based sidebar
- role-based dashboard
- shared UI system (buttons, tables, forms, empty states)
- badges for roles and statuses
- loading / empty states
- polished MVP layout

### Documents
- view documents
- employees can create documents
- admins can edit / delete documents

### Planning / Shifts
- weekly planning overview
- create / edit / delete shifts as admin
- employee can confirm shifts
- admin can approve hours
- filters by status and search

### Profile
- employee profile page
- edit personal information

---

## Project structure

```bash
├─ components/
├─ composables/
├─ config/
├─ constants/
├─ layouts/
├─ middleware/
├─ pages/
├─ stores/
├─ types/
├─ services/
└─ tailwind.config.ts