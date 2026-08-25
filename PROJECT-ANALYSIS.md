# STEG Formation — Full-Stack Project Analysis

## 1. What Is Already Implemented

### Backend (Express.js + Prisma + MySQL)

| Module | Status | Details |
|--------|--------|---------|
| **Auth** | ✅ Complete | Login (email/matricule), Register, GetMe, ChangePassword, Logout |
| **JWT** | ✅ Complete | Dual delivery (body + httpOnly cookie), configurable expiry |
| **RBAC** | ✅ Complete | Role-based middleware, 3 roles seeded (admin, formateur, participant) |
| **User CRUD** | ✅ Complete | Paginated list, search, filter, create, update, toggle status, delete |
| **Role CRUD** | ✅ Complete | List, create, update, delete (with user-count check) |
| **Formateur CRUD** | ✅ Complete | Full CRUD with auto user+profile creation, temp password generation |
| **Validation** | ✅ Complete | express-validator on all routes |
| **Rate Limiting** | ✅ Complete | Global (300/15min) + Auth-specific (20/15min) |
| **Security** | ✅ Complete | Helmet, CORS, structured error handling |
| **Swagger Docs** | ✅ Complete | All endpoints documented with JSDoc |
| **Seed Script** | ✅ Complete | 3 roles + admin + 12 demo users (4 formateurs, 8 participants) |
| **Health Check** | ✅ Complete | `GET /health` endpoint |

### Frontend (React 19 + Vite + Tailwind)

| Module | Status | Details |
|--------|--------|---------|
| **Auth Pages** | ✅ Connected | Login + Register → real API |
| **User Management** | ✅ Connected | Full CRUD → real API |
| **Role Management** | ✅ Connected | Full CRUD → real API |
| **Trainer Management** | ✅ Connected | Full CRUD → real API |
| **Account Creation** | ✅ Connected | Trainer/Admin creation → real API |
| **Password Change** | ✅ Connected | Settings page → real API |
| **Sidebar/Routing** | ✅ Complete | Role-based nav for all 3 roles |
| **Layout** | ✅ Complete | MainLayout, Sidebar, TopBar |
| **Shared Components** | ✅ Complete | Button, Card, Icon, Logo, StatusBadge, LogoutButton |
| **Design System** | ✅ Complete | Material Design 3 tokens, custom Tailwind config |
| **API Client** | ✅ Complete | Axios instance with JWT interceptor, 401 redirect |

---

## 2. What Is Missing / Incomplete

### Backend — Missing Features

| Feature | Priority | Notes |
|---------|----------|-------|
| **Formation CRUD API** | 🔴 Critical | No `formations`, `sessions`, `inscriptions` models or routes exist |
| **Session Management API** | 🔴 Critical | No training session endpoints |
| **Inscription/Enrollment API** | 🔴 Critical | No enrollment endpoints |
| **Presence/Attendance API** | 🟡 High | No attendance tracking endpoints |
| **Evaluation API** | 🟡 High | No grading/evaluation endpoints |
| **Certification API** | 🟡 High | No certificate generation/management |
| **Reclamation API** | 🟡 High | No complaint management |
| **Facture API** | 🟢 Medium | No invoice/billing endpoints |
| **Document Management API** | 🟢 Medium | No file upload/document endpoints |
| **Participant self-service** | 🟡 High | Participants can't view their own enrollments, schedule, certificates |
| **Formateur self-service** | 🟡 High | Trainers can't view their own schedule, attendance, evaluations |
| **Token blacklist on logout** | 🟡 High | JWT remains valid after logout |
| **Forgot/Reset password** | 🟢 Medium | No password reset flow |
| **Email notifications** | 🟢 Medium | No email service integration |
| **Tests** | 🟡 High | Zero test files, no test framework installed |

### Frontend — Missing Features (25 of 32 pages use mock data)

| Page/Feature | Status | Details |
|-------------|--------|---------|
| **Admin Dashboard** | ❌ Mock | Uses `mock.js` stats, not real API |
| **Formations List** | ❌ Mock | 5 pages: List, Catalogue, Details, Add, Edit |
| **Planning/Calendar** | ❌ Mock | Uses hardcoded sessions |
| **Evaluations** | ❌ Mock | 3 pages: evaluations, presences, certifications |
| **Documents** | ❌ Mock | 4 pages: document management, preview, final doc, reclamations |
| **Finance** | ❌ Mock | Invoice management entirely mocked |
| **Commercial** | ❌ Mock | Sales pipeline entirely mocked |
| **Administration** | ❌ Mock | System settings entirely mocked |
| **All Participant Pages** | ❌ Mock | Dashboard, Catalogue, Planning, Certificates (4 pages) |
| **All Trainer Pages** | ❌ Mock | Dashboard, Planning, Evaluations, Presences (4 pages) |

### Frontend — Critical Missing

| Gap | Details |
|-----|---------|
| **Protected Routes** | No route guards — any user can navigate to any URL (participant → `/utilisateurs`) |
| **No Context/Redux** | Auth state lives in `localStorage` with no global state management |
| **No Formation Service** | `formationService.js` imports `api` but returns hardcoded mock data |
| **No Participant Service** | `participantService.js` imports `api` but returns hardcoded mock data |

---

## 3. What Needs to Be Fixed / Improved

### Critical Bugs

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 1 | **No route protection** | `App.jsx` | Add role-based route guards |
| 2 | **`formationService.js` lies** — imports API but returns mocks | `services/formations/` | Remove or connect |
| 3 | **`participantService.js` lies** — same issue | `services/participants/` | Remove or connect |
| 4 | **`ParticipantPlanning.jsx`** hardcodes `participant_id === 1` | Line ~19 | Use `CURRENT_USER.id` |
| 5 | **Math.random() for temp passwords** — not crypto-secure | `formateur.controller.js` | Use `crypto.randomBytes()` |
| 6 | **JWT logout is fake** — token stays valid until expiry | `auth.controller.js` | Implement token blacklist |
| 7 | **`trust proxy` not set** | `server.js` | Add `app.set('trust proxy', 1)` for production |
| 8 | **Cookie expiry hardcoded to 8h** regardless of `JWT_EXPIRES_IN` | `auth.controller.js` | Parse `JWT_EXPIRES_IN` dynamically |

### Code Quality Issues

| # | Issue | Fix |
|---|-------|-----|
| 9 | **Duplicated `validate` middleware** in all 4 route files | Extract to shared `utils/validate.js` |
| 10 | **Mixed French/English error messages** | Standardize to one language |
| 11 | **`.env.example` has dead variables** (`DB_HOST`, etc.) | Remove unused vars |
| 12 | **`package.json` main points to `index.js`** | Change to `src/server.js` |
| 13 | **Auth pages use inline hex colors** instead of MD3 tokens | Refactor to use design system |
| 14 | **No service layer abstraction** | All logic in controllers |
| 15 | **No input sanitization** (XSS protection) | Add `xss` or `sanitize-html` |

### Database/Schema Concerns

| # | Issue | Fix |
|---|-------|-----|
| 16 | **Prisma schema `provider = "mysql"`** but uses MariaDB adapter | Verify compatibility or switch to `"mariadb"` provider |
| 17 | **Database schema is incomplete** — only 3 models (roles, utilisateurs, formateurs) | Need 9 more models per `dictionnaire-donnees.md` |

---

## 4. Priority List — What to Do Next

### Phase 1: Database & Backend Core (Do First)

| # | Task | Why |
|---|------|-----|
| 1 | **Add missing Prisma models** (formations, sessions, inscriptions, presences, evaluations, certifications, reclamations, factures, documents) | Nothing else works without data models |
| 2 | **Create & run migrations** for all new models | Schema must exist in MySQL |
| 3 | **Build Formation CRUD API** (routes + controller) | Core feature of the platform |
| 4 | **Build Session CRUD API** | Sessions are the central entity linking formations, trainers, and participants |
| 5 | **Build Inscription/Enrollment API** | Participants need to enroll in sessions |

### Phase 2: Backend Feature APIs

| # | Task | Why |
|---|------|-----|
| 6 | **Presence/Attendance API** | Required for trainer workflow |
| 7 | **Evaluation API** | Required for trainer grading |
| 8 | **Certification API** | Required for participant certificates |
| 9 | **Reclamation API** | Complaint management |
| 10 | **Facture API** | Finance module |
| 11 | **Self-service routes** (participant profile, trainer profile) | Users need to see their own data |

### Phase 3: Security & Fixes

| # | Task | Why |
|---|------|-----|
| 12 | **Implement token blacklist / refresh tokens** | Logout is insecure |
| 13 | **Fix `trust proxy`** setting | Rate limiting breaks in production |
| 14 | **Fix Math.random()** → `crypto.randomBytes()` | Security vulnerability |
| 15 | **Add protected routes** on frontend | Any user can access any page |

### Phase 4: Frontend — Connect to Real API

| # | Task | Why |
|---|------|-----|
| 16 | **Connect Formation pages** to real API (replace 5 mock pages) | Highest user-facing feature |
| 17 | **Connect Planning/Calendar** to real sessions | Core workflow |
| 18 | **Connect Participant pages** to real API | 4 pages currently mocked |
| 19 | **Connect Trainer pages** to real API | 4 pages currently mocked |
| 20 | **Connect Dashboard** to real stats | Admin sees real data |
| 21 | **Connect Evaluation, Certification, Presence pages** | Remaining mocked pages |

### Phase 5: Polish & Production

| # | Task | Why |
|---|------|-----|
| 22 | **Add Context API or Zustand** for global state | Current localStorage approach is fragile |
| 23 | **Standardize error messages** (French or English) | Inconsistent UX |
| 24 | **Extract shared validate middleware** | DRY principle |
| 25 | **Refactor auth pages** to use MD3 design tokens | Visual consistency |
| 26 | **Add tests** (Jest + React Testing Library) | Zero test coverage |
| 27 | **Add forgot/reset password flow** | Expected UX feature |

---

**Bottom line:** Backend has solid auth + user/role/formateur CRUD. Frontend has a polished design system and routing structure. The **massive gap** is that 25 of 32 frontend pages use mock data, and the backend is missing 9 database models (formations, sessions, inscriptions, presences, evaluations, certifications, reclamations, factures, documents) plus all their associated API routes. Start with Phase 1 — without the data models and Formation/Session APIs, nothing else can be connected.
