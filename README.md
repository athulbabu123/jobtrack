# JobTrack

JobTrack is a full-stack web application for organizing a job search. It gives each user a private workspace to track job applications, monitor their progress, and keep important details such as application dates, job posting links, locations, and notes.

Built with **Next.js, React, TypeScript, PostgreSQL, Prisma ORM, JWT authentication, bcrypt, and Zod**.

---

## Live Demo

[JobTrack](https://jobtrack-mj2z.onrender.com/)

---

## Screenshots



### Landing Page

![JobTrack landing page](./docs/images/landing-page.png)

### Dashboard

![JobTrack dashboard](./docs/images/dashboard.png)

### Applications — Table View

![Applications table](./docs/images/applications-table.png)

### Applications — Kanban View

![Applications kanban board](./docs/images/applications-kanban.png)

### Add Application

![Add application form](./docs/images/add-application.png)

---

## Features

- Create an account and sign in with an email address and password.
- Hash passwords with bcrypt before storing them.
- Keep the signed-in session in an HTTP-only JWT cookie.
- Redirect authenticated visitors from login and signup to their dashboard.
- Navigate to the dashboard from the JobTrack logo while signed in.
- View dashboard totals for applications, interviews, and offers.
- See the most recently applied-to jobs on the dashboard.
- Manage applications using either a table view or Kanban view.
- Drag an application between Kanban status columns to update its status.
- Create, view, edit, and delete job applications.
- Record company, position, status, application date, job posting URL, location, and notes.
- Scope application pages and API operations to the signed-in owner.
- Validate incoming API data with Zod.
- Use responsive layouts styled with Tailwind CSS.

### Application statuses

| Status | Description |
| --- | --- |
| `APPLIED` | An application has been submitted. |
| `INTERVIEWING` | The application is in an interview process. |
| `OFFERED` | An offer has been received. |
| `REJECTED` | The application was rejected or closed. |

---

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL |
| ORM | Prisma ORM 7 with the PostgreSQL driver adapter |
| Authentication | JWT, HTTP-only cookies, bcrypt |
| Validation | Zod |
| Icons | Lucide React |
| Linting | ESLint |

---

## Application Flow

```text
Landing Page
     |
     +-- Sign Up --> Create Account --> Log In --> Dashboard
     |
     +-- Log In -----------------------> Dashboard
                                           |
                              +------------+------------+
                              |                         |
                         Dashboard                 Applications
                                                        |
                                      +-----------------+-----------------+
                                      |                                   |
                                  Table View                         Kanban View
                                      |                                   |
                                      +-----------------+-----------------+
                                                        |
                                             Application Details
                                                        |
                                                  Edit / Delete
```



Signed-out visitors can access the landing, login, and signup pages. The dashboard and application-management pages require a valid session. After successful signup, the user account is created and the user is redirected to `/login`; no session is created at this stage. After successful login, JobTrack creates a session by issuing a signed JWT stored in an HTTP-only cookie, and the user is redirected to `/dashboard`. If an authenticated user opens `/login` or `/signup`, they are redirected to `/dashboard`.

---

## Authentication & Security

JobTrack implements authentication and authorization on the server so a client cannot choose which user's application records to access.

### Authentication

- Signup validates the name, email address, and password.
- Passwords must be at least eight characters and are hashed with bcrypt before they are stored.
- After successful signup, the user account is created and the user is redirected to the login page.
- Login verifies the supplied password against the stored hash.
- Successful login issues a signed JWT that expires after seven days.
- The JWT is stored in a cookie named `token`.
- The cookie is HTTP-only, uses `SameSite=Lax`, and is marked `Secure` in production.
- Server-rendered protected pages check the current user before rendering private content.
- API handlers return an unauthorized response when a request has no valid session.
- Logout deletes the authentication cookie.

### Authorization

Authentication establishes who is signed in; authorization determines which records that user may access. Application reads and writes are scoped to the authenticated user's ID:

```ts
where: {
  userId: user.id,
}
```

The server derives the user ID from the verified session rather than trusting a `userId` sent by the browser. Application pages and API operations verify ownership before returning or changing a record.

---

## Requirements

Before running JobTrack locally, install or configure:

- Node.js and npm compatible with the project's Next.js version.
- A PostgreSQL database that the application can reach.
- A PostgreSQL connection string.
- A long, random JWT secret.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/athulbabu123/jobtrack.git
cd jobtrack
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Create a `.env` file in the repository root:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
```

Replace the example values with credentials for your PostgreSQL database and a locally generated secret. Never commit `.env` or share its contents.

### 4. Apply database migrations

```bash
npx prisma migrate dev
```

This applies the checked-in migrations to the development database. If the Prisma schema has changes without a migration, Prisma may prompt for a migration name.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma and the PostgreSQL adapter. |
| `JWT_SECRET` | Yes | Private secret used to sign and verify JWT authentication tokens. |

Example:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
```

Use a strong, randomly generated `JWT_SECRET` in production. Store production values in your hosting provider's secret settings. `.env*` files are ignored by Git; do not commit database credentials, passwords, or JWT secrets.

---

## Database

The Prisma schema is located at:

```text
prisma/schema.prisma
```

Migration files are stored in:

```text
prisma/migrations/
```

### Useful Prisma commands

Apply development migrations:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Validate the Prisma schema:

```bash
npx prisma validate
```

Check migration status:

```bash
npx prisma migrate status
```

Open Prisma Studio:

```bash
npx prisma studio
```

For production, apply committed migrations with:

```bash
npx prisma migrate deploy
```

Do not use development reset or migration commands against a production database.

---

## Application Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Public landing page. | Public |
| `/signup` | Create a JobTrack account. | Public; unauthenticated users only. Authenticated users are redirected to the dashboard. |
| `/login` | Sign in to an existing account. | Public; unauthenticated users only. Authenticated users are redirected to the dashboard. |
| `/dashboard` | View application, interview, and offer totals and recent applications. | Authenticated |
| `/applications` | View the user's applications in table or Kanban form. | Authenticated |
| `/applications/new` | Create a job application. | Authenticated |
| `/applications/[id]` | View an application's details. | Authenticated; application must belong to the user. |
| `/applications/[id]/edit` | Edit an application. | Authenticated; application must belong to the user. |

When signed in, the JobTrack logo and landing-page login links take the user to `/dashboard`. When signed out, the logo goes to `/` and login links go to `/login`.

---

## API Reference

The backend uses Next.js Route Handlers under `src/app/api/`.

### Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Validate registration details, create the user, and hash the password. |
| `POST` | `/api/auth/login` | Validate credentials and issue an authentication cookie. |
| `POST` | `/api/auth/logout` | Delete the authentication cookie. |



Signup requires a name, a valid email address, and a password of at least eight characters. On success, it creates the user and redirects to `/login`. No session is created during signup. The user must then log in with the newly created account. After successful login, a signed JWT is issued and stored in an HTTP-only cookie, and the user is redirected to `/dashboard`.

### Applications

All application API endpoints require authentication. Records are accessed only in the scope of the signed-in user.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/applications` | List the current user's applications. |
| `POST` | `/api/applications` | Create an application for the current user. |
| `GET` | `/api/applications/[id]` | Get one of the current user's applications. |
| `PATCH` | `/api/applications/[id]` | Update one of the current user's applications. |
| `DELETE` | `/api/applications/[id]` | Delete one of the current user's applications. |

Application creation requires `company`, `position`, `status`, and `appliedDate`. The status must be `APPLIED`, `INTERVIEWING`, `OFFERED`, or `REJECTED`. `url`, `location`, and `notes` are optional. Invalid request data returns a client error with validation details; unauthenticated requests receive `401`.

---

## Data Model

### User

| Field | Description |
| --- | --- |
| `id` | CUID primary key. |
| `name` | User's name. |
| `email` | Unique email address. |
| `passwordHash` | bcrypt password hash. |
| `createdAt` | Creation timestamp. |
| `updatedAt` | Last update timestamp. |
| `applications` | Applications that belong to the user. |

### Application

| Field | Description |
| --- | --- |
| `id` | CUID primary key. |
| `company` | Company name. |
| `position` | Job position. |
| `status` | Current status from `ApplicationStatus`. |
| `appliedDate` | Application date. |
| `url` | Optional job posting URL. |
| `location` | Optional job location. |
| `notes` | Optional notes. |
| `userId` | ID of the owning user. |
| `createdAt` | Creation timestamp. |
| `updatedAt` | Last update timestamp. |

Each application belongs to one user. The relationship is defined in the Prisma schema.

---

## Project Structure

```text
jobtrack/
├── prisma/
│   ├── migrations/               # Versioned database migrations
│   └── schema.prisma             # User and Application models
├── public/                       # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── applications/     # Application API route handlers
│   │   │   └── auth/             # Signup, login, and logout handlers
│   │   ├── applications/         # List, create, detail, and edit pages
│   │   ├── dashboard/            # Authenticated dashboard
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   ├── layout.tsx            # Root layout and shared navbar
│   │   └── page.tsx              # Landing page
│   ├── components/
│   │   ├── ApplicationsView.tsx  # Table and Kanban application views
│   │   ├── AuthForm.tsx          # Login and signup form
│   │   ├── DeleteApplicationButton.tsx
│   │   ├── EditApplicationForm.tsx
│   │   ├── Navbar.tsx
│   │   └── NewApplicationForm.tsx
│   └── lib/
│       ├── auth.ts               # Password, token, and current-user helpers
│       └── prisma.ts             # Prisma Client and PostgreSQL adapter
├── prisma7.config.ts             # Prisma CLI configuration
├── package.json
├── package-lock.json
└── README.md
```

---

## Validation

JobTrack uses **Zod** to validate incoming server requests. Validation includes:

- Email address format.
- Required signup and application fields.
- Minimum password length during signup.
- Application status values.
- Application date parsing.
- Optional job posting URL format.

Browser form constraints improve the user experience, but server-side validation is the source of truth for API requests.

---

## Development Commands

Start the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Validate the Prisma schema:

```bash
npx prisma validate
```

Generate Prisma Client:

```bash
npx prisma generate
```

Create an optimized production build:

```bash
npm run build
```

Start the production server locally:

```bash
npm run start
```

The production server requires a successful `npm run build` first. This repository does not currently define a test script.

---



## Troubleshooting

### `DATABASE_URL` is missing

Make sure `.env` exists in the project root and contains `DATABASE_URL`. Restart the development server after changing environment variables.

### The database connection fails

Check the PostgreSQL host, port, database name, username, password, network access rules, SSL requirements, and connection string. Confirm the database is running and reachable from the application environment.

### Prisma Client is missing or out of date

Run:

```bash
npx prisma generate
```

If the Prisma schema has changed, create and apply a development migration:

```bash
npx prisma migrate dev
```

### Login or signup fails

Check that `JWT_SECRET` is set in the server environment. Restart the server after changing it. Changing the secret invalidates existing sessions, so users must sign in again.

### A protected page redirects to login

Check that the `token` cookie is present and being sent to the same host. In production, use HTTPS because the cookie is marked secure. Expired, invalid, or unverifiable tokens require a new login.

---

## Future Improvements

Potential improvements include:

- Advanced application search, filtering, and analytics.
- Interview scheduling and application deadline reminders.

---

## Author

Athul Babu

- GitHub: `https://github.com/athulbabu123/`
- LinkedIn: `https://www.linkedin.com/in/athulbabu123/`

---
