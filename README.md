# HRM SaaS MVP

Employee Management System (HRM) SaaS training project for portfolio.

## Stack

### Frontend
- Nuxt 4
- Pinia
- TailwindCSS

### Backend
- Mock data currently
- Laravel API planned / optional

## Project goal

The goal of the project is to create a clear MVP of the HRM system for study:
- role-based UI
- auth flow
- users management
- leave requests
- gradual transition from mock data to API

This is an **MVP**, not a production solution.

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

### UI
- role-based sidebar
- role-based dashboard
- shared UI constants
- badges for roles and statuses

---

## Project structure

```bash
├─ components/
├─ composables/
├─ constants/
├─ layouts/
├─ middleware/
├─ pages/
├─ stores/
├─ types/
├─ services/
└─ tailwind.config.ts