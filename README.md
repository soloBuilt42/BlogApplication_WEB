# Blog Wave

A full stack blogging platform. Readers browse posts by category, follow writers and
comment; writers get a dashboard with analytics, content management and a markdown editor.

```
client/   React 19 + Vite + Tailwind 4 + Zustand + React Router 7
server/   Express 5 + MongoDB (Mongoose) + JWT + Nodemailer
```

## Getting started

### 1. Server

```bash
cd server
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:8000
```

| Variable | Purpose |
| --- | --- |
| `MONGO_URL` | MongoDB connection string |
| `PORT` | API port (default `8000`) |
| `JWT_SECRET_KEY` | Secret used to sign auth tokens — required |
| `AUTH_EMAIL` / `AUTH_PASSWORD` | SMTP credentials for the writer verification email |
| `MAIL_HOST` / `MAIL_PORT` | SMTP host and port (defaults to Gmail on 587) |

If `AUTH_EMAIL`/`AUTH_PASSWORD` are left blank the OTP is printed to the server console
instead of being emailed, so the verification flow still works in development.

### 2. Client

```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL points at the server
npm run dev            # http://localhost:5173
```

`VITE_GOOGLE_CLIENT_ID` is optional — the "Continue with Google" buttons only appear
when it is set.

## Accounts

* **Reader** — sign up, comment on posts, follow writers.
* **Writer** — chosen on the sign up form, requires a profile picture and an email OTP
  verification step before the first sign in. Unlocks `/dashboard`.

Images (profile pictures and post covers) are resized in the browser and stored as data
URLs, so no external object storage is needed.

## API

Base URL: `http://localhost:8000`

### Auth — `/auth`
| Method | Route | Description |
| --- | --- | --- |
| POST | `/register` | Create an account. Writers receive an OTP and a `PENDING` response |
| POST | `/login` | Email + password sign in |
| POST | `/google-signup` | Sign in / sign up with a Google profile |

### Users — `/users`
| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/verify/:userId/:otp` | – | Verify a writer email with the OTP |
| POST | `/resend-link/:id` | – | Send a fresh OTP |
| POST | `/follower/:id` | ✔ | Follow / unfollow a writer (toggles) |
| PUT | `/update-user` | ✔ | Update name and profile picture |
| GET | `/get-user/:id` | – | Public writer profile |

### Posts — `/posts`
| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | – | Published posts, supports `page`, `limit`, `cat`, `writerId`, `search` |
| GET | `/popular` | – | Top 5 posts by views and top 5 writers by followers |
| GET | `/:postId` | – | A single post (records a view) |
| GET | `/comments/:postId` | – | Comments on a post |
| POST | `/create-post` | ✔ | Create a post |
| POST | `/comment/:id` | ✔ | Comment on a post |
| PATCH | `/update/:id` | ✔ | Update your own post (title, desc, img, cat, status) |
| DELETE | `/:id` | ✔ | Delete your own post, its comments and views |
| DELETE | `/comment/:id/:postId` | ✔ | Delete your own comment |
| POST | `/admin-analytics` | ✔ | Totals plus daily view/follower series |
| POST | `/admin-content` | ✔ | Your posts, paginated |
| POST | `/admin-followers` | ✔ | Your followers, paginated |

Authenticated routes expect `Authorization: Bearer <token>`.

## Client routes

| Route | Page |
| --- | --- |
| `/` | Home — banner, categories, paginated feed |
| `/category?cat=CODING` | Posts in a category |
| `/:slug/:id` | Post detail with markdown body and comments |
| `/writer/:id` | Writer profile, their posts, follow button |
| `/signin`, `/signup` | Auth |
| `/verify/:userId` | Writer email OTP verification |
| `/dashboard` | Analytics (writers only) |
| `/dashboard/contents` | Manage posts — publish toggle, edit, delete |
| `/dashboard/followers` | Follower list |
| `/dashboard/create-post`, `/dashboard/edit-post/:id` | Markdown editor with preview |
